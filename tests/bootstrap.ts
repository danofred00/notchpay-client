
import { NotchpayClient } from "../src";

const notchpay = new NotchpayClient({
    publicKey: process.env.NOTCHPAY_PUBLIC_KEY ?? '',
    privateKey: process.env.NOTCHPAY_PRIVATE_KEY,
    hashKey: process.env.NOTCHPAY_HASH_KEY,
    debug: process.env.NOTCHPAY_DEBUG === 'true'
})

export default notchpay