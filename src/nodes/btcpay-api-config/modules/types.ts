import { Node, NodeDef } from "node-red";
import { BtcpayClient } from "../../shared/btcpay-client";
import {
  BtcpayApiConfigOptions,
  BtcpayApiConfigCredentials,
} from "../shared/types";

export interface BtcpayApiConfigNodeDef
  extends NodeDef,
    BtcpayApiConfigOptions {}

export interface BtcpayApiConfigNode extends Node<BtcpayApiConfigCredentials> {
  client?: BtcpayClient;
}
