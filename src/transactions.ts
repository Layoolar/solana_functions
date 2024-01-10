import * as solana from "@solana/web3.js"

// Function to send sol from one account to another
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
    console.log(fromKeyPair.publicKey.toString())

    const signature = await solana.sendAndConfirmTransaction(
        connection,
        transaction,
        [fromKeyPair]
    )
    console.log("SIGNATURE", signature)
}
// Function to request sol to a particular account: Remember to use clusterURL("devnet") in connection before you request airdrop
const requestAirdrop = async (
    connection: solana.Connection,
    publicKey: solana.PublicKey
) => {
    await connection.requestAirdrop(publicKey, 1 * solana.LAMPORTS_PER_SOL)
}

// Function to send tokens from one account to another

const sendSplToken = async (
    connection: solana.Connection,
    fromKeyPair: solana.Keypair,
    toKey: solana.PublicKey,
    numOfToken: number
) => {
    const splToken = await import("@solana/spl-token")
    const transaction = new solana.Transaction().add(
        splToken.createTransferInstruction(
            fromKeyPair.publicKey,
            toKey,
            fromKeyPair.publicKey,
            500
        )
    )
}

const mintToken = async (
    connection: solana.Connection,
    fromKeyPair: solana.Keypair
) => {
    const splToken = await import("@solana/spl-token")
    console.log("this is here")
    const mint = await splToken.createMint(
        connection,
        fromKeyPair,
        fromKeyPair.publicKey,
        null,
        9,
        undefined,
        {},
        splToken.TOKEN_PROGRAM_ID
    )
    console.log(1)
    const tokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        fromKeyPair,
        mint,
        fromKeyPair.publicKey
    )
    splToken.mintTo(
        connection,
        fromKeyPair,
        mint,
        tokenAccount.address,
        fromKeyPair.publicKey,
        1000000000000
    )
    // await token.mintTo
}

export { sendTrasaction, requestAirdrop, sendSplToken, mintToken }
