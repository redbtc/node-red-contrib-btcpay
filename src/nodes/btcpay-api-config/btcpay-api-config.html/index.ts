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
  },
  credentials: btcpayApiConfigCredentials,
  label: function () {
    return this.name || "BTCPay API client config";
  },
  oneditprepare: function () {
    /** Functions **/

    const pairClient = () => {
      $.post({
        url: "btcpay/pair-client/",
        data: {
          url: $("#node-config-input-url").val(),
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
      const url = $("#node-config-input-url").val();
      const pairCode = $("#btcpayPairCode").val();
      const canPair = url && pairCode;
      $("#btcpayPair").prop("disabled", !canPair);
      $("#btcpayPairContainer").attr("style", !canPair ? "opacity:0.5" : "");
    };

    /** Events **/

    $("#node-config-input-url,#btcpayPairCode").on("keyup change", () => {
      updPairControl();
    });

    $("#btcpayPair").on("click", (evt) => {
      evt.preventDefault();
      pairClient();
    });

    $(".btcpay-toggle-password").on("click", (evt) => {
      evt.preventDefault();
      const $toggle = $(evt.target);
      $toggle.toggleClass("fa-eye fa-eye-slash");
      const $input = $($toggle.data("toggle"));
      const inpType = $input.attr("type");
      if (inpType === "password") {
        $input.attr("type", "text");
      } else if (inpType === "text") {
        $input.attr("type", "password");
      }
    });

    /** Init **/
    updPairControl();
  },
});
