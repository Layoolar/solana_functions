import lowdb from "lowdb"

import lowdbFileSync from "lowdb/adapters/FileSync"
import { walletData } from "../types/types.js"

const databases = {
    wallets: lowdb(
        new lowdbFileSync<{ wallets: walletData[] }>("src/db/wallets.json")
    ),
}
databases.wallets = lowdb(new lowdbFileSync("src/db/wallets.json"))
databases.wallets.defaults({ wallets: [] }).write()

export { databases }
export default databases
