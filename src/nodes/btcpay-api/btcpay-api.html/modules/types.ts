import { EditorNodeProperties } from "node-red";
import { BtcpayApiOptions } from "../../shared/types";

export interface BtcpayApiEditorNodeProperties
  extends EditorNodeProperties,
    BtcpayApiOptions {}
