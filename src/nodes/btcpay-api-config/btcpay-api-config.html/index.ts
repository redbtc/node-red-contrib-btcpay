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
    const updPairControl = () => {
      const url = $("#node-config-input-url").val();
      const privKey = $("#node-config-input-privKey").val();
      const canPair = url && privKey;
      $("#btcpayPair").prop("disabled", !canPair);
      $("#btcpayPairContainer").attr("style", !canPair ? "opacity:0.5" : "");
    };

    $("#node-config-input-url,#node-config-input-privKey").keyup(() => {
      updPairControl();
    });
  },
});
