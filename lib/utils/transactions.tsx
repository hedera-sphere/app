import { AccountId, Client, Hbar, Long, PrivateKey, TokenAssociateTransaction, TokenMintTransaction, TransferTransaction } from "@hashgraph/sdk";
import { hashconnect, useWallet } from "../wallet/useWallet";
import { SPHERE_100, Token, USDT } from "../consts/tokens";
import HEDERA_DATA from '@/hedera_data.json'

const SPHERE_WALLET_ADRESS = HEDERA_DATA.creatorAccount.accountId;
const SUCCESS_MESSAGE = "SUCCESS";
const OPERATOR_ID = "0.0.5274980";
const OPERATOR_KEY = PrivateKey.fromString("302e020100300506032b6570042204208d9ddfcb9c80cb6f2181c07b44ebed3bfdadb051eadc80b3f94fcf65d629be5e");

export async function mintUsdt(rawAmount: number) {

  if (rawAmount <= 0) throw new Error("Amount must be greater than 0");
  const accountId = getAccountId();

  const amountWithDecimals = rawAmount * 100;
  const amount = Long.fromString(amountWithDecimals.toString());

  // associate USDT token
  const tokenSupport = await checkTokenSupport(USDT.address);
  if(!tokenSupport) throw new Error(`You must accept associate token ${USDT.name} with tokenid ${USDT.address} transaction`);

  // mint tokens
  console.log("minting tokens: ", amount)
  const tokenMintedReceipt = await mintToken(USDT.address, amount);
  console.log("Token minted: ", tokenMintedReceipt);

  // send minted tokens
  const sendTokensReceipt = await sendTokens(accountId, amount, USDT);
  console.log("Tokens sent: ", sendTokensReceipt);
}

export async function invest(rawAmount: number): Promise<number> {
  if (rawAmount <= 0) throw new Error("Amount must be greater than 0");

  const accountId = getAccountId();
  const amountWithDecimals = rawAmount * 100;
  const amount = Long.fromString(amountWithDecimals.toString());
  const spherePrice = await getSpherePrice();
  const rawAmountSphereTokensToTransfer = amountWithDecimals * spherePrice;
  const amountSphereTokensToTransfer = Long.fromString(rawAmountSphereTokensToTransfer.toString());

  // associate sphere token
  const tokenSupport = await checkTokenSupport(SPHERE_100.address);
  if(!tokenSupport) throw new Error(`You must accept associate token ${SPHERE_100.name} with tokenid ${SPHERE_100.address} transaction`);

  // receiving usdt tokens
  const receiveTokensReceipt = await receiveTokens(accountId, amount, USDT);
  console.log("Tokens received: ", receiveTokensReceipt);

  // send sphere tokens
  const mintTokensReceipt = await mintToken(SPHERE_100.address, amountSphereTokensToTransfer);
  console.log("Tokens minted: ", mintTokensReceipt);
  const sendTokensReceipt = await sendTokens(accountId, amountSphereTokensToTransfer, SPHERE_100);
  console.log("Tokens sent: ", sendTokensReceipt);

  return amountSphereTokensToTransfer;
}

export async function getSpherePrice(): Promise<number> {
  return 1.5;
}

async function getClient() {
  const client = Client.forTestnet();
  client.setOperator(OPERATOR_ID, OPERATOR_KEY);
  return client;
}

async function mintToken(tokenId: string, amount: Long) {

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
  } else {
    console.log("Token minted failed");
    throw new Error("Token minted failed please contact the development team");
  }

}

export async function sendTokens(accountId: AccountId, amount: Long, token: Token) {
  console.log("Transfering token: " + token.address + " from: " + SPHERE_WALLET_ADRESS + " to: " + accountId);

  const client = await getClient();

  const transferTx = await new TransferTransaction()
    .addTokenTransfer(token.address, SPHERE_WALLET_ADRESS, -amount)
    .addTokenTransfer(token.address, accountId, amount)
    .execute(client);

  const receiptTransfer = await transferTx.getReceipt(client);

  const transactionStatusTransfer = receiptTransfer.status;

  console.log("Transaction: " + transferTx.toString());

  if (transactionStatusTransfer.toString() == SUCCESS_MESSAGE) {
    console.log("Token sended successfully");
  } else {
    console.log(token.name + " token send failed");
    throw new Error(token.name + " token send failed");
  }

}

export async function receiveTokens(accountId: AccountId, amount: Long, token: Token) {
  const signer = await getSigner();
  const client = await getClient();

  const transferTx = await new TransferTransaction()
    .addTokenTransfer(token.address, accountId, -amount)
    .addTokenTransfer(token.address, SPHERE_WALLET_ADRESS, amount)
    .freezeWithSigner(signer);

  const response = await transferTx.executeWithSigner(signer);

  const receipt = await response.getReceipt(client);

  const transactionStatusTransfer = receipt.status;
  console.log("Transaction: " + transferTx.toString());

  if (transactionStatusTransfer.toString() == SUCCESS_MESSAGE) {
    console.log(token.name + " token received successfully");
  } else {
    throw new Error(token.name + " transfer failed");
  }
}

async function getSigner() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accountId = getAccountId() as any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
