import { beforeAll, describe, expect, it } from "vitest";
import { RecipientUsecases } from "../../src/usecases";
import notchpay from "../bootstrap";
import {
  NotchPayChannel,
  NotchPayCreateRecipientRequest,
} from "../../src/types";

let recipientUsecases: RecipientUsecases;
let testReference: string = "";

beforeAll(() => {
  recipientUsecases = notchpay.recipients;
});

describe("Recipient API integration test", () => {
  it("Should Create a recipient", async () => {
    const recipientData: NotchPayCreateRecipientRequest = {
      channel: NotchPayChannel.MOBILE,
      email: `user${Date.now()}@example.com`,
      name: "Test User",
      country: "CM",
      account_number: "+237656019261",
    };
    const response = await notchpay.recipients.create(recipientData);

    // save reference
    testReference = response.beneficiary.id;

    expect(response.code).toBe(201);
    expect(response.beneficiary).toBeDefined();
  });

  it("Should get a recipient by ID", async () => {
    const response = await recipientUsecases.get(testReference);
    console.log(response);
    expect(response.beneficiary).toBeDefined();
  });

  it("Should get all recipients", async () => {
    const response = await recipientUsecases.getAll();
    expect(response.code).toBe(200);
    expect(response.items).toBeDefined();
  });
});
