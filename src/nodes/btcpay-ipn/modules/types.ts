import { Node, NodeDef } from "node-red";
import { BtcpayIpnOptions } from "../shared/types";

export interface BtcpayIpnNodeDef extends NodeDef, BtcpayIpnOptions {}

// export interface BtcpayIpnNode extends Node {}
export type BtcpayIpnNode = Node;

export interface BtcpayIpnPostData {
  id: string; // Invoice Id
}

export function isBtcpayIpnPostData(data: unknown): data is BtcpayIpnPostData {
  return (
    typeof data === "object" &&
    typeof (data as Partial<BtcpayIpnPostData>)?.id === "string" &&
    (data as BtcpayIpnPostData).id !== ""
  );
}
