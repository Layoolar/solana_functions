import * as solana from "@solana/web3.js"
import * as mtplx from "@metaplex-foundation/js"
import { uploadImage, uploadMetadata } from "./utils"
import { createNFTConfig } from "./config"

const mint = async (
    connection: solana.Connection,
    fromKeyPair: solana.Keypair,
    QUICKNODE_RPC: string
) => {
    console.log("starts")
    const config = createNFTConfig(fromKeyPair)
    await connection.getLatestBlockhash("finalized")

    const metaplex = mtplx.Metaplex.make(connection)
        .use(mtplx.keypairIdentity(fromKeyPair))
        .use(
            mtplx.irysStorage({
                address: "https://devnet.bundlr.network",
                providerUrl: QUICKNODE_RPC,
                timeout: 60000,
            })
        )

    console.log("connects")
    const imgUri = await uploadImage(
        "C:/Coding Projects/solana_functions/src/nft/adebimpe.JPG",
        metaplex
    )
    console.log("image upoad successful")
    const metadataUri = await uploadMetadata(
        metaplex,
        imgUri,
        config.imgType,
        config.imgName,
        config.description,
        config.attributes
    )
    console.log("metedata upload scc", metadataUri)
    mintNFT(
        metaplex,
        metadataUri,
        config.imgName,
        config.sellerFeeBasisPoints,
        config.symbol,
        [
            {
                address: fromKeyPair.publicKey,
                share: 100,
            },
        ]
    )
}

const mintNFT = async (
    metaplex: mtplx.Metaplex,
    metadataUri: string,
    name: string,
    sellerFee: number,
    symbol: string,
    creators: { address: solana.PublicKey; share: number }[]
) => {
    const { nft } = await metaplex.nfts().create(
        {
            uri: metadataUri,
            name: name,
            sellerFeeBasisPoints: sellerFee,
            symbol: symbol,
            creators: creators,
            isMutable: false,
        },
        { commitment: "finalized" }
    )
    console.log("NFT minted successfully")
}

export { mint }
