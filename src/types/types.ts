import * as solana from "@solana/web3.js"
export interface connectionParameter {}

export interface walletData {
    userId: number
    keyPair: solana.Keypair
}
