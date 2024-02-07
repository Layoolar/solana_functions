import * as mtplx from "@metaplex-foundation/js"
import * as fs from "fs"

export const uploadImage = async (
    filepath: string,
    metaplex: mtplx.Metaplex
) => {
    const imgBuffer = fs.readFileSync(filepath)
    const imgMetaplexFile = mtplx.toMetaplexFile(imgBuffer, "adebimpe.JPG")
    const imgUri = await metaplex.storage().upload(imgMetaplexFile)
    return imgUri
}

export const uploadMetadata = async (
    metaplex: mtplx.Metaplex,
    imgUri: string,
    imgType: string,
    nftName: string,
    description: string,
    attributes: { trait_type: string; value: string }[]
) => {
    console.log("gets hererrr")
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
