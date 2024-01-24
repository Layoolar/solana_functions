import * as solana from "@solana/web3.js"
import * as mtplx from "@metaplex-foundation/js"
import * as fs from "fs"

const mint = async (
    connection: solana.Connection,
    fromKeyPair: solana.Keypair,
    QUICKNODE_RPC: string
) => {
    console.log("starts")
    const config = {
        uploadPath: "",
        imgFileName: "adebimpe.JPG",
        imgType: "image/jpg",
        imgName: "Adebimpe",
        description: "Absolutely gorgeous",
        attributes: [
            { trait_type: "Speed", value: "Quick" },
            { trait_type: "Type", value: "Pixelated" },
            { trait_type: "Background", value: "QuickNode Blue" },
        ],
        sellerFeeBasisPoints: 500, //500 bp = 5%
        symbol: "QNPIX",
        creators: [{ address: fromKeyPair.publicKey, share: 100 }],
    }

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
    console.log("metedata upload scc")
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

const uploadImage = async (filepath: string, metaplex: mtplx.Metaplex) => {
    const imgBuffer = fs.readFileSync(filepath)
    const imgMetaplexFile = mtplx.toMetaplexFile(imgBuffer, "adebimpe.JPG")
    const imgUri = await metaplex.storage().upload(imgMetaplexFile)
    return imgUri
}

const uploadMetadata = async (
    metaplex: mtplx.Metaplex,
    imgUri: string,
    imgType: string,
    nftName: string,
    description: string,
    attributes: { trait_type: string; value: string }[]
) => {
    const { uri } = await metaplex.nfts().uploadMetadata({
        name: nftName,
        description: description,
        image: imgUri,
        attributes: attributes,
        properties: {
            files: [
                {
                    type: imgType,
                    uri: imgUri,
                },
            ],
        },
    })
    return uri
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
