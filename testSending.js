const algosdk = require('algosdk');
const crypto = require('crypto')
const algodToken = {"X-API-Key": 'oMT938ZN9cacKTcIUlfQZ28sN6lyJCaS3lv2zYXF'}; // your API token
const algodServer = 'https://testnet-algorand.api.purestake.io/ps2'; // your Algod server address
const algodPort = ''; // your Algod server port
const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
client.accountApplicationInformation
let mnemonic = 'perfect faint onion powder citizen chuckle lesson life used donkey spike must tonight night visit voice floor fitness rare elevator twenty bracket corn about pool'
let mainAccount = algosdk.mnemonicToSecretKey(mnemonic)
console.log("Main account address: ", mainAccount.addr)

function generateAccount(count){
    let accounts = []
    for(i=0; i<count; i++){   
        accounts.push(algosdk.generateAccount())
        console.log("Account address: ", accounts[i].addr);
    }
    return accounts;
}

async function hasVoted(mainAccount, voterId) {
    const transactionNote = generateTransactionNote(voterId);
    client.transactionB
    const transactions = await client.accountInformation(mainAccount.addr).do();
    console.log(transactions.transactions)
    for (let txn of transactions["transactions"]) {
        if (txn.txn.note === transactionNote) {
            return true;
        }
    }
    return false;
}

function generateTransactionNote(voterId) {
    const hash = crypto.createHash('sha512');
    hash.update(Buffer.from(voterId));
    return hash.digest('base64');
}

async function sendVote(mainAccount, sendAccount, voterId){
    if (!await hasVoted(mainAccount, voterId)){
        console.log(voterId)
        let params = await client.getTransactionParams().do();
        let txn = {
            "from": mainAccount.addr,
            "to": sendAccount.addr,
            "fee": 1,
            "amount": 1000000, // 1 algo
            "firstRound": params.firstRound,
            "lastRound": params.lastRound,
            "genesisID": params.genesisID,
            "genesisHash": params.genesisHash,
            "note": generateTransactionNote(voterId),
        }
        let signedTxn = algosdk.signTransaction(txn, mainAccount.sk);
        let sendTx = await client.sendRawTransaction(signedTxn.blob).do();
        console.log("Transaction: " + sendTx.txId);
    }
    else{return console.error(`Voter ${voterId} has already voted!!!`);}
}

let sendAccounts = generateAccount(1)[0];
sendVote(mainAccount, sendAccounts, "123");
