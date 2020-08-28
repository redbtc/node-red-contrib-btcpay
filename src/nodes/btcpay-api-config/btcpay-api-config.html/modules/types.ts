import { EditorNodeProperties } from "node-red";
import {
  BtcpayApiConfigOptions,
  BtcpayApiConfigCredentials,
} from "../../shared/types";

export type BtcpayApiConfigEditorNodeCredentials = BtcpayApiConfigCredentials;

export interface BtcpayApiConfigEditorNodeProperties
  extends EditorNodeProperties,
    BtcpayApiConfigOptions {}
