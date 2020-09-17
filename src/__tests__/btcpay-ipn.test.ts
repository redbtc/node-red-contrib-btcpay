import testHelper, { TestFlowsItem } from "node-red-node-test-helper";
import btcpayIpnNode from "../nodes/btcpay-ipn/btcpay-ipn";
import { BtcpayIpnNodeDef } from "../nodes/btcpay-ipn/modules/types";

type FlowsItem = TestFlowsItem<BtcpayIpnNodeDef>;
type Flows = Array<FlowsItem>;

describe("btcpay-ipn node", () => {
  beforeEach((done) => {
    testHelper.startServer(done);
  });

  afterEach((done) => {
    testHelper.unload().then(() => {
      testHelper.stopServer(done);
    });
  });

  it("should be loaded", (done) => {
    const flows: Flows = [{ id: "n1", type: "btcpay-ipn", name: "btcpay-ipn" }];
    testHelper.load(btcpayIpnNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      expect(n1).toBeTruthy();
      expect(n1.name).toEqual("btcpay-ipn");
      done();
    });
  });
});
