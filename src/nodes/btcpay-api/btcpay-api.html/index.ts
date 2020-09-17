import { EditorRED } from "node-red";
import { BtcpayApiEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<BtcpayApiEditorNodeProperties>("btcpay-api", {
  category: "bitcoin",
  color: "#CEDC21",
  defaults: {
    method: { value: "GET" },
    path: { value: "" },
    client: { value: "", type: "btcpay-api-config", required: true },
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "btcpay-logo.svg",
  paletteLabel: "btcpay api",
  label: function () {
    if (this.name) {
      return this.name;
    }
    return (
      this.method +
      " " +
      (this.path.length > 20 ? this.path.substr(0, 20) + "…" : this.path)
    );
  },
  oneditsave: function () {
    let val = $("#node-input-path").val()?.toString() || "";
    val = val.trim();
    if (val.length > 0) {
      if (val.substr(0, 1) !== "/") {
        val = "/" + val;
      }
    }
    $("#node-input-path").val(val);
  },
});
