import * as solana from "@solana/web3.js"
import { createWallet } from "./wallet"
import { sendTrasaction } from "./transactions"
// import db from "./db/db.js"

// const testPubKey = "Cs6ehAgrEHeMXZtj1Qf6zKk1HGGneSeVtfjqoAmwNiyr" as solana.PublicKey

// const keyPair: {publicKey: solana.PublicKey, secretKey: solana.Ed25519SecretKey} = {publicKey: }

const testTransaction = async () => {
    const connection = new solana.Connection(
        "https://nd-378-985-855.p2pify.com/aa2c0d8f21771e666e2e1aebcba552b2"
    )
    let publicKey = solana.Keypair.generate()

    const keyPair = await createWallet(connection)

    sendTrasaction(connection, keyPair, publicKey.publicKey, 10)
}

testTransaction()
