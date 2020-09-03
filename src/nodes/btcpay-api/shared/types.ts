export interface BtcpayApiOptions {
  client: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "";
  path: string;
}
