import * as solana from "@solana/web3.js"
import * as mtplx from "@metaplex-foundation/js"
import * as fs from "fs"

export const createNFTConfig = (address: solana.Keypair) => {
    const config = {
        uploadPath: "",
        imgFileName: "adebimpe.JPG",
        imgType: "image/jpg",
        imgName: "Fine Girl",
        description: "Absolutely gorgeous",
        attributes: [
            { trait_type: "Speed", value: "Quick" },
            { trait_type: "Type", value: "Pixelated" },
            { trait_type: "Background", value: "QuickNode Blue" },
        ],
        sellerFeeBasisPoints: 500, //500 bp = 5%
        symbol: "QNPIX",
        creators: [{ address, share: 100 }],
    }
    return config
}

export const createCandySettings = (
    numOfNft: number,
    fromAdrress: solana.Keypair,
    collectionAddress: solana.PublicKey
) => {
    const candySettings: mtplx.CreateCandyMachineInput<mtplx.DefaultCandyGuardSettings> =
        {
            itemsAvailable: mtplx.toBigNumber(10), // Collection Size: 3
            sellerFeeBasisPoints: 1000, // 10% Royalties on Collection
            symbol: "DEMO",
            maxEditionSupply: mtplx.toBigNumber(0), // 0 reproductions of each NFT allowed
            isMutable: true,
            creators: [{ address: fromAdrress.publicKey, share: 100 }],
            collection: {
                address: collectionAddress, // Can replace with your own NFT or upload a new one
                updateAuthority: fromAdrress,
            },
        }
    return candySettings
}
