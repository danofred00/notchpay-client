import { AxiosInstance } from "axios";
import {
  NotchPayCollectionResponse,
  NotchPayCreateRecipientRequest,
  NotchPayCreateRecipientResponse,
} from "../types";
import { Usecase } from "./base";

export class RecipientUsecases extends Usecase {
  constructor(client: AxiosInstance, private readonly privateKey: string) {
    super(client);
  }

  /**
   * @returns Promise with all recipients
   */
  public async getAll() {
    const response = await this.client.get<NotchPayCollectionResponse>(
      "/recipients",
      { headers: { "X-Grant": this.privateKey } }
    );
    return response.data;
  }

  /**
   * @param recipientData Informations about the recipient
   * @returns Promise with the created recipient's data
   */
  public async create(recipientData: NotchPayCreateRecipientRequest) {
    const response = await this.client.post<NotchPayCreateRecipientResponse>("/recipients", recipientData, {
      headers: { "X-Grant": this.privateKey },
    });
    return response.data;
  }

  /**
   * Retrieve a particular recipient
   * @param id recipient ID
   * @returns
   */
  public async get(id: string) {
    const response = await this.client.get(`/recipients/${id}`, {
      headers: { "X-Grant": this.privateKey },
    });
    return response.data;
  }
}
