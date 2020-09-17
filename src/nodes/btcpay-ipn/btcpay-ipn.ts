import bodyParser from "body-parser";
import { ErrorRequestHandler, RequestHandler } from "express";
import { NodeInitializer, NodeMessageInFlow, NodeStatus } from "node-red";
import { BtcpayApiConfigNode } from "../btcpay-api-config/modules/types";
import {
  BtcpayIpnNode,
  BtcpayIpnNodeDef,
  isBtcpayIpnPostData,
} from "./modules/types";

type Statuses = Record<
  "misconfigured" | "error" | "listening" | "blank",
  NodeStatus
>;

const statuses: Statuses = {
  misconfigured: {
    fill: "red",
    shape: "ring",
    text: "misconfigured",
  },
  error: { fill: "red", shape: "dot", text: "error" },
  listening: {
    fill: "green",
    shape: "dot",
    text: "listening",
  },
  blank: {},
};

const nodeInit: NodeInitializer = (RED): void => {
  function BtcpayIpnNodeConstructor(
    this: BtcpayIpnNode,
    config: BtcpayIpnNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    if (RED.settings.httpNodeRoot === false) {
      this.warn("Cannot create btcpay-ipn node when httpNodeRoot set to false");
      this.status(statuses.error);
      return;
    }

    if (!config.client) {
      this.status(statuses.misconfigured);
      return;
    }

    if (!config.url) {
      this.status(statuses.misconfigured);
      return;
    }

    const clientNode = RED.nodes.getNode(config.client) as BtcpayApiConfigNode;
    if (!clientNode || !clientNode.client) {
      this.status(statuses.misconfigured);
      return;
    }

    const btcpayClient = clientNode.client;

    let url = config.url;
    if (url[0] !== "/") {
      url = "/" + url;
    }

    const errorHandler: ErrorRequestHandler = (err, _req, res, _next): void => {
      this.error(err);
      res.sendStatus(500);
      this.status(statuses.error);
    };

    const postHandler: RequestHandler = async (req, res): Promise<void> => {
      const data = req.body;
      if (!isBtcpayIpnPostData(data)) {
        res.status(400).send("wrong data");
        this.error("invalid incoming data (no invoice id)");
      } else {
        try {
          const resData = await btcpayClient.signedRequest(
            "GET",
            "/invoices/" + data.id
          );
          const msg: NodeMessageInFlow = {
            _msgid: RED.util.generateId(),
            payload: resData,
          };
          this.send(msg);
          res.status(200).end();
        } catch (e) {
          this.status(statuses.error);
          res.status(500).send("could not process the notification");
          this.error("could not process the notification: " + e);
          return;
        }
      }

      // status = time of the last notification
      this.status({
        ...statuses.listening,
        text: new Date().toISOString(),
      });
    };

    const jsonParser = bodyParser.json({ limit: "100kb" });

    this.status({
      ...statuses.listening,
      text: "no notifications yet",
    });

    // add listener
    RED.httpNode.post(url, jsonParser, postHandler, errorHandler);

    this.on("close", () => {
      // remove listener(s)
      (RED.httpNode._router.stack as {
        route?: {
          path: string;
          methods: { post?: unknown };
        };
      }[]).forEach((route, i, routes) => {
        if (
          route.route &&
          route.route.path === url &&
          route.route.methods.post
        ) {
          routes.splice(i, 1);
        }
      });
    });
  }

  RED.nodes.registerType("btcpay-ipn", BtcpayIpnNodeConstructor);
};

export = nodeInit;
