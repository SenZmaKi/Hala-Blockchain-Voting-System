const algosdk = require('algosdk');

const algodToken = token={"x-api-key":'oMT938ZN9cacKTcIUlfQZ28sN6lyJCaS3lv2zYXF'}; // your API token
const algodServer = 'https://testnet-algorand.api.purestake.io/ps2'; // your Algod server address
const algodPort = ''; // your Algod server port
const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

let mnemonic = 'perfect faint onion powder citizen chuckle lesson life used donkey spike must tonight night visit voice floor fitness rare elevator twenty bracket corn about pool'
let mainAccount = algosdk.mnemonicToSecretKey(mnemonic)
console.log("Main account address: ", mainAccount.addr)

function generateAccount(count){
    let accounts = []
    for(i=0; i<count; i++){   
        accounts.push(algosdk.generateAccount())
        console.log("Account address: ", accounts[i].addr);
    }
    return accounts

}

let sendAccounts = generateAccount(1);

function sendVotes(mainAccount, sendAccounts){
    for (sendAccount of sendAccounts){
        ( async() => {
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
                "note": new Uint8Array(0)
            }
            let signedTxn = algosdk.signTransaction(txn, mainAccount.sk);
            let sendTx = await client.sendRawTransaction(signedTxn.blob).do();
        
            console.log("Transaction: " + sendTx.txId);
        })().catch( e => {
            return console.log(e);
        })

    }
}

sendVotes(mainAccount, sendAccounts)