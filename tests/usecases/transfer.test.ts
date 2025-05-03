import { beforeAll, describe, expect, it } from "vitest";
import { TransferUsecases } from "../../src/usecases";
import notchpay from "../bootstrap";
import {
  NotchPayChannel,
  NotchPayCreateRecipientRequest,
  NotchPayInitializeTransferRequest,
} from "../../src/types";

let transferUsecases: TransferUsecases;
let testReference: string = "";

beforeAll(() => {
  transferUsecases = notchpay.transfers;
});

describe("Transfer API integration test", () => {
  it("Should Create a transfer", async () => {
    // create recipient
    const recipientData: NotchPayCreateRecipientRequest = {
      channel: NotchPayChannel.MOBILE,
      email: `user${Date.now()}@example.com`,
      name: "Test User",
      country: "CM",
      account_number: "+237656019261",
    };
    const recipientResponse = await notchpay.recipients.create(recipientData);

    // initiate transfer
    const transferData: NotchPayInitializeTransferRequest = {
      recipient: recipientResponse.beneficiary.id,
      currency: "XAF",
      amount: 100,
      description: "Create recipient Test testing ",
      channel: NotchPayChannel.MOBILE,
    };

    const transferResponse = await transferUsecases.initialize(transferData);

    // save the reference for other tests
    testReference = transferResponse.transfer.reference;

    expect(transferResponse.transfer).toBeDefined();
    expect(transferResponse.code).toBe(201);
    expect(transferResponse.transfer.reference).toBeDefined();
  });

  it("Should retrieve a transfer", async () => {
    const response = await transferUsecases.get(testReference);
    expect(response.code).toBe(200);
    expect(response.transfer.reference).toBe(testReference);
  });

  it("Should list transfers", async () => {
    const response = await transferUsecases.getAll();

    expect(response.items).toBeDefined();
    expect(response.code).toBe(200);
  });
});
