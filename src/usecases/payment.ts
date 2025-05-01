import {
  NotchPayChannel,
  NotchPayDirectChargeRequest,
  NotchPayDirectChargeResponse,
  NotchpayGetTransactionResponse,
  NotchPayInitializePaymentRequest,
  NotchPayInitializePaymentResponse,
  NotchPayCreatePaymentRequest,
  NotchPayCollectionResponse,
  NotchPayTransaction,
} from "../types";
import { Usecase } from "./base";

export class PaymentUsecases extends Usecase {
  /**
   * @returns Promise with all payments you need
   */
  public async getAll() {
    const response = await this.client.get<
      NotchPayCollectionResponse<NotchPayTransaction>
    >("/payments");
    return response.data;
  }

  /**
   * Initialize a payment (legacy method)
   * @param paymentData Payment initialization data
   * @returns Promise with payment response
   */
  public async initialize(
    paymentData: NotchPayInitializePaymentRequest
  ): Promise<NotchPayInitializePaymentResponse> {
    const response = await this.client.post<NotchPayInitializePaymentResponse>(
      "/payments/initialize",
      paymentData
    );
    return response.data;
  }

  /**
   * Create a payment (modern method)
   * @param paymentData Payment data
   * @returns Promise with payment response
   */
  public async create(
    paymentData: NotchPayCreatePaymentRequest
  ): Promise<NotchPayInitializePaymentResponse> {
    const response = await this.client.post<NotchPayInitializePaymentResponse>(
      "/payments",
      paymentData
    );
    return response.data;
  }

  /**
   * Initiate a direct charge for an existing transaction
   * @param ref The transaction reference returned from payment initialization
   * @param chargeData Direct charge data including channel and payment method details
   * @returns Promise with direct charge response
   */
  public async directCharge(
    ref: string,
    chargeData: NotchPayDirectChargeRequest
  ): Promise<NotchPayDirectChargeResponse> {
    const response = await this.client.put<NotchPayDirectChargeResponse>(
      `/payments/${ref}`,
      chargeData
    );
    return response.data;
  }

  /**
   * Get payment info
   * @param reference The transaction reference
   * @returns Promise with transaction details
   */
  public async get(reference: string) {
    const response = await this.client.get<NotchpayGetTransactionResponse>(
      `/payments/${reference}`
    );
    return response.data;
  }

  /**
   * Initialize Mobile Money payment in one step (convenience method)
   * @param paymentData Initial payment data
   * @param phoneNumber Mobile Money phone number
   * @param channel Payment channel (MTN, Orange, etc)
   * @returns Promise with complete payment flow result
   */
  public async initializeMobileMoneyPayment(
    paymentData: NotchPayCreatePaymentRequest,
    phoneNumber: string,
    channel: NotchPayChannel = NotchPayChannel.MOBILE
  ): Promise<NotchPayDirectChargeResponse> {
    // First initialize the payment
    const initResponse = await this.create(paymentData);

    // Extract transaction reference from the response
    const transactionId = initResponse.transaction.reference;

    // Proceed with direct charge using mobile money
    return this.directCharge(transactionId, {
      channel: channel,
      data: {
        phone: phoneNumber,
      },
    });
  }
}
