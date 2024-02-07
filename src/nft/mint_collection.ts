import * as solana from "@solana/web3.js"
import * as mtplx from "@metaplex-foundation/js"
import { createCandySettings, createNFTConfig } from "./config"
import { uploadImage, uploadMetadata } from "./utils"

const generateCandyMachine = async (
    connection: solana.Connection,
    fromKeyPair: solana.Keypair,
    QUICKNODE_RPC: string
) => {
    const config = createNFTConfig(fromKeyPair)
    const metaplex = mtplx.Metaplex.make(connection)
        .use(mtplx.keypairIdentity(fromKeyPair))
        .use(
            mtplx.irysStorage({
                address: "https://devnet.bundlr.network",
                providerUrl: QUICKNODE_RPC,
                timeout: 60000,
            })
        )
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

    console.log("Here1")
    const NftConnection = await createConnectionsNft(
        metaplex,
        metadataUri,
        config.imgName,
        fromKeyPair
    )

    console.log("Here2")
    const candySettings = createCandySettings(10, fromKeyPair, NftConnection)

    console.log("Here3")
    const { candyMachine } = await metaplex
        .candyMachines()
        .create(candySettings)

    console.log("Here4")
    console.log(
        `✅ - Created Candy Machine: ${candyMachine.address.toString()}`
    )
    console.log(
        `     https://explorer.solana.com/address/${candyMachine.address.toString()}?cluster=devnet`
    )
}

const createConnectionsNft = async (
    metaplex: mtplx.Metaplex,
    metadataUri: string,
    name: string,
    address: solana.Keypair
) => {
    const { nft: collectionNft } = await metaplex.nfts().create({
        uri: metadataUri,
        name: name,
        sellerFeeBasisPoints: 0,
        isCollection: true,
        updateAuthority: address,
    })
    console.log(
        `✅ - Minted Collection NFT: ${collectionNft.address.toString()}`
    )
    return collectionNft.address
}

// const generateCandyMachine = async (
//     candySettings: mtplx.CreateCandyMachineInput<mtplx.DefaultCandyGuardSettings>,
//     metaplex: mtplx.Metaplex
// ) => {
//     const { candyMachine } = await metaplex
//         .candyMachines()
//         .create(candySettings)
// }

export { generateCandyMachine }
