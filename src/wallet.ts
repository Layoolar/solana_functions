import * as solana from "@solana/web3.js"
import db from "./db/db"

const createWallet = async (connection: solana.Connection) => {
    const walletKeyPair = solana.Keypair.generate()

    // console.log(walletKeyPair.publicKey + " " + walletKeyPair.secretKey)

    // await connection.requestAirdrop(
    //     walletKeyPair.publicKey,
    //     1 * solana.LAMPORTS_PER_SOL
    // )

    let balance = await connection.getBalance(walletKeyPair.publicKey)
    // Save to Db

    const userId = Math.floor(Math.random() * 100000000000000)
    db.wallets.get("wallets").push({ userId, keyPair: walletKeyPair }).write()
    console.log(balance / solana.LAMPORTS_PER_SOL)

    return walletKeyPair
}
export { createWallet }
