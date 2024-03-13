const solana = require("@solana/web3.js");
const bs58 = require("bs58");
const splToken = require("@solana/spl-token");

const connection = new solana.Connection("https://nd-666-486-702.p2pify.com/a152a989afaaff2af9bcf29bfef11523", {
	wsEndpoint: "wss://ws-nd-666-486-702.p2pify.com/a152a989afaaff2af9bcf29bfef11523",
});

const mintConnection = new solana.Connection(solana.clusterApiUrl("devnet"), {
	commitment: "confirmed",
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createWallet = async (connection) => {
	const walletKeyPair = solana.Keypair.generate();

	// Convert public key to string
	const publicKey = walletKeyPair.publicKey.toString();

	// Convert private key to Base58 string
	const privateKeyBuffer = Buffer.from(walletKeyPair.secretKey);
	const privateKeyBase58 = bs58.encode(privateKeyBuffer);

	console.log("Public Key:", publicKey);
	console.log("Private Key (Base58):", privateKeyBase58);

	console.log(walletKeyPair.publicKey + " " + walletKeyPair.secretKey);

	// await connection.requestAirdrop(walletKeyPair.publicKey, 2 * solana.LAMPORTS_PER_SOL);

	console.log(`${privateKeyBase58} ${publicKey}`);
	try {
		const balance = await connection.getBalance(walletKeyPair.publicKey);
		console.log(balance / solana.LAMPORTS_PER_SOL);
	} catch (error) {
		console.log(error);
	}
	console.log(walletKeyPair);
	// Save to Db

	return { walletKeyPair, publicKey };
};

const sendSolTrasactionWithKeyPair = async (connection, fromKeyPair, toKey, numOfSol) => {
	const transaction = new solana.Transaction().add(
		solana.SystemProgram.transfer({
			fromPubkey: fromKeyPair.publicKey,
			toPubkey: toKey,
			lamports: numOfSol * solana.LAMPORTS_PER_SOL,
		}),
	);
	console.log(fromKeyPair.publicKey.toString());

	const signature = await solana.sendAndConfirmTransaction(connection, transaction, [fromKeyPair]);
	console.log("SIGNATURE", signature);

	console.log("Transaction Signature:", signature);

	// Fetch the transaction details using the signature
	const transactionInfo = await connection.getTransaction(signature);

	// Extract relevant information from the transaction details
	const transactionHash = signature;
	const transactionStatus = transactionInfo?.meta?.err ? "Failed" : "Confirmed";
	const solSent = numOfSol;

	console.log("Transaction Hash:", transactionHash);
	console.log("Transaction Status:", transactionStatus);
	console.log("Amount of SOL Sent:", solSent);
};

const sendSolTrasactionWithBase58 = async (connection, fromPrivateKeyBase58, toKey, numOfSol) => {
	// Create Keypair from the provided private key
	const fromKeyPair = solana.Keypair.fromSecretKey(bs58.decode(fromPrivateKeyBase58));

	// Build the transaction
	const transaction = new solana.Transaction().add(
		solana.SystemProgram.transfer({
			fromPubkey: fromKeyPair.publicKey,
			toPubkey: toKey,
			lamports: numOfSol * solana.LAMPORTS_PER_SOL,
		}),
	);

	console.log("From Public Key:", fromKeyPair.publicKey.toString());

	try {
		// Sign and confirm the transaction
		const signature = await solana.sendAndConfirmTransaction(connection, transaction, [fromKeyPair]);

		console.log("Transaction Signature:", signature);

		// Fetch the transaction details using the signature
		const transactionInfo = await connection.getTransaction(signature);

		// Extract relevant information from the transaction details
		const transactionHash = signature;
		const transactionStatus = transactionInfo?.meta?.err ? "Failed" : "Confirmed";
		const solSent = numOfSol;

		console.log("Transaction Hash:", transactionHash);
		console.log("Transaction Status:", transactionStatus);
		console.log("Amount of SOL Sent:", solSent);
	} catch (error) {
		console.error("Error sending and confirming transaction:", error);
	}
};

const sendSplToken = async (connection, fromKeyPair, receipentAddress, numOfToken, tokenMintAddress) => {
	// Change mint address to that of your token
	const mintAddress = new solana.PublicKey(tokenMintAddress);
	const toKey = new solana.PublicKey(receipentAddress);

	const accountInfo = await connection.getParsedAccountInfo(mintAddress);
	const tokenDecimals = (accountInfo.value?.data).parsed.info.decimals;

	const tokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
		connection,
		fromKeyPair,
		mintAddress,
		fromKeyPair.publicKey,
	);

	const destinationAccount = await splToken.getOrCreateAssociatedTokenAccount(
		connection,
		fromKeyPair,
		mintAddress,
		toKey,
	);

	const transaction = new solana.Transaction().add(
		splToken.createTransferInstruction(
			tokenAccount.address,
			destinationAccount.address,
			fromKeyPair.publicKey,
			numOfToken * Math.pow(10, tokenDecimals),
		),
	);

	const latestBlockHash = await connection.getLatestBlockhash("confirmed");
	transaction.recentBlockhash = await latestBlockHash.blockhash;

	const signature = await solana.sendAndConfirmTransaction(connection, transaction, [fromKeyPair]);

	// Fetch the transaction details using the signature
	const transactionInfo = await connection.getTransaction(signature);

	// Extract relevant information from the transaction details
	const transactionHash = signature;
	const transactionStatus = transactionInfo?.meta?.err ? "Failed" : "Confirmed";
	const splTokensSent = numOfToken;

	console.log("Transaction Hash:", transactionHash);
	console.log("Transaction Status:", transactionStatus);
	console.log("Amount of SPL Tokens Sent:", splTokensSent);
};

const sendSplTokenWithBase68 = async (connection, privateKey, receipentAddress, numOfToken, tokenMintAddress) => {
	// Change mint address to that of your token
	const mintAddress = new solana.PublicKey(tokenMintAddress);
	const toKey = new solana.PublicKey(receipentAddress);
	const fromKeyPair = solana.Keypair.fromSecretKey(bs58.decode(privateKey));

	const accountInfo = await connection.getParsedAccountInfo(mintAddress);
	const tokenDecimals = (accountInfo.value?.data).parsed.info.decimals;

	const tokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
		connection,
		fromKeyPair,
		mintAddress,
		fromKeyPair.publicKey,
	);

	const destinationAccount = await splToken.getOrCreateAssociatedTokenAccount(
		connection,
		fromKeyPair,
		mintAddress,
		toKey,
	);

	const transaction = new solana.Transaction().add(
		splToken.createTransferInstruction(
			tokenAccount.address,
			destinationAccount.address,
			fromKeyPair.publicKey,
			numOfToken * Math.pow(10, tokenDecimals),
		),
	);

	const latestBlockHash = await connection.getLatestBlockhash("confirmed");
	transaction.recentBlockhash = await latestBlockHash.blockhash;

	const signature = await solana.sendAndConfirmTransaction(connection, transaction, [fromKeyPair]);

	// Fetch the transaction details using the signature
	const transactionInfo = await connection.getTransaction(signature);

	// Extract relevant information from the transaction details
	const transactionHash = signature;
	const transactionStatus = transactionInfo?.meta?.err ? "Failed" : "Confirmed";
	const splTokensSent = numOfToken;

	console.log("Transaction Hash:", transactionHash);
	console.log("Transaction Status:", transactionStatus);
	console.log("Amount of SPL Tokens Sent:", splTokensSent);
};

