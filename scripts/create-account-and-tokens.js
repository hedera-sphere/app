import { Client, PrivateKey, TokenCreateTransaction, TokenType, TokenSupplyType
    , AccountBalanceQuery, TokenDeleteTransaction
 } from "@hashgraph/sdk";
import { writeFileSync } from "fs";

(async function main() {
    try {
        const TOKEN_DATA = {
            SPHERE_NAME : "hsphere",
            SPHERE_SYMBOL: "HSPHERE",
            SPHERE_INITIAL_SUPPLY: "100.000.000.000.00",
            SPHERE_MAX_SUPPLY : "100.000.000.000.000",
            SPHERE100_NAME : "hsphere100",
            SPHERE100_SYMBOL: "HSPHERE100",
            USDT_NAME : "Test USDT",
            USDT_SYMBOL: "USDT",
        }
        // Step 1: Set up the Hedera testnet client
        const operatorId = "0.0.5274980"; // Replace with your Hedera testnet account ID
        const operatorKey = PrivateKey.fromString("302e020100300506032b6570042204208d9ddfcb9c80cb6f2181c07b44ebed3bfdadb051eadc80b3f94fcf65d629be5e"); // Replace with your Hedera testnet private key

        const client = Client.forTestnet();
        client.setOperator(operatorId, operatorKey);

        //   Delete tokens created by the account
        console.log("Fetching tokens linked to the account...");
        const balanceQuery = await new AccountBalanceQuery()
            .setAccountId(operatorId)
            .execute(client);

        const tokens = balanceQuery.tokens;
        console.log("Tokens associated with the account:", tokens);

        for (const [tokenId] of tokens) {
            try {
                console.log(`Deleting token: ${tokenId}`);
        
                // Create a TokenDeleteTransaction
                const deleteTx = await new TokenDeleteTransaction()
                    .setTokenId(tokenId)
                    .freezeWith(client); // Freeze the transaction with the client
        
                // Sign the transaction with the admin key
                const signedDeleteTx = await deleteTx.sign(operatorKey);
        
                // Execute the transaction and get the receipt
                await signedDeleteTx.execute(client).then(tx => tx.getReceipt(client));
        
                console.log(`Token ${tokenId} deleted successfully.`);
            } catch (error) {
                console.warn(`Could not delete token ${tokenId}:`, error.message);
            }
        }

        // Step 2: Create the first token (hsphere)
        const hsphereTx = await new TokenCreateTransaction()
            .setTokenName(TOKEN_DATA.SPHERE_NAME)
            .setTokenSymbol(TOKEN_DATA.SPHERE_SYMBOL)
            .setDecimals(2) // Number of decimal places
            .setInitialSupply(TOKEN_DATA.SPHERE_INITIAL_SUPPLY) 
            .setMaxSupply(TOKEN_DATA.SPHERE_MAX_SUPPLY) // Max supply: 100 million
            .setTokenType(TokenType.FungibleCommon)
            .setSupplyType(TokenSupplyType.Finite) // Limited supply
            .setTreasuryAccountId(operatorId) // Use operator as the treasury account
            .setAdminKey(operatorKey) // Set admin key for managing the token
            .setSupplyKey(operatorKey) // Set supply key for minting
            .execute(client);

        const hsphereReceipt = await hsphereTx.getReceipt(client);
        const hsphereTokenId = hsphereReceipt.tokenId;

        console.log(`Token 'hsphere' created with ID: ${hsphereTokenId}`);

        // Step 3: Create the second token (hsphere100)
        const hsphere100Tx = await new TokenCreateTransaction()
            .setTokenName(TOKEN_DATA.SPHERE100_NAME)
            .setTokenSymbol(TOKEN_DATA.SPHERE100_SYMBOL)
            .setDecimals(2) // Number of decimal places
            .setInitialSupply(0) // Initial supply
            .setTokenType(TokenType.FungibleCommon)
            .setSupplyType(TokenSupplyType.Infinite) // Unlimited supply
            .setTreasuryAccountId(operatorId) // Use operator as the treasury account
            .setAdminKey(operatorKey) // Set admin key for managing the token
            .setSupplyKey(operatorKey) // Set supply key for minting
            .execute(client);

        const hsphere100Receipt = await hsphere100Tx.getReceipt(client);
        const hsphere100TokenId = hsphere100Receipt.tokenId;

        console.log(`Token 'hsphere' created with ID: ${hsphere100TokenId}`);

        // Step 3: Create the second token (hsphere100)
        const usdt100Tx = await new TokenCreateTransaction()
            .setTokenName(TOKEN_DATA.USDT_NAME)
            .setTokenSymbol(TOKEN_DATA.USDT_SYMBOL)
            .setDecimals(2) // Number of decimal places
            .setInitialSupply(0) // Initial supply
            .setTokenType(TokenType.FungibleCommon)
            .setSupplyType(TokenSupplyType.Infinite) // Unlimited supply
            .setTreasuryAccountId(operatorId) // Use operator as the treasury account
            .setAdminKey(operatorKey) // Set admin key for managing the token
            .setSupplyKey(operatorKey) // Set supply key for minting
            .execute(client);

        const usdtReceipt = await usdt100Tx.getReceipt(client);
        const usdtTokenId = usdtReceipt.tokenId;

        console.log(`Token 'usdt' created with ID: ${usdtTokenId}`);

        // Step 4: Store all data in a JSON file
        const data = {
            creatorAccount: {
                accountId: operatorId,
                privateKey: operatorKey.toString(),
            },
            tokens: {
                hsphere: {
                    name: TOKEN_DATA.SPHERE_NAME,
                    symbol: TOKEN_DATA.SPHERE_SYMBOL,
                    tokenId: hsphereTokenId.toString(),
                    maxSupply: TOKEN_DATA.SPHERE_MAX_SUPPLY,
                    supplyType: "Finite",
                },
                hsphere100: {
                    name: TOKEN_DATA.SPHERE100_NAME,
                    symbol: TOKEN_DATA.SPHERE100_SYMBOL,
                    tokenId: hsphere100TokenId.toString(),
                    maxSupply: "Unlimited",
                    supplyType: "Infinite",
                },
                usdt: {
                    name: TOKEN_DATA.USDT_NAME,
                    symbol: TOKEN_DATA.USDT_SYMBOL,
                    tokenId: usdtTokenId.toString(),
                    maxSupply: "Unlimited",
                    supplyType: "Infinite",
                },
            },
        };

        writeFileSync("hedera_data.json", JSON.stringify(data, null, 4));
        console.log("Data saved to hedera_data.json");

    } catch (error) {
        console.error("Error:", error);
    }
})();
