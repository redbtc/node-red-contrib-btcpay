import { EditorNodeProperties } from "node-red";
import { BtcpayIpnOptions } from "../../shared/types";

export interface BtcpayIpnEditorNodeProperties
  extends EditorNodeProperties,
    BtcpayIpnOptions {}
