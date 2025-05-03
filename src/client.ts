import axios, { AxiosInstance, AxiosError } from "axios";
import {
  AccountUsecases,
  PaymentUsecases,
  RecipientUsecases,
  RefundUsecases,
  TransferUsecases,
  CustomerUsecases,
} from "./usecases";

export type NotchpayClientConstructorOptions = {
  publicKey: string;
  privateKey?: string;
  hashKey?: string;
  debug?: boolean;
};

export class NotchpayClient {
  private client: AxiosInstance;
  private baseURL: string = "https://api.notchpay.co";
  private debug: boolean;
  private publicKey: string;
  private privateKey: string;
  private hashKey?: string;
  private _payments: PaymentUsecases;
  private _recipients: RecipientUsecases;
  private _customers: CustomerUsecases;
  private _refunds: RefundUsecases;
  private _transfers: TransferUsecases;
  private _accounts: AccountUsecases;

  constructor({
    publicKey,
    privateKey,
    hashKey,
    debug = false,
  }: NotchpayClientConstructorOptions) {
    this.publicKey = publicKey;
    this.privateKey = String(privateKey);
    this.hashKey = hashKey;
    this.debug = debug;

    // setup axios client
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        Accept: "application/json",
        Authorization: this.publicKey,
        "Content-Type": "application/json",
      },
      withCredentials: false,
      withXSRFToken: false,
    });
    this.setupInterceptors();

    // setup global props
    this._payments = new PaymentUsecases(this.client);
    this._recipients = new RecipientUsecases(this.client, this.privateKey);
    this._accounts = new AccountUsecases(this.client);
    this._customers = new CustomerUsecases(this.client);
    this._refunds = new RefundUsecases(this.client);
    this._transfers = new TransferUsecases(this.client, this.privateKey);
  }

  /**
   * Manage payments API
   */
  get payments() {
    return this._payments;
  }

  /**
   * Manage refunds API
   */
  get refunds() {
    return this._refunds;
  }

  /**
   * Manage recipients API
   */
  get recipients() {
    return this._recipients;
  }

  /**
   * Manage your transfers
   */
  get transfers() {
    return this._transfers;
  }

  /**
   * Manage your customers
   */
  get customers() {
    return this._customers;
  }

  /**
   * Manage your accounts
   */
  get accounts() {
    return this._accounts;
  }

  ///////////// PRIVATE METHODS /////////////////////
  private setupInterceptors(): void {
    // requests interceptors
    this.client.interceptors.request.use(
      (config) => config,
      (error) => this.handleError(error, this.debug)
    );

    // responses interceptors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error, this.debug)
    );
  }

  /**
   * Format and handle API errors
   * @param error Error object from API call
   */
  private handleError(
    error: Error | AxiosError,
    debug: boolean
  ): Promise<Error> {
    if (debug) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error("NotchPay API Error:", {
            status: axiosError.response.status,
            statusText: axiosError.response.statusText,
            data: axiosError.response.data,
          });
        } else if (axiosError.request) {
          console.error(
            "NotchPay Request Error (No Response):",
            axiosError.request
          );
        } else {
          console.error("NotchPay Error:", axiosError.message);
        }
      } else {
        console.error("Unexpected Error:", error.message);
      }
    }
    return Promise.reject(error);
  }
}
