import { AxiosInstance } from "axios"

export class Usecase {
    
    protected readonly client: AxiosInstance

    constructor(client: AxiosInstance) {
        this.client = client
    }
}