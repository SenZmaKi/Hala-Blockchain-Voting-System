import algosdk
from algosdk import account, encoding, transaction
from pyteal import *
import algosdk
from base64 import b64decode

token = {"X-API-Key": 'oMT938ZN9cacKTcIUlfQZ28sN6lyJCaS3lv2zYXF'}; 
port = ''; 
algodServer = 'https://testnet-algorand.api.purestake.io/ps2'; 
algodClient = algosdk.v2client.algod.AlgodClient("", algodServer, headers=token); 
algosdk.transaction
addr = '6DBVPHKM72R63CT7HQDOUSRQFHHACVNFJZDK4AUTK4EEGUV4FHBA3DWWXA'
mnemonic_phrase = 'perfect faint onion powder citizen chuckle lesson life used donkey spike must tonight night visit voice floor fitness rare elevator twenty bracket corn about pool'
creator_sk = algosdk.mnemonic.to_private_key(mnemonic_phrase)
specific_address = Addr(addr)
approve_teal_program = And(
    Txn.sender() == specific_address,
    Int(1) == Int(1)
)
clear_state_program = compileTeal(
    Approve(),
    mode=Mode.Application,
    version=6
)

approve_teal_program = compileTeal(approve_teal_program, mode=Mode.Signature, version=6)

def compile_program(client, teal_source):
    compile_response = client.compile(teal_source)
    return b64decode(compile_response['result'])

txn = algosdk.transaction.ApplicationCreateTxn(
    sender=addr,
    on_complete=algosdk.transaction.OnComplete.NoOpOC,
    sp=algodClient.suggested_params(),
    approval_program=compile_program(algodClient, approve_teal_program),
    clear_program=compile_program(algodClient, clear_state_program),
    global_schema=algosdk.transaction.StateSchema(num_uints=2, num_byte_slices=2),
    local_schema=algosdk.transaction.StateSchema(num_uints=0, num_byte_slices=0),
)
signed_txn = txn.sign(creator_sk)

tx_id = algodClient.send_transaction(signed_txn)
response = algosdk.transaction.wait_for_confirmation(algodClient, signed_txn.get_txid(), 10)
print(f"Created App with id: {response['application-index']}  in tx: {tx_id}")
