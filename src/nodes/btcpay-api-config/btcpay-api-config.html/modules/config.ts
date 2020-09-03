import { EditorNodeCredentials } from "node-red";
import { BtcpayApiConfigCredentials } from "../../shared/types";

export const btcpayApiConfigCredentials: EditorNodeCredentials<BtcpayApiConfigCredentials> = {
  url: { type: "text" },
  token: { type: "text" },
  privKey: { type: "text" },
};
