import { EditorRED } from "node-red";
import { BtcpayApiEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<BtcpayApiEditorNodeProperties>("btcpay-api", {
  category: "function",
  color: "#a6bbcf",
  defaults: {
    method: { value: "GET" },
    path: { value: "" },
    client: { value: "", type: "btcpay-api-config", required: true },
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "file.png",
  paletteLabel: "btcpay api",
  label: function () {
    return this.name || "btcpay api";
  },
});
