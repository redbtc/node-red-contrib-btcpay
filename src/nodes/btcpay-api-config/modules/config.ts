import { NodeCredentials } from "node-red";
import { BtcpayApiConfigCredentials } from "../shared/types";

export const btcpayApiConfigCredentials: NodeCredentials<BtcpayApiConfigCredentials> = {
  token: { type: "text" },
  privKey: { type: "text" },
};
