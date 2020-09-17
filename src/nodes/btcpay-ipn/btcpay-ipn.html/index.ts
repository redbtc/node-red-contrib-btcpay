import { EditorRED } from "node-red";
import { BtcpayIpnEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<BtcpayIpnEditorNodeProperties>("btcpay-ipn", {
  category: "bitcoin",
  color: "#CEDC21",
  defaults: {
    client: { value: "", type: "btcpay-api-config", required: true },
    url: { value: "", required: true },
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
    if (this.url) {
      let url = RED.settings.httpNodeRoot || "";
      if (url.slice(-1) !== "/") {
        url = url + "/";
      }
      if (this.url.charAt(0) === "/") {
        url += this.url.slice(1);
      } else {
        url += this.url;
      }
      return url;
    } else {
      return "Notification";
    }
  },
  oneditprepare: function () {
    let root = RED.settings.httpNodeRoot || "";
    if (root.slice(-1) == "/") {
      root = root.slice(0, -1);
    }
    if (root == "") {
      $("#node-input-tip").hide();
    } else {
      $("#node-input-path").html(root);
      $("#node-input-tip").show();
    }
  },
  oneditsave: function () {
    let val = $("#node-input-url").val()?.toString() || "";
    val = val.trim();
    if (val.length > 0) {
      if (val.substr(0, 1) !== "/") {
        val = "/" + val;
      }
    }
    $("#node-input-url").val(val);
  },
});
