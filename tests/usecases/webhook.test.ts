import { beforeAll, describe, it, expect } from 'vitest';
import { WebhookUsecase } from '../../src/usecases';
import { 
  NotchPayCreateWebhookRequest, 
  NotchPayUpdateWebhookRequest,
  NotchPayWebhookEventType 
} from '../../src/types';
import notchpay from '../bootstrap';

let webhookUsecases: WebhookUsecase;
let testWebhookId: string = '';

beforeAll(() => {
    webhookUsecases = notchpay.webhooks;
});

describe('Webhook API Integration Tests', () => {
  it('should create a webhook', async () => {
    const webhookData: NotchPayCreateWebhookRequest = {
      url: 'https://example.com/test-webhook',
      events: [
        NotchPayWebhookEventType.PAYMENT_COMPLETE,
        NotchPayWebhookEventType.PAYMENT_FAILED
      ],
      description: 'Test webhook for API integration tests',
      active: true
    };

    const result = await webhookUsecases.create(webhookData);

    // Save webhook ID for other tests
    testWebhookId = result.webhook.id;

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.webhook).toBeDefined();
    expect(result.webhook.url).toBe(webhookData.url);
    expect(result.webhook.events).toContain('payment.complete');
    expect(result.webhook.events).toContain('payment.failed');
    expect(result.webhook.active).toBe(true);
  });

  it('should retrieve a webhook by ID', async () => {
    const result = await webhookUsecases.retrieve(testWebhookId);

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.webhook).toBeDefined();
    expect(result.webhook.id).toBe(testWebhookId);
    expect(result.webhook.url).toBe('https://example.com/test-webhook');
  });

  it('should list all webhooks', async () => {
    const result = await webhookUsecases.list(30, 1);

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.items).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.totals).toBeGreaterThanOrEqual(1);
    
    // Check if our test webhook is in the list
    const ourWebhook = result.items.find(webhook => webhook.id === testWebhookId);
    expect(ourWebhook).toBeDefined();
  });

  it('should list webhooks with custom pagination', async () => {
    const result = await webhookUsecases.list(10, 1);

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.items).toBeDefined();
    expect(result.items.length).toBeLessThanOrEqual(10);
    expect(result.selected).toBeLessThanOrEqual(10);
  });

  it('should update a webhook', async () => {
    const updateData: NotchPayUpdateWebhookRequest = {
      events: [
        NotchPayWebhookEventType.PAYMENT_COMPLETE,
        NotchPayWebhookEventType.PAYMENT_FAILED,
        NotchPayWebhookEventType.TRANSFER_COMPLETE
      ],
      description: 'Updated test webhook for API integration tests',
      active: false
    };

    const result = await webhookUsecases.update(testWebhookId, updateData);

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.webhook).toBeDefined();
    expect(result.webhook.id).toBe(testWebhookId);
    expect(result.webhook.events).toContain('transfer.complete');
    expect(result.webhook.description).toBe(updateData.description);
    expect(result.webhook.active).toBe(false);
  });

  it('should update webhook URL', async () => {
    const updateData: NotchPayUpdateWebhookRequest = {
      url: 'https://example.com/updated-webhook-endpoint',
      active: true
    };

    const result = await webhookUsecases.update(testWebhookId, updateData);

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.webhook.url).toBe(updateData.url);
    expect(result.webhook.active).toBe(true);
  });

  it('should delete a webhook', async () => {
    const result = await webhookUsecases.delete(testWebhookId);

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.message).toBeDefined();
  });

  it('should handle webhook not found error', async () => {
    const nonExistentId = 'webhook_nonexistent_123';
    
    await expect(webhookUsecases.retrieve(nonExistentId)).rejects.toThrow();
  });

  it('should handle invalid webhook data on create', async () => {
    const invalidWebhookData = {
      url: 'invalid-url', // Invalid URL format
      events: [],  // Empty events array
    } as NotchPayCreateWebhookRequest;

    await expect(webhookUsecases.create(invalidWebhookData)).rejects.toThrow();
  });

  it('should create webhook with all event types', async () => {
    const webhookData: NotchPayCreateWebhookRequest = {
      url: 'https://example.com/comprehensive-webhook',
      events: [
        NotchPayWebhookEventType.PAYMENT_CREATED,
        NotchPayWebhookEventType.PAYMENT_PROCESSING,
        NotchPayWebhookEventType.PAYMENT_COMPLETE,
        NotchPayWebhookEventType.PAYMENT_FAILED,
        NotchPayWebhookEventType.PAYMENT_CANCELED,
        NotchPayWebhookEventType.PAYMENT_EXPIRED,
        NotchPayWebhookEventType.TRANSFER_CREATED,
        NotchPayWebhookEventType.TRANSFER_PROCESSING,
        NotchPayWebhookEventType.TRANSFER_COMPLETE,
        NotchPayWebhookEventType.TRANSFER_FAILED,
        NotchPayWebhookEventType.CUSTOMER_CREATED,
        NotchPayWebhookEventType.CUSTOMER_UPDATED,
      ],
      description: 'Comprehensive test webhook with all event types'
    };

    const result = await webhookUsecases.create(webhookData);

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.webhook.events.length).toBe(12);
    
    // Clean up
    await webhookUsecases.delete(result.webhook.id);
  });

  it('should create webhook with minimal data', async () => {
    const minimalWebhookData: NotchPayCreateWebhookRequest = {
      url: 'https://example.com/minimal-webhook',
      events: [NotchPayWebhookEventType.PAYMENT_COMPLETE]
    };

    const result = await webhookUsecases.create(minimalWebhookData);

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.webhook.url).toBe(minimalWebhookData.url);
    expect(result.webhook.events).toContain('payment.complete');
    expect(result.webhook.active).toBe(true); // Should default to true
    
    // Clean up
    await webhookUsecases.delete(result.webhook.id);
  });
});