import { EditorNodeCredentials } from "node-red";
import { BtcpayApiConfigCredentials } from "../../shared/types";

export const btcpayApiConfigCredentials: EditorNodeCredentials<BtcpayApiConfigCredentials> = {
  token: { type: "text" },
  privKey: { type: "text" },
};
