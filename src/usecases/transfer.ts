import {
  NotchPayCollectionResponse,
  NotchPayInitializeTransferRequest,
  NotchPayInitializeTransferResponse,
  NotchPayTransfer,
} from "@/types";
import { Usecase } from "./base";
import { AxiosInstance } from "axios";

export class TransferUsecases extends Usecase {
  constructor(client: AxiosInstance, private readonly privateKey: string) {
    super(client);
  }

  /**
   * Retrieve all transfers
   */
  async getAll() {
    const response = await this.client.get<
      NotchPayCollectionResponse<NotchPayTransfer>
    >("/transfers", {
      headers: { "X-Grant": this.privateKey },
    });
    return response.data;
  }

  /**
   * Initialize a tranfer request
   * @param transferData
   * @returns
   */
  async initialize(transferData: NotchPayInitializeTransferRequest) {
    const response = await this.client.post<NotchPayInitializeTransferResponse>(
      "/transfers",
      transferData,
      {
        headers: { "X-Grant": this.privateKey },
      }
    );
    return response.data;
  }

  /**
   * Get a single transfer by reference
   * @param reference transaction reference
   * @returns
   */
  async get(reference: string) {
    const response = await this.client.get(`/transfers/${reference}`, {
      headers: { "X-Grant": this.privateKey },
    });
    return response.data;
  }
}