const getSolBalance = async (connection, wallet) => {
	try {
		const walletAddress = new solana.PublicKey(wallet);

		const balance = await connection.getBalance(walletAddress);
		console.log(balance / solana.LAMPORTS_PER_SOL);
		return balance / solana.LAMPORTS_PER_SOL; // Convert lamports to SOL
	} catch (error) {
		console.error("Error getting SOL balance:", error);
		throw error;
	}
};

const privates = "5RPaAE6wNt4wxEbD3iBtauwX32jLeugwCv6Rzyfaird7KtY7hYRnEi7aG7pJruKPxGwgnLfcLV3uqPaQHMKJeHsM";
const toAdd = "Gw1fs6AHjPHqUaAuVnGvgCiMSKfVR6SKiANYqqRChwwn";
// sendSolTrasactionWithBase58(connection, privates, toAdd, 0.5);
const mintAdd = "4JeGKgkrwcNJMESbJp5KrnQVmQdEffwr7zhicijz2BgC";

const testWallet = "963z3DbPkZP7abXFY2UBdjfTmixkrgphGLdw2Wr4qvnB";
const wallet = solana.Keypair.fromSecretKey(bs58.decode(privates));

const walletAddress = new solana.PublicKey("963z3DbPkZP7abXFY2UBdjfTmixkrgphGLdw2Wr4qvnB");
const tokenMintAddress = new solana.PublicKey("4JeGKgkrwcNJMESbJp5KrnQVmQdEffwr7zhicijz2BgC"); // Replace with the actual token mint address

