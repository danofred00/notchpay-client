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

export interface NotchPayCollectionResponse<T = any> extends NotchPayBaseResponse {
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
