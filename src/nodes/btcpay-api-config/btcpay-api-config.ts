import { NodeInitializer } from "node-red";
import { BtcpayApiConfigNode, BtcpayApiConfigNodeDef } from "./modules/types";
import { btcpayApiConfigCredentials } from "./modules/config";
import { BtcpayClient } from "../shared/btcpay-client";
import { Cryptography as crypto } from "../shared/cryptography";

const nodeInit: NodeInitializer = (RED): void => {
  function BtcpayApiConfigNodeConstructor(
    this: BtcpayApiConfigNode,
    config: BtcpayApiConfigNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    if (
      config.host &&
      this.credentials &&
      this.credentials.privKey &&
      this.credentials.token
    ) {
      const keypair = crypto.load_keypair(
        Buffer.from(this.credentials.privKey, "hex")
      );
      this.client = new BtcpayClient(
        config.host,
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
        req.body.host,
        crypto.load_keypair(Buffer.from(privKey, "hex")),
        ""
      ).pairClient(req.body.pairCode);
      res.send({
        privKey,
        token: resPair.merchant,
      });
    } catch (err) {
      const errMsg = err.message;
      if (errMsg === "pairing code is not valid") {
        res.status(400).send(errMsg);
      } else {
        res.status(500).send(errMsg);
      }
    }
  });
};

export = nodeInit;
