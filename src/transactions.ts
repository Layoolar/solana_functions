import * as solana from "@solana/web3.js"

const sendTrasaction = async (
    connection: solana.Connection,
    fromKeyPair: solana.Keypair,
    toKey: solana.PublicKey,
    numOfSol: number
) => {
    const transaction = new solana.Transaction().add(
        solana.SystemProgram.transfer({
            fromPubkey: fromKeyPair.publicKey,
            toPubkey: toKey,
            lamports: numOfSol * solana.LAMPORTS_PER_SOL,
        })
    )

    const signature = await solana.sendAndConfirmTransaction(
        connection,
        transaction,
        [fromKeyPair]
    )
    console.log("SIGNATURE", signature)
}

export { sendTrasaction }
