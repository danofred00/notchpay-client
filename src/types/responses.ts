import { NotchPayChannel } from "./requests";

/**
 * Base response properties shared across all NotchPay responses
 */
export interface NotchPayBaseResponse {
  /**
   * Response status
   */
  status: string;

  /**
   * Response message
   */
  message: string;

  /**
   * HTTP status code
   */
  code: number;

  /**
   * Errors
   */
  errors?: Record<string, any>;
}

export interface NotchPayCollectionResponse<T = any>
  extends NotchPayBaseResponse {
  /**
   * List of items
   */
  items: T[];

  // The total number of items in the collection
  totals: number;

  // The last page of the collection
  last_page: number;

  // The number of items per page
  current_page: number;

  // The number of items on the current page
  selected: number;
}

/**
 * Transaction status types
 */
export type NotchPayTransactionStatus = "pending" | "complete" | "failed";

/**
 * This is use to display fees after a payment | transfer requests
 */
export type AmountType = {
  /**
   * Amount to be charged
   */
  total: number;

  /**
   * Original currency
   */
  currency: string;

  /**
   * Transaction rate
   */
  rate: number;

  /**
   * Converted amount if currency conversion applies
   */
  converted: number;
};

/**
 * NotchPay Transaction details
 */
export interface NotchPayTransaction {
  /**
   * Amount to be charged
   * @deprecated Use `amounts.total` instead
   */
  amount: number;

  /**
   * Detailed amount information
   */
  amounts: AmountType;
  /**
   * Indicates if transaction is in sandbox/test mode
   */
  sandbox: boolean;

  /**
   * Transaction fee
   */
  fee: number[];

  /**
   * Customer identifier
   */
  customer: string;

  /**
   * Transaction description
   */
  description?: string;

  /**
   * Transaction reference
   */
  reference: string;

  /**
   * Transaction status
   */
  status: NotchPayTransactionStatus;

  /**
   * Currency code
   */
  currency: string;

  /**
   * Callback URL
   */
  callback?: string;

  /**
   * IP address information
   */
  geo: string;

  /**
   * Transaction creation timestamp
   */
  created_at: string;

  /**
   * Transaction last update timestamp
   */
  updated_at?: string;
}

/**
 * NotchPay Payment Initialization Response
 */
export interface NotchPayInitializePaymentResponse
  extends NotchPayBaseResponse {
  /**
   * Transaction details
   */
  transaction: NotchPayTransaction;

  /**
   * URL to redirect the customer for payment completion
   */
  authorization_url: string;
}

/**
 *
 */
export interface NotchpayGetTransactionResponse extends NotchPayBaseResponse {
  transaction: NotchPayTransaction & {
    /**
     * Payment method used
     */
    payment_method?: string;
  };
}

/**
 * NotchPay Direct Charge Response
 */
export interface NotchPayDirectChargeResponse extends NotchPayBaseResponse {}

export interface NotchPayPaymentMethod {
  /**
   * Payment Method ID
   */
  id: string;

  /**
   * Payment method channel
   */
  channel: NotchPayChannel;

  /**
   * Optional Email, used for paypal
   * @deprecated
   */
  email: string | null;

  /**
   * Country code
   */
  country: string;

  /**
   * Optional Name, used for Credit Card
   * @deprecated
   */
  name: string;

  /**
   * Payment method string type: Ex: Mobile Money
   */
  type: string;

  /**
   * Number registered with the payment method
   */
  account_number: string;

  // additional datas
  number?: string | null;
  phone?: string | null;
  issuer: string | null;
  issuer_code: string | null;

  /**
   * Creation date
   */
  created_at: Date;
}

export interface NotchPayRecipient {
  /**
   * Recipient ID
   */
  id: string;

  /**
   * Recipient phone number, define in creation
   */
  phone: string | null;

  /**
   * Recipient Name
   */
  name: string;

  /**
   * Recipient Email
   */
  email: string;

  /**
   * Recipient created in Sandbox mode ?
   */
  sandbox: boolean;

  /**
   * Recipient Country code
   */
  country: string;

  /**
   * Payment Method used by the recipient
   */
  payment_method: NotchPayPaymentMethod;
}

export interface NotchPayCreateRecipientResponse extends NotchPayBaseResponse {
  /**
   * Recipient details
   */
  beneficiary: NotchPayRecipient;
}

/**
 * Transfer status
 */
export type NotchPayTransferStatus =
  | "pending"
  | "sent"
  | "failed"
  | "rejected"
  | "expired"
  | "complete";

/**
 * Notchpay transfer item
 */
export interface NotchPayTransfer
  extends Omit<NotchPayTransaction, "customer" | "status"> {
  /**
   * Recipient ID
   */
  beneficary: string;

  /**
   * Status of the transfer
   */
  status: NotchPayTransferStatus;

  /**
   * The transaction reference
   */
  trxref: string | null;

  /**
   * The external statement
   */
  statement: string | null;
}

/**
 * Notchpay initialize transfer response
 */
export interface NotchPayInitializeTransferResponse
  extends NotchPayBaseResponse {
  transfer: NotchPayTransfer;
}


/**
 * NotchPay Webhook Event
 */
export interface NotchPayWebhookEvent<TData = any> {
  /**
   * unique identifier for the webhook event
   */
  id: string;

  /**
   * Event type (eg: payment.complete, transer.failed)
   */
  type: string;

  /**
   * Timestamp when the event was created
   */
  created_at: string;

  /**
   * Event data payload (eg. a payment or transfer object)
   */
  data: TData;
}

/**
 * NotchPay Webhook
 */
export interface NotchPayWebhook {
  /**
   * Unique identifier for the webhook
   */
  id: string;

  /**
   * The URL where webhook events will be sent
   */
  url: string | null;

  /**
   * Array of event types this webhook is subscribed to
   */
  events: string[];

  /**
   * Description of the webhook
   */
  description?: string;

  /**
   * Whether the webhook is active
   */
  active: boolean;

  /**
   * Status of the webhook
   */
  status: string | null;

  /**
   * Indicates if webhook is in sandbox/test mode
   */
  sandbox: boolean;

  /**
   * Timestamp when the webhook was created
   */
  created_at: string;

  /**
   * Timestamp when the webhook was last updated
   */
  updated_at?: string;
}

/**
 * Create webhook response
 */
export interface NotchPayCreateWebhookResponse extends NotchPayBaseResponse {
  /**
   * Webhook data
   */
  endpoint: NotchPayWebhook;
}

/**
 * Get webhook response
 */
export interface NotchPayGetWebhookResponse extends NotchPayBaseResponse {
  /**
   * Webhook data
   */
  endpoint: NotchPayWebhook;
}

/**
 * Update webhook response
 */
export interface NotchPayUpdateWebhookResponse extends NotchPayBaseResponse {
  /**
   * Updated webhook data
   */
  webhook: NotchPayWebhook;
}

/**
 * Delete webhook response
 */
export interface NotchPayDeleteWebhookResponse extends NotchPayBaseResponse {
  /**
   * Confirmation message
   */
  message: string;
}

/**
 * List webhooks response
 */
export interface NotchPayListWebhooksResponse extends NotchPayCollectionResponse<NotchPayWebhook> {
  /**
   * List of webhooks
   */
  endpoints: NotchPayWebhook[];
}