async function getTokenBalance(connection, wallet, mintAddress) {
	try {
		const walletAddress = new solana.PublicKey(wallet);
		const tokenMintAddress = new solana.PublicKey(mintAddress);

		const tokenAccounts = await connection.getTokenAccountsByOwner(walletAddress, {
			programId: splToken.TOKEN_PROGRAM_ID,
		});

		if (tokenAccounts && tokenAccounts.value) {
			console.log("Token                                         Balance");
			console.log("------------------------------------------------------------");

			tokenAccounts.value.forEach((tokenAccount) => {
				const accountData = splToken.AccountLayout.decode(tokenAccount.account.data);
				const tokenMint = new solana.PublicKey(accountData.mint);

				// Check if the token mint matches the specified tokenMintAddress
				if (tokenMint.toString() === tokenMintAddress.toString()) {
					console.log(`${tokenMint}   ${accountData.amount}`);
				}
			});
		} else {
			console.log("No token accounts found for the given wallet.");
		}
	} catch (error) {
		console.error("Error retrieving token balances:", error);
	}
}

async function getTokenBalance(connection, wallet, mintAddress) {
	try {
		const walletAddress = new solana.PublicKey(wallet);
		const tokenMintAddress = new solana.PublicKey(mintAddress);

		const tokenAccounts = await connection.getTokenAccountsByOwner(walletAddress, {
			programId: splToken.TOKEN_PROGRAM_ID,
		});

		if (tokenAccounts && tokenAccounts.value) {
			console.log("Token                                         Balance");
			console.log("------------------------------------------------------------");

			let totalBalance = 0n;

			tokenAccounts.value.forEach((tokenAccount) => {
				const accountData = splToken.AccountLayout.decode(tokenAccount.account.data);
				const tokenMint = new solana.PublicKey(accountData.mint);

				// Check if the token mint matches the specified tokenMintAddress
				if (tokenMint.toString() === tokenMintAddress.toString()) {
					totalBalance += BigInt(accountData.amount);
					console.log(`${tokenMint}   ${totalBalance}`);
				}
			});

			return totalBalance;
		} else {
			console.log("No token accounts found for the given wallet.");
			return 0;
		}
	} catch (error) {
		console.error("Error retrieving token balances:", error);
		return 0;
	}
}
// Example usage:

const walletAddress2 = "963z3DbPkZP7abXFY2UBdjfTmixkrgphGLdw2Wr4qvnB";
const tokenMintAddress2 = "4JeGKgkrwcNJMESbJp5KrnQVmQdEffwr7zhicijz2Bgd";

getTokenBalance(connection, walletAddress2, tokenMintAddress2);