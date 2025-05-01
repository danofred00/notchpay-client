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
  amount: string | number ;

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
  country: string;
  number: string;
  description?: string;
  reference?: string;
}
