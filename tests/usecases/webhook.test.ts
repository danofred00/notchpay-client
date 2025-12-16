import { beforeAll, describe, it, expect } from "vitest";
import { WebhookUsecase } from "../../src/usecases";
import {
  NotchPayCreateWebhookRequest,
  NotchPayWebhookEventType,
} from "../../src/types";
import notchpay from "../bootstrap";

let webhookUsecases: WebhookUsecase;
let testWebhookId: string = "";

beforeAll(() => {
  webhookUsecases = notchpay.webhooks;
});

describe("Webhook API Integration Tests", () => {
  it("should create a webhook", async () => {
    const webhookData: NotchPayCreateWebhookRequest = {
      url: "https://example.com/test-webhook",
      events: [
        NotchPayWebhookEventType.PAYMENT_COMPLETE,
        NotchPayWebhookEventType.PAYMENT_FAILED,
      ],
      description: "Test webhook for API integration tests",
      active: true,
    };

    const result = await webhookUsecases.create(webhookData);

    // Save webhook ID for other tests
    testWebhookId = result.endpoint.id;

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.endpoint).toBeDefined();
    expect(result.endpoint.events).toContain("payment.complete");
    expect(result.endpoint.events).toContain("payment.failed");
  });

  it("should list all webhooks", async () => {
    const result = await webhookUsecases.list(30, 1);

    console.log(result);

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.endpoints).toBeDefined();
    expect(Array.isArray(result.endpoints)).toBe(true);
    expect(result.totals).toBeGreaterThanOrEqual(1);
  });

  it("should handle webhook not found error", async () => {
    const nonExistentId = "webhook_nonexistent_123";

    await expect(webhookUsecases.retrieve(nonExistentId)).rejects.toThrow();
  });
});
