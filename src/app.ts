import * as solana from "@solana/web3.js"
import { createWallet } from "./transactions/wallet"
import bs58 from "bs58"
import {
    sendSolTrasaction,
    requestAirdrop,
    mintToken,
    sendSplToken,
} from "./transactions/transactions"
import db from "./db/db"
import { mint } from "./nft/minting"
import { generateCandyMachine } from "./nft/mint_collection"
import dotenv from "dotenv"
dotenv.config()
const { HTTP_LINK, WSS_LINK } = process.env

let publicKey = db.wallets.get("wallets").value()[0].Keypair

const Keypair = db.wallets.get("wallets").value()[1].Keypair

let secretKey = Object.values(Keypair.secretKey)
const uintSecretKey = new Uint8Array(secretKey)
const wallet = solana.Keypair.fromSecretKey(uintSecretKey)
const toKey = new solana.PublicKey(publicKey.publicKey)

const connect = () => {
    const connection = new solana.Connection(HTTP_LINK ? HTTP_LINK : "", {
        wsEndpoint: WSS_LINK,
    })
    // Use connection below for minting and airdrop
    // const connection = new solana.Connection(solana.clusterApiUrl("devnet"), {
    //     commitment: "confirmed",
    // })
    console.log("connection successful")
    return connection
}

export const sendToken = async (
    toKey: solana.PublicKey,
    fromKeyPair: solana.Keypair = wallet
) => {
    const connection = connect()
    await sendSplToken(connection, fromKeyPair, toKey, 200)
}

export const sendSol = async (
    toKey: solana.PublicKey,
    fromKeyPair: solana.Keypair = wallet
) => {
    const connection = connect()
    await sendSolTrasaction(connection, fromKeyPair, toKey, 0.5)
}

export const mintNft = async (fromKeyPair: solana.Keypair = wallet) => {
    const connection = connect()
    mint(connection, fromKeyPair, HTTP_LINK ? HTTP_LINK : "")
}

export const generateNFTCollection = async (
    fromKeyPair: solana.Keypair = wallet
) => {
    const connection = connect()
    generateCandyMachine(connection, fromKeyPair, HTTP_LINK ? HTTP_LINK : "")
}

const testTransaction = async () => {
    // console.log(bs58.encode(wallet.secretKey))
    // await requestAirdrop(connection, wallet.publicKey)
    // await mintToken(connection, wallet)
    // let balance = await connection.getBalance(wallet.publicKey)
    // console.log(balance / solana.LAMPORTS_PER_SOL)
    // const wallet = await createWallet(connection)
    // console.log(HTTP_LINK)
    // mint(connection, wallet, HTTP_LINK ? HTTP_LINK : "")
    // generateCandyMachine(connection, wallet, HTTP_LINK ? HTTP_LINK : "")
    //
}
