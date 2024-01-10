import * as solana from "@solana/web3.js"
export interface connectionParameter {}

export interface walletData {
    userId: number
    Keypair: { publicKey: solana.PublicKey; secretKey: Uint8Array }
}
