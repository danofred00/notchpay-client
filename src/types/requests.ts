/**
 * NotchPay Customer Information
 */
export interface NotchPayCustomer {
  /**
   * Customer email address
   */
  email: string;

  /**
   * Customer name (optional)
   */
  name: string;

  /**
   * Customer phone number (optional)
   */
  phone?: string;
}

/**
 * Base payment request interface with common properties
 */
export interface NotchPayBaseRequest {
  /**
   * Currency code (e.g., 'XAF')
   */
  currency: string;

  /**
   * Description of the payment (optional)
   */
  description?: string;

  /**
   * Unique transaction identifier from your system (optional)
   */
  reference?: string;
}

/**
 * Legacy Payment Initialization Request
 */
export interface NotchPayInitializePaymentRequest extends NotchPayBaseRequest {
  /**
   * Customer email address
   */
  email: string;

  /**
   * Amount to charge
   * Note: For currencies like XAF, this value must not contain decimal places
   */
  amount: string | number;

  /**
   * URL to redirect the customer after payment
   * If not specified, users won't be redirected to your site after payment
   */
  callback: string;
}

/**
 * Modern Payment Request format
 */
export interface NotchPayCreatePaymentRequest extends NotchPayBaseRequest {
  /**
   * Payment amount (numeric)
   */
  amount: number;

  /**
   * URL to redirect the customer after payment (optional)
   */
  callback?: string;

  /**
   * Customer information
   */
  customer: NotchPayCustomer;

  /**
   * Additional data for the payment (optional)
   */
  metadata?: Record<string, any>;
}

/**
 * Payment channels for direct charge
 */
export enum NotchPayChannel {
  MTN = "cm.mtn",
  ORANGE = "cm.orange",
  MOBILE = "cm.mobile",
}

/**
 * Mobile Money payment data
 */
export interface NotchPayMobileMoneyData {
  /**
   * Mobile Money phone number to be charged
   * Format should include country code (e.g., +237656019261)
   */
  phone: string;
}

/**
 * Union type for different payment method data
 */
export type NotchPayPaymentMethodData = NotchPayMobileMoneyData;

/**
 * NotchPay Direct Charge Request
 */
export interface NotchPayDirectChargeRequest {
  /**
   * Payment channel to make a payment with
   */
  channel: NotchPayChannel | string;

  /**
   * Customer information relating to the chosen payment method
   */
  data: NotchPayPaymentMethodData;
}

export interface NotchPayCreateRecipientRequest extends NotchPayCustomer {
  /**
   * Channel used to recieve money
   */
  channel: NotchPayChannel;

  /**
   * Country code of the recipient
   * Example: 'CM' for Cameroon
   */
  country: string;

  /**
   * Account number of the recipient
   * Example: '+237656019261' for Cameroon
   * Note: This should be a valid phone number for the selected channel
   */
  account_number: string;

  /**
   * Optional description of the recipient
   */
  description?: string;

  /**
   * Optional reference for the recipient
   * This can be used to identify the recipient in your system
   */
  reference?: string;

  /**
   * Optional phone for the recipient
   * This can be used to store additional information about the recipient
   */
  phone?: string;
}

export interface NotchPayInitializeTransferRequest {
  /**
   * This is the recipient ID
   */
  recipient: string;

  /**
   * The amount to transfer
   */
  amount: number | string;

  /**
   * The currency used to transfer
   */
  currency: string;

  /**
   * Optional statement of the transfer
   */
  statement?: string;

  /**
   * Optional description
   */
  description?: string;

  /**
   * Channel used to transfer money
   */
  channel: NotchPayChannel;
}

/**
 * NotchPay webhook event types
 */
export enum NotchPayWebhookEventType {
  // Payment Events
  PAYMENT_CREATED = "payment.created",
  PAYMENT_PROCESSING = "payment.processing", 
  PAYMENT_COMPLETE = "payment.complete",
  PAYMENT_FAILED = "payment.failed",
  PAYMENT_CANCELED = "payment.canceled",
  PAYMENT_EXPIRED = "payment.expired",

  // Transfer Events
  TRANSFER_CREATED = "transfer.created",
  TRANSFER_PROCESSING = "transfer.processing",
  TRANSFER_COMPLETE = "transfer.complete", 
  TRANSFER_FAILED = "transfer.failed",

  // Customer Events
  CUSTOMER_CREATED = "customer.created",
  CUSTOMER_UPDATED = "customer.updated",

  // Beneficiary Events
  BENEFICIARY_CREATED = "beneficiary.created",
  BENEFICIARY_UPDATED = "beneficiary.updated",
  BENEFICIARY_DELETED = "beneficiary.deleted",
}

/**
 * Create webhook request
 */
export interface NotchPayCreateWebhookRequest {
  /**
   * The URL where webhook events will be sent
   */
  url: string;

  /**
   * Array of event types to subscribe to
   */
  events: NotchPayWebhookEventType[] | string[];

  /**
   * Optional description of the webhook
   */
  description?: string;

  /**
   * Whether the webhook is active (default: true)
   */
  active?: boolean;
}

/**
 * Update webhook request
 */
export interface NotchPayUpdateWebhookRequest {
  /**
   * The URL where webhook events will be sent
   */
  url?: string;

  /**
   * Array of event types to subscribe to
   */
  events?: NotchPayWebhookEventType[] | string[];

  /**
   * Description of the webhook
   */
  description?: string;

  /**
   * Whether the webhook is active
   */
  active?: boolean;
}
