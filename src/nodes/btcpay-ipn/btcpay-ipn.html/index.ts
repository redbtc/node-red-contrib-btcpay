import { EditorRED } from "node-red";
import { BtcpayIpnEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<BtcpayIpnEditorNodeProperties>("btcpay-ipn", {
  category: "bitcoin",
  color: "#CEDC21",
  defaults: {
    client: { value: "", type: "btcpay-api-config", required: true },
    path: { value: "", required: true },
    name: { value: "" },
  },
  inputs: 0,
  outputs: 1,
  icon: "btcpay-logo.svg",
  paletteLabel: "btcpay ipn",
  label: function () {
    if (this.name) {
      return this.name;
    }
    if (this.path) {
      let path = RED.settings.httpNodeRoot || "";
      if (path.slice(-1) !== "/") {
        path = path + "/";
      }
      if (this.path.charAt(0) === "/") {
        path += this.path.slice(1);
      } else {
        path += this.path;
      }
      return path;
    } else {
      return "IPN";
    }
  },
  oneditprepare: function () {
    let root = RED.settings.httpNodeRoot || "";
    if (root.slice(-1) == "/") {
      root = root.slice(0, -1);
    }
    if (root == "") {
      $("#form-tips").hide();
    } else {
      $("#form-tips-path").html(root);
      $("#form-tips").show();
    }
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
