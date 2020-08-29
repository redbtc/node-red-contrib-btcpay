// Credits:
// The btcpay-client.ts partially uses code from https://github.com/btcpayserver/node-btcpay/blob/master/src/core/client.ts
// which was modified and optimized for generic api calls

import fetch from "node-fetch";
import elliptic from "elliptic";
import qs from "querystring";

import { Cryptography as crypto } from "./cryptography";

const userAgent = "node-red-contrib-btcpay";

const commonHeaders: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "User-Agent": userAgent,
  "X-Accept-Version": "2.0.0",
};

export type BtcpayClientPayload = Record<
  string,
  | string
  | number
  | boolean
  | readonly string[]
  | readonly number[]
  | readonly boolean[]
  | null
>;
interface ApiResponse {
  data: unknown;
}
type ClientResponse = ApiResponse["data"];

export class BtcpayClient {
  private clientId: string;
  constructor(
    private host: string,
    private keyPair: elliptic.ec.KeyPair,
    private token: string
  ) {
    this.host = this.host.replace(/\/+$/, "");
    this.clientId = crypto.get_sin_from_key(keyPair);
  }

  public async pairClient(code: string): Promise<Record<string, string>> {
    const re = new RegExp("^\\w{7}$");

    if (!re.test(code)) {
      throw new Error("pairing code is not valid");
    }

    const payload = {
      id: this.clientId,
      pairingCode: code,
    };

    const data = await this.unsignedPostRequest("/tokens", payload);
    const d = (data as { facade: string; token: string }[])[0];
    const res: Record<string, string> = {};
    res[d.facade] = d.token;
    return res;
  }

  public signedRequest(
    method: "GET" | "POST",
    path: string,
    payload: BtcpayClientPayload = {}
  ): Promise<ClientResponse> {
    switch (method) {
      case "GET": {
        return this.signedGetRequest(path, payload);
      }
      case "POST": {
        return this.signedPostRequest(path, payload);
      }
    }
  }

  private createSignedHeaders(uri: string, payload: string) {
    return {
      "X-Identity": Buffer.from(
        this.keyPair.getPublic().encodeCompressed()
      ).toString("hex"),
      "X-Signature": crypto.sign(uri + payload, this.keyPair).toString("hex"),
    };
  }

  private async signedGetRequest(
    path: string,
    payload: BtcpayClientPayload = {}
  ): Promise<ClientResponse> {
    payload.token = this.token;

    const uri = this.host + path;
    const qPayload = "?" + qs.stringify(payload);

    const headers = Object.assign(
      {},
      commonHeaders,
      this.createSignedHeaders(uri, qPayload)
    );

    const response = await fetch(uri + qPayload, { headers });
    const respJson = (await response.json()) as ApiResponse;
    return respJson.data;
  }

  // private async unsignedGetRequest(
  //   path: string,
  //   payload: Payload = {}
  // ): Promise<ClientResponse> {
  //   const uri = this.host + path;
  //   const qPayload = "?" + qs.stringify(payload);

  //   const headers = Object.assign({}, commonHeaders);

  //   const response = await fetch(uri + qPayload, { headers });
  //   const respJson = (await response.json()) as ApiResponse;
  //   return respJson.data;
  // }

  private async signedPostRequest(
    path: string,
    payload: BtcpayClientPayload = {}
  ): Promise<ClientResponse> {
    payload.token = this.token;

    const uri = this.host + path;
    const body = JSON.stringify(payload);
    const headers = Object.assign(
      {},
      commonHeaders,
      this.createSignedHeaders(uri, body)
    );

    const response = await fetch(uri, { headers, body, method: "post" });
    const respJson = (await response.json()) as ApiResponse;
    return respJson.data;
  }

  private async unsignedPostRequest(
    path: string,
    payload: BtcpayClientPayload = {}
  ): Promise<ClientResponse> {
    const uri = this.host + path;
    const body = JSON.stringify(payload);
    const headers = Object.assign({}, commonHeaders);

    const response = await fetch(uri, { headers, body, method: "post" });
    const respJson = (await response.json()) as ApiResponse;
    return respJson.data;
  }
}
