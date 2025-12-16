import { Usecase } from "./base";
import {
  NotchPayCreateWebhookRequest,
  NotchPayUpdateWebhookRequest,
  NotchPayCreateWebhookResponse,
  NotchPayGetWebhookResponse,
  NotchPayUpdateWebhookResponse,
  NotchPayDeleteWebhookResponse,
  NotchPayListWebhooksResponse,
} from "../types";
import { AxiosInstance } from "axios";

export class WebhookUsecase extends Usecase {
  #privateKey: string;

  constructor(privateKey: string, client: AxiosInstance) {
    super(client);
    this.#privateKey = privateKey;
  }

  /**
   * Create a new webhook endpoint
   * @param webhookData Webhook creation data
   * @returns Promise with webhook creation response
   */
  public async create(webhookData: NotchPayCreateWebhookRequest) {
    const response = await this.client.post<NotchPayCreateWebhookResponse>(
      "/webhooks",
      webhookData,
      { headers: { "X-Grant": this.#privateKey } }
    );
    return response.data;
  }

  /**
   * Retrieve a specific webhook by ID
   * @param webhookId ID of the webhook to retrieve
   * @returns Promise with webhook data
   */
  public async retrieve(webhookId: string) {
    const response = await this.client.get<NotchPayGetWebhookResponse>(
      `/webhooks/${webhookId}`
    );
    return response.data;
  }

  /**
   * Update an existing webhook
   * @param webhookId ID of the webhook to update
   * @param webhookData Webhook update data
   * @returns Promise with updated webhook data
   */
  public async update(
    webhookId: string,
    webhookData: NotchPayUpdateWebhookRequest
  ) {
    const response = await this.client.put<NotchPayUpdateWebhookResponse>(
      `/webhooks/${webhookId}`,
      webhookData
    );
    return response.data;
  }

  /**
   * Delete a webhook endpoint
   * @param webhookId ID of the webhook to delete
   * @returns Promise with deletion confirmation
   */
  public async delete(webhookId: string) {
    const response = await this.client.delete<NotchPayDeleteWebhookResponse>(
      `/webhooks/${webhookId}`
    );
    return response.data;
  }

  /**
   * List all webhook endpoints
   * @param limit Number of items per page (default: 30, max: 100)
   * @param page Page number (default: 1)
   * @returns Promise with list of webhooks
   */
  public async list(limit: number = 30, page: number = 1) {
    const response = await this.client.get<NotchPayListWebhooksResponse>(
      "/webhooks",
      {
        params: {
          limit,
          page,
        },
        headers: { "X-Grant": this.#privateKey },
      }
    );
    return response.data;
  }
}
