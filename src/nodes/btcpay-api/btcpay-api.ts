import { NodeInitializer, NodeStatus, NodeMessageInFlow } from "node-red";
import { BtcpayApiNode, BtcpayApiNodeDef } from "./modules/types";
import { BtcpayApiConfigNode } from "../btcpay-api-config/modules/types";
import { BtcpayClientPayload } from "../shared/btcpay-client";

const statuses: Record<
  "idle" | "misconfigured" | "error" | "sending" | "blank",
  NodeStatus
> = {
  idle: { fill: "green", shape: "dot", text: "idle" },
  misconfigured: {
    fill: "red",
    shape: "ring",
    text: "misconfigured",
  },
  error: { fill: "red", shape: "ring", text: "error" },
  sending: { fill: "blue", shape: "dot", text: "sending" },
  blank: {},
};

interface BtcpayMessage extends NodeMessageInFlow {
  method?: unknown;
  path?: unknown;
  payload?: unknown;
}
const nodeInit: NodeInitializer = (RED): void => {
  function BtcpayApiNodeConstructor(
    this: BtcpayApiNode,
    config: BtcpayApiNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    if (!config.client) {
      this.status(statuses.misconfigured);
      return;
    }

    const clientNode = RED.nodes.getNode(config.client) as BtcpayApiConfigNode;
    if (!clientNode || !clientNode.client) {
      this.status(statuses.misconfigured);
      return;
    }

    const btcpayClient = clientNode.client;

    this.on("input", async (msg: BtcpayMessage, send, done) => {
      const method = config.method || msg.method;
      if (
        method !== "GET" &&
        method !== "POST" &&
        method !== "PUT" &&
        method !== "DELETE"
      ) {
        done(new Error("Invalid Method: " + method));
        return;
      }

      const path = config.path || msg.path;
      if (typeof path !== "string") {
        done(new Error("Invalid Path: " + path));
        return;
      }

      const payload = (msg.payload as BtcpayClientPayload) || {};
      if (typeof payload !== "object") {
        done(new Error("Invalid Payload: " + payload));
        return;
      }

      try {
        this.status(statuses.sending);
        const resData = await btcpayClient.signedRequest(method, path, payload);
        this.status(statuses.idle);
        msg.payload = resData;
      } catch (e) {
        this.status(statuses.error);
        done(e);
        return;
      }

      send(msg);
      done();
    });

    this.on("close", () => {
      this.status({});
    });

    this.status(statuses.idle);
  }

  RED.nodes.registerType("btcpay-api", BtcpayApiNodeConstructor);
};

export = nodeInit;
