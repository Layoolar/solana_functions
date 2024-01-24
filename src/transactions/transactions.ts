import * as solana from "@solana/web3.js"

// Function to send sol from one account to another
const sendSolTrasaction = async (
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
    // Change mint address to that of your token
    const mintAddress = new solana.PublicKey(
        "4TBrL6s9wQukwLFMXscg35hX3jk11D6E7cdymhai9m4p"
    )
    const accountInfo = await connection.getParsedAccountInfo(mintAddress)
    const tokenDecimals = (accountInfo.value?.data as solana.ParsedAccountData)
        .parsed.info.decimals as number
    const tokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        fromKeyPair,
        mintAddress,
        fromKeyPair.publicKey
    )
    const destinationAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        fromKeyPair,
        mintAddress,
        toKey
    )
    const transaction = new solana.Transaction().add(
        splToken.createTransferInstruction(
            tokenAccount.address,
            destinationAccount.address,
            fromKeyPair.publicKey,
            numOfToken * Math.pow(10, tokenDecimals)
        )
    )
    const latestBlockHash = await connection.getLatestBlockhash("confirmed")
    transaction.recentBlockhash = await latestBlockHash.blockhash
    const signature = await solana.sendAndConfirmTransaction(
        connection,
        transaction,
        [fromKeyPair]
    )
    console.log("successful")
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

    console.log(tokenAccount)
    await splToken.mintTo(
        connection,
        fromKeyPair,
        mint,
        tokenAccount.address,
        fromKeyPair.publicKey,
        1000000000000
    )
    // await token.mintTo
}

export { sendSolTrasaction, requestAirdrop, sendSplToken, mintToken }
