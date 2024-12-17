import { AccountId, Client, Hbar, Long, PrivateKey, TokenAssociateTransaction, TokenMintTransaction, TransferTransaction } from "@hashgraph/sdk";
import { hashconnect, useWallet } from "../wallet/useWallet";
import { SPHERE_100, USDT } from "../consts/tokens";
import HEDERA_DATA from '@/hedera_data.json'
import { SP } from "next/dist/shared/lib/utils";

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
      const sendTokensReceipt = await sendTokens(accountId, amount, USDT.address);
      console.log("Tokens sent: ", sendTokensReceipt);
    }
  } catch (error) {
    console.error("Error during usdt minting:", error);
    return false;
  }
}

export async function invest(rawAmount: number) {
  try {

    if (rawAmount <= 0) return;
    const accountIdString = useWallet.getState().accountId;
    if (!accountIdString) return false;
    const accountId = AccountId.fromString(accountIdString);
    if (!accountId) return false;

    const amountWithDecimals = rawAmount * 100;
    const amount = Long.fromString(amountWithDecimals.toString());
    const spherePrice = await getSpherePrice();
    const rawAmountSphereTokensToTransfer = amountWithDecimals * spherePrice;
    const amountSphereTokensToTransfer = Long.fromString(rawAmountSphereTokensToTransfer.toString());
    // associate sphere token
    // const tokenSupport = await checkTokenSupport(SPHERE_100.address);
    // if(!tokenSupport) return false;
    // receiving usdt tokens
    const receiveTokensReceipt = await receiveTokens(accountId, amount, USDT.address);
    console.log("Tokens received: ", receiveTokensReceipt);
    if (receiveTokensReceipt) {
      const mintTokensReceipt = await mintToken(SPHERE_100.address, amountSphereTokensToTransfer);
      console.log("Tokens minted: ", mintTokensReceipt);
      if (mintTokensReceipt) {
        const sendTokensReceipt = await sendTokens(accountId, amountSphereTokensToTransfer, SPHERE_100.address);
        console.log("Tokens sent: ", sendTokensReceipt);
      }
    }
    // console.log("minting tokens: ", amount)
    // mint tokens
    // const tokenMintedReceipt = await mintToken(USDT.address, amount);
    // console.log("Token minted: ", tokenMintedReceipt);
    // if (tokenMintedReceipt) {
    //   const sendTokensReceipt = await sendTokens(accountId, amount);
    //   console.log("Tokens sent: ", sendTokensReceipt);
    // }
  } catch (error) {
    console.error("Error during usdt minting:", error);
    return false;
  }
}

export async function getSpherePrice(): Promise<number> {
  return 1.5;
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

export async function sendTokens(accountId: AccountId, amount: Long, tokenAdress: string): Promise<boolean> {
  try {
    console.log("Transfering token: " + tokenAdress + " from: " + SPHERE_WALLET_ADRESS + " to: " + accountId);

    const client = await getClient();

    const transferTx = await new TransferTransaction()
      .addTokenTransfer(tokenAdress, SPHERE_WALLET_ADRESS, -amount)
      .addTokenTransfer(tokenAdress, accountId, amount)
      .execute(client);

    const receiptTransfer = await transferTx.getReceipt(client);

    const transactionStatusTransfer = receiptTransfer.status;

    console.log("Transaction: " + transferTx.toString());

    if (transactionStatusTransfer.toString() == SUCCESS_MESSAGE) {
      console.log("Token sended successfully");
      return true;
    } else {
      console.log("Token send failed");
      return false;
    }
  } catch (error) {
    console.error("Error during token transfer:", error);

    return false;
  }
}

export async function receiveTokens(accountId: AccountId, amount: Long, tokenAddress: string): Promise<boolean> {
  try {
    const signer = await getSigner();
    const client = await getClient();
    console.log("Transfering token " +  tokenAddress + " from: " + SPHERE_WALLET_ADRESS + " to: " + accountId);
    console.log("signer: ", signer)
    console.log("accountId: ", accountId)
    console.log("amount: ", amount)
    console.log("tokenAddress: ", tokenAddress)

    const transferTx = await new TransferTransaction()
      .addTokenTransfer(tokenAddress, accountId, -amount)
      .addTokenTransfer(tokenAddress, SPHERE_WALLET_ADRESS, amount)
      .freezeWithSigner(signer);

    const response = await transferTx.executeWithSigner(signer);

    const receipt = await response.getReceipt(client);

    const transactionStatusTransfer = receipt.status;
    console.log("status receipt: ", transactionStatusTransfer)
    console.log("Transaction: " + transferTx.toString());

    if (transactionStatusTransfer.toString() == SUCCESS_MESSAGE) {
      console.log("Token received successfully");
      return true;
    } else {
      console.log("Token receive failed");
      return false;
    }
  } catch (error) {
    console.error("Error during token transfer:", error);
    console.error("Error during token transfer:", error.message);
    console.error("Error during token transfer:", error.stack);
    return false;
  }
}

async function getSigner(){
  const accountId = getAccountId() as any;

  return hashconnect.getSigner(accountId) as any;
}

function getAccountId(): AccountId {
  const accountIdString = useWallet.getState().accountId;
  if (!accountIdString) throw new Error("Account not found");
  const accountId = AccountId.fromString(accountIdString);
  if (!accountId) throw new Error("Account not found");

  return accountId;
}

export async function checkTokenSupport(address: string = USDT.address): Promise<boolean> {
  const signer = await getSigner();
  const accountId = getAccountId();

  try {
    
    const transaction = await new TokenAssociateTransaction()
      .setAccountId(accountId)
      .setTokenIds([address])
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
