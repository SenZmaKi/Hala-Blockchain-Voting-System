const algosdk = require('algosdk');

async function fetchElectionResults(){
    const token = {"X-API-Key": 'oMT938ZN9cacKTcIUlfQZ28sN6lyJCaS3lv2zYXF'}; // your API token
    const port = ''; // algod server port
    const algodServer = 'https://testnet-algorand.api.purestake.io/ps2'; // algod server address
    const algodClient = new algosdk.Algodv2(token, algodServer, port); // api client set up for algodServer
    
    const indexerServer = 'https://testnet-algorand.api.purestake.io/idx2'; // indexer server address for querying the blockchain i.e to retrieve transaction details
    const indexerClient = new algosdk.Indexer(token, indexerServer, port); //api client set up for indexServer
    
    //Mnemonic in order to generate the same mainAccount each time
    const mnemonic = 'perfect faint onion powder citizen chuckle lesson life used donkey spike must tonight night visit voice floor fitness rare elevator twenty bracket corn about pool';
    const mainAccount = algosdk.mnemonicToSecretKey(mnemonic);
    console.log("Main account address: ", mainAccount.addr);
    
    //Account addresses for the candidates to whom voters will vote
    const candidateAccountAddresses = ['3WAUHLNF7C4H7MYU2D5AUPBMPQFYP7AICOZJKM2JPPHG4CWVLRSPBVZMMU',
                                        'HGK4JWYTA3ZTQSBWW22PN4F3JL7GTWVH6GH7ECPOXT4HJNIG3TUB4O432M',
                                        'Z4TKPDBH3KGAADVR77HRBKMHAMHDDS75WJSO67EPJNPNLR5TMW5UHYPCX4',
                                        'YN4QCUYMG7GM6OLGTYRJKO4E2U5MNAPVISNS4GQGABPWRXMM6A3H2F6AXA']

    const transactionsDetails = await indexerClient.lookupAccountTransactions(mainAccount.addr).do();
        const transactions = transactionsDetails['transactions'];
        const paymentTransactions = [];
        for(const transaction of transactions){
            const paymentTransaction = transaction['payment-transaction'];
            paymentTransactions.push(paymentTransaction);
        }
        const receivers = [];
        for(const paymentTransaction of paymentTransactions){
            if(!(paymentTransaction === undefined)){
                receivers.push(paymentTransaction.receiver);
            }
        }
        const candidateVoteCounts = [];
        for(const candidateAccountAddress of candidateAccountAddresses){
            let voteCount = 0;
            receivers.forEach((elementReceivers)=>{
                if(candidateAccountAddress==elementReceivers){
                    voteCount+=1;
                }
            })
            candidateVoteCounts.push(voteCount);
        }
        let candidatesMap = {
            uhuru:0,
            ruto:0,
            raila:0,
            wajakoya:0
        };
        candidatesMap.uhuru = candidateVoteCounts[0];
        candidatesMap.ruto = candidateVoteCounts[1];
        candidatesMap.raila = candidateVoteCounts[2];
        candidatesMap.wajakoya = candidateVoteCounts[3];
        return candidatesMap;
    }


const results = fetchElectionResults();
results.then((results)=>{
    console.log(results);
})