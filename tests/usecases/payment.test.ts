import { describe, it, expect, beforeAll } from "vitest";
import { PaymentUsecases } from "../../src/usecases/payment";
import {
  NotchPayChannel,
  NotchPayCreatePaymentRequest,
  NotchPayInitializePaymentRequest,
} from "../../src/types";

import notchpay from '../bootstrap'

let paymentUsecases: PaymentUsecases;
let testReference: string;

const testData: NotchPayCreatePaymentRequest = {
  amount: 100,
  currency: "XAF",
  description: "API Integration Test Payment",
  customer: {
    email: "test@example.com",
    name: "Test User",
  },
};

beforeAll(() => {
  paymentUsecases = notchpay.payments;
});

describe("Payment API Integration Tests", () => {
  it("should create a payment", async () => {
    const result = await paymentUsecases.create(testData);

    // Save the reference for other tests
    testReference = result.transaction.reference;

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
  });

  it("should initialize a payment (legacy method)", async () => {
    const legacyData: NotchPayInitializePaymentRequest = {
      amount: 100,
      currency: "XAF",
      description: "Legacy API Test Payment",
      email: "test@example.com",
      callback: "",
    };

    const result = await paymentUsecases.initialize(legacyData);

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
  });

  it("should get payment details by reference", async () => {
    const result = await paymentUsecases.get(testReference);

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.transaction).toBeDefined();
    expect(result.transaction.reference).toBe(testReference);
  });

  it("should fetch all payments", async () => {
    const result = await paymentUsecases.getAll();

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.items).toBeDefined();
  });

  it("should attempt a direct charge", async () => {
    // Skip this test if no transaction reference is available
    if (!testReference) {
      console.log("Skipping test: No transaction reference available");
      return;
    }

    const chargeData = {
      channel: NotchPayChannel.MOBILE,
      data: {
        phone: process.env.NOTCHPAY_TESTING_SUCCESS_PHONE ?? "",
      },
    };

    const result = await paymentUsecases.directCharge(
      testReference,
      chargeData
    );

    expect(result).toBeDefined();
    expect(result.code).toBe(202);
  });

  it("should attempt to initialize mobile money payment in one step", async () => {
    const result = await paymentUsecases.initializeMobileMoneyPayment(
      testData,
      process.env.NOTCHPAY_TESTING_SUCCESS_PHONE ?? "",
      NotchPayChannel.MOBILE
    );

    expect(result).toBeDefined();
    expect(result.code).toBe(202);
  });
});
