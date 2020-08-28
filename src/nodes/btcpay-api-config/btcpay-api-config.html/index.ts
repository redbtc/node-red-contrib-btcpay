import { EditorRED } from "node-red";
import {
  BtcpayApiConfigEditorNodeProperties,
  BtcpayApiConfigEditorNodeCredentials,
} from "./modules/types";
import { btcpayApiConfigCredentials } from "./modules/config";

declare const RED: EditorRED;

RED.nodes.registerType<
  BtcpayApiConfigEditorNodeProperties,
  BtcpayApiConfigEditorNodeCredentials
>("btcpay-api-config", {
  category: "config",
  defaults: {
    name: { value: "" },
    host: { value: "", required: true },
  },
  credentials: btcpayApiConfigCredentials,
  label: function () {
    return this.name || "btcpay api config";
  },
  oneditprepare: function () {
    /** Functions **/

    const pairClient = () => {
      $.post({
        url: "btcpay/pair-client/",
        data: {
          host: $("#node-config-input-host").val(),
          pairCode: $("#btcpayPairCode").val(),
        },
      })
        .done((response) => {
          if (response && response.privKey && response.token) {
            $("#node-config-input-privKey").val(response.privKey);
            $("#node-config-input-token").val(response.token);
            updPairControl();
            RED.notifications.notify("Client successfully paired", "success");
          } else {
            RED.notifications.notify(
              "Could not pair client: invalid response",
              "error"
            );
          }
        })
        .fail((xhr) => {
          if (xhr.status === 400) {
            RED.notifications.notify(
              "Could not pair client: " + xhr.responseText,
              "error"
            );
          } else if (xhr.status === 500) {
            RED.notifications.notify(
              "Could not pair client: server error",
              "error"
            );
          } else {
            RED.notifications.notify(
              "Could not pair client: unhandled exception",
              "error"
            );
          }
        });
    };

    const updPairControl = () => {
      const host = $("#node-config-input-host").val();
      const pairCode = $("#btcpayPairCode").val();
      const canPair = host && pairCode;
      $("#btcpayPair").prop("disabled", !canPair);
      $("#btcpayPairContainer").attr("style", !canPair ? "opacity:0.5" : "");
    };

    /** Events **/

    $("#node-config-input-host,#btcpayPairCode").on("keyup change", () => {
      updPairControl();
    });

    $("#btcpayPair").on("click", (evt) => {
      evt.preventDefault();
      pairClient();
    });

    /** Init **/
    updPairControl();
  },
});
