import algosdk
from pyteal import *
import algosdk
from base64 import b64decode

token = {"X-API-Key": 'oMT938ZN9cacKTcIUlfQZ28sN6lyJCaS3lv2zYXF'}; 
port = ''; 
algodServer = 'https://testnet-algorand.api.purestake.io/ps2'; 
algodClient = algosdk.v2client.algod.AlgodClient("", algodServer, headers=token); 
algosdk.transaction
main_account_addr = '6DBVPHKM72R63CT7HQDOUSRQFHHACVNFJZDK4AUTK4EEGUV4FHBA3DWWXA'
mnemonic_phrase = 'perfect faint onion powder citizen chuckle lesson life used donkey spike must tonight night visit voice floor fitness rare elevator twenty bracket corn about pool'
main_account_sk = algosdk.mnemonic.to_private_key(mnemonic_phrase)

app_id = 194376594
app_transaction = "EQPQBCY5TEMER4ADX2SOMC22J7KPXPUI462XIG5ZM3F6B7TRA3AA"

opt_acc_sk, opt_acc_addr = algosdk.account.generate_account()
print("Opt Account address: ", opt_acc_addr)
sugg_p = algodClient.suggested_params()
sugg_p.fee = 0
sugg_p.min_fee = 0
optin_txn = algosdk.transaction.ApplicationOptInTxn(
    sender=opt_acc_addr,
    sp=sugg_p,
    index=app_id,
)

signed_txn = optin_txn.sign(opt_acc_sk)

# Send the signed Opt-In transaction to the Algorand blockchain
txid = algodClient.send_transaction(signed_txn)
print("Transaction ID:", txid)

