import * as solana from "@solana/web3.js"
import db from "../db/db"

const createWallet = async (connection: solana.Connection) => {
    const walletKeyPair = solana.Keypair.generate()

    // console.log(walletKeyPair.publicKey + " " + walletKeyPair.secretKey)

    // await connection.requestAirdrop(
    //     walletKeyPair.publicKey,
    //     1 * solana.LAMPORTS_PER_SOL
    // )
    const publicKey = walletKeyPair.publicKey.toString()
    const privateKey = walletKeyPair.secretKey.toString()

    console.log(privateKey + " " + publicKey)
    try {
        let balance = await connection.getBalance(walletKeyPair.publicKey)
        console.log(balance / solana.LAMPORTS_PER_SOL)
    } catch (error) {
        console.log(error)
    }
    console.log(walletKeyPair)
    // Save to Db

    const userId = Math.floor(Math.random() * 100000000000000)
    db.wallets
        .get("wallets")
        .push({
            userId,
            Keypair: {
                publicKey: walletKeyPair.publicKey,
                secretKey: walletKeyPair.secretKey,
            },
        })
        .write()

    return walletKeyPair
}
export { createWallet }
