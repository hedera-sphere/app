import { AccountId, Client, Hbar, Long, PrivateKey, TokenAssociateTransaction, TokenMintTransaction, TransferTransaction } from "@hashgraph/sdk";
import { hashconnect, useWallet } from "../wallet/useWallet";
import { USDT } from "../consts/tokens";
import HEDERA_DATA from '@/hedera_data.json'

const SPHERE_WALLET_ADRESS = HEDERA_DATA.creatorAccount.accountId;
export async function mintUsdt(rawAmount: number) {
  if(rawAmount <= 0) return;
  const accountIdString = useWallet.getState().accountId;
  if (!accountIdString) return false;
  const accountId = AccountId.fromString(accountIdString);
  if (!accountId) return false;


  const operatorId = "0.0.5274980"; // Replace with your Hedera testnet account ID
  const operatorKey = PrivateKey.fromString("302e020100300506032b6570042204208d9ddfcb9c80cb6f2181c07b44ebed3bfdadb051eadc80b3f94fcf65d629be5e"); // Replace with your Hedera testnet private key
  const amountWithDecimals = rawAmount * 100;
  const amount = Long.fromString(amountWithDecimals.toString());

  console.log("minting tokens: ", amount)
  // mint tokens
  const client = Client.forTestnet();
  client.setOperator(operatorId, operatorKey);

  const mintTx = await new TokenMintTransaction()
    .setTokenId(USDT.address)
    .setAmount(amount)
    .setMaxTransactionFee(new Hbar(20)) //Use when HBAR is under 10 cents
    .execute(client);


  //Request the receipt of the transaction
  const receipt = await mintTx.getReceipt(client);

  //Get the transaction consensus status
  const transactionStatus = receipt.status;

  console.log("Transaction: " + mintTx.toString());
  console.log("The transaction mint status " + transactionStatus.toString());
  console.log("Transfering tokens from: " + SPHERE_WALLET_ADRESS + " to: " + accountId);
  // Transfer minted tokens
  const transferTx = await new TransferTransaction()
    .addTokenTransfer(USDT.address, SPHERE_WALLET_ADRESS, -amount)
    .addTokenTransfer(USDT.address, accountId, amount)
    .execute(client);

  //Request the receipt of the transaction
  const receiptTransfer = await transferTx.getReceipt(client);

  //Get the transaction consensus status
  const transactionStatusTransfer = receiptTransfer.status;

  console.log("Transaction: " + transferTx.toString());
  console.log("The transaction transfer status " + transactionStatusTransfer.toString());
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

