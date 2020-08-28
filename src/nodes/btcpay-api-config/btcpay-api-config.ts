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

  RED.httpAdmin.get("/btcpay/gen-priv-key/", (_req, res) => {
    const privKey = crypto.generate_keypair().getPrivate("hex");
    res.send(privKey);
  });

  RED.httpAdmin.post("/btcpay/pair-client/", async (req, res) => {
    try {
      const resPair = await new BtcpayClient(
        req.params.url,
        crypto.load_keypair(Buffer.from(req.params.privKey, "hex")),
        ""
      ).pairClient(req.params.pairCode);
      res.send(resPair.merchant);
    } catch (err) {
      res.status(500).send(err.toString());
    }
  });
};

export = nodeInit;
