import testHelper, { TestFlowsItem } from "node-red-node-test-helper";
import btcpayApiNode from "../nodes/btcpay-api/btcpay-api";
import { BtcpayApiNodeDef } from "../nodes/btcpay-api/modules/types";

type FlowsItem = TestFlowsItem<BtcpayApiNodeDef>;
type Flows = Array<FlowsItem>;

describe("btcpay-api node", () => {
  beforeEach((done) => {
    testHelper.startServer(done);
  });

  afterEach((done) => {
    testHelper.unload().then(() => {
      testHelper.stopServer(done);
    });
  });

  it("should be loaded", (done) => {
    const flows: Flows = [{ id: "n1", type: "btcpay-api", name: "btcpay-api" }];
    testHelper.load(btcpayApiNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      expect(n1).toBeTruthy();
      expect(n1.name).toEqual("btcpay-api");
      done();
    });
  });
});
