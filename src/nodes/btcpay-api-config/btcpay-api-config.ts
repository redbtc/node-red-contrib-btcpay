import { NodeInitializer } from "node-red";
import { BtcpayApiConfigNode, BtcpayApiConfigNodeDef } from "./modules/types";
import { btcpayApiConfigCredentials } from "./modules/config";
import { BtcpayClient } from "../shared/btcpay-client";
import { Cryptography as crypto } from "../shared/cryptography";
import { FetchError } from "node-fetch";

const nodeInit: NodeInitializer = (RED): void => {
  function BtcpayApiConfigNodeConstructor(
    this: BtcpayApiConfigNode,
    config: BtcpayApiConfigNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    if (
      config.url &&
      this.credentials &&
      this.credentials.privKey &&
      this.credentials.token
    ) {
      const keypair = crypto.load_keypair(
        Buffer.from(this.credentials.privKey, "hex")
      );
      this.client = new BtcpayClient(
        config.url,
        keypair,
        this.credentials.token
      );
    }
  }

  RED.nodes.registerType("btcpay-api-config", BtcpayApiConfigNodeConstructor, {
    credentials: btcpayApiConfigCredentials,
  });

  RED.httpAdmin.post("/btcpay/pair-client/", async (req, res) => {
    try {
      const privKey = crypto.generate_keypair().getPrivate("hex");
      const resPair = await new BtcpayClient(
        req.body.url,
        crypto.load_keypair(Buffer.from(privKey, "hex")),
        ""
      ).pairClient(req.body.pairCode);
      res.send({
        privKey,
        token: resPair.merchant,
      });
    } catch (err) {
      if (err instanceof FetchError) {
        res.status(400).send(err.message);
      } else {
        if (err.message === "pairing code is not valid") {
          res.status(400).send(err.message);
        } else {
          res.status(500).send(err.message);
        }
      }
    }
  });
};

export = nodeInit;
