import { AccountId, Client, Hbar, Long, PrivateKey, TokenAssociateTransaction, TokenMintTransaction, TransferTransaction } from "@hashgraph/sdk";
import { hashconnect, useWallet } from "../wallet/useWallet";
import { USDT } from "../consts/tokens";
import HEDERA_DATA from '@/hedera_data.json'

const SPHERE_WALLET_ADRESS = HEDERA_DATA.creatorAccount.accountId;
const SUCCESS_MESSAGE = "SUCCESS";
const OPERATOR_ID = "0.0.5274980";
const OPERATOR_KEY = PrivateKey.fromString("302e020100300506032b6570042204208d9ddfcb9c80cb6f2181c07b44ebed3bfdadb051eadc80b3f94fcf65d629be5e");
export async function mintUsdt(rawAmount: number) {
  try {

    if (rawAmount <= 0) return;
    const accountIdString = useWallet.getState().accountId;
    if (!accountIdString) return false;
    const accountId = AccountId.fromString(accountIdString);
    if (!accountId) return false;

    const amountWithDecimals = rawAmount * 100;
    const amount = Long.fromString(amountWithDecimals.toString());

    console.log("minting tokens: ", amount)
    // mint tokens
    const tokenMintedReceipt = await mintToken(USDT.address, amount);
    console.log("Token minted: ", tokenMintedReceipt);
    if (tokenMintedReceipt) {
      const sendTokensReceipt = await sendTokens(accountId, amount);
      console.log("Tokens sent: ", sendTokensReceipt);
    }
  } catch (error) {
    console.error("Error during usdt minting:", error);
    return false;
  }
}

async function getClient() {
  const client = Client.forTestnet();
  client.setOperator(OPERATOR_ID, OPERATOR_KEY);
  return client;
}

async function mintToken(tokenId: string, amount: Long): Promise<boolean> {
  try {

    const client = await getClient();

    const mintTx = await new TokenMintTransaction()
      .setTokenId(tokenId)
      .setAmount(amount)
      .setMaxTransactionFee(new Hbar(10))
      .execute(client);


    //Request the receipt of the transaction
    const receipt = await mintTx.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("Transaction: " + mintTx.toString());

    if (transactionStatus.toString() == SUCCESS_MESSAGE) {
      console.log("Token minted successfully");
      return true;
    } else {
      console.log("Token minted failed");
      return false;
    }
  }
  catch (error) {
    console.error("Error during token minting:", error);
    return false;
  }
}

export async function sendTokens(accountId: AccountId, amount: Long): Promise<boolean> {
  try {
    console.log("Transfering tokens from: " + SPHERE_WALLET_ADRESS + " to: " + accountId);

    const client = await getClient();

    const transferTx = await new TransferTransaction()
      .addTokenTransfer(USDT.address, SPHERE_WALLET_ADRESS, -amount)
      .addTokenTransfer(USDT.address, accountId, amount)
      .execute(client);

    const receiptTransfer = await transferTx.getReceipt(client);

    const transactionStatusTransfer = receiptTransfer.status;

    console.log("Transaction: " + transferTx.toString());

    if (transactionStatusTransfer.toString() == SUCCESS_MESSAGE) {
      console.log("Token transfered successfully");
      return true;
    } else {
      console.log("Token transfer failed");
      return false;
    }
  } catch (error) {
    return false;
    console.error("Error during token transfer:", error);
  }
}

export async function checkTokenSupport() {
  const accountIdString = useWallet.getState().accountId;
  if (!accountIdString) return false;

  try {
    const accountId = AccountId.fromString(accountIdString) as any;
    if (!accountId) return false;

    const signer = hashconnect.getSigner(accountId) as any;
    const transaction = await new TokenAssociateTransaction()
      .setAccountId(accountId)
      .setTokenIds([USDT.address])
      .freezeWithSigner(signer);

    await transaction.executeWithSigner(signer);

    // If no errors occur and the transaction completes, return true
    return true;
  } catch (error) {
    console.error("Error during token association:", error);
    // Return false if an error occurs
    return false;
  }
}
