// https://github.com/ethereum/EIPs/tree/master/assets/eip-712
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md
// https://metamask.github.io/test-dapp/
// https://www.npmjs.com/package/@metamask/eth-sig-util


// https://medium.com/compound-finance/delegation-and-voting-with-eip-712-signatures-a636c9dfec5e
import { ethers, Wallet } from 'ethers'
import { hashMessage, _TypedDataEncoder } from '@ethersproject/hash'
import { infuraKey, accounts } from '../../../../secrets.json'
import { FeeData } from '@ethersproject/abstract-provider/src.ts/index'
import { TypedDataField } from '@ethersproject/abstract-signer'

export const createDelegateBySigMessage = (compAddress: string, delegatee: string, expiry = 10e9, chainId = 1, nonce = 0) => {
    const types = {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' }
      ],
      Delegation: [
        { name: 'delegatee', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'expiry', type: 'uint256' }
      ]
    }

    const primaryType = 'Delegation'
    const domain = { name: 'Compound', chainId, verifyingContract: compAddress }
    const message = { delegatee, nonce, expiry }

    return { types, primaryType, domain, message }
  }

;(async () => {
  const sigeAddr = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401'
  const signerPrivate = accounts[sigeAddr]

  // const provider = new ethers.providers.InfuraProvider('rinkeby',infuraKey);
  // 连接网络
  const provider = ethers.getDefaultProvider('mainnet')

  const blockNum = await provider.getBlockNumber()
  const fee = <FeeData>await provider.getFeeData()

  console.log('network info', blockNum, fee.gasPrice?.toString(), fee.maxFeePerGas?.toString())

  const wallet = new Wallet(signerPrivate)

  const compAddress = '0xc00e94cb662c3520282e6f5717214004a7f26888'
  const delegatee = '0x1234567890000000000000000000000123456789'

  const msgParams = createDelegateBySigMessage(compAddress, delegatee)

  console.log(JSON.stringify(msgParams, null, 2))

  const types = { Delegation: msgParams.types.Delegation }
  const signature = await wallet._signTypedData(msgParams.domain, { Delegation: msgParams.types.Delegation }, msgParams.message)
  console.log(signature)
  // 0x2b0e91a79df1a9aa197de89a5e6af8ad893f6d4173ab47de15b4a05e0cbe28e5413ff2748579bb8bbdf7c89debda1c581f59c8279140a1d79d7b65f666d9e88f1c


})()

const order = {
  'types': {
    'EIP712Domain': [
      { 'name': 'name', 'type': 'string' },
      { 'name': 'version', 'type': 'string' },
      { 'name': 'chainId', 'type': 'uint256' },
      { 'name': 'verifyingContract', 'type': 'address' }
      ],
    'Order': [
      { 'name': 'makerAddress', 'type': 'address' },
      { 'name': 'takerAddress', 'type': 'address' },
      { 'name': 'feeRecipientAddress', 'type': 'address' },
      { 'name': 'senderAddress', 'type': 'address' },
      { 'name': 'makerAssetAmount', 'type': 'uint256' },
      { 'name': 'takerAssetAmount', 'type': 'uint256' },
      { 'name': 'makerFee', 'type': 'uint256' },
      { 'name': 'takerFee', 'type': 'uint256' },
      { 'name': 'expirationTimeSeconds', 'type': 'uint256' },
      { 'name': 'salt', 'type': 'uint256' },
      { 'name': 'makerAssetData', 'type': 'bytes' },
      { 'name': 'takerAssetData', 'type': 'bytes' },
      { 'name': 'makerFeeAssetData', 'type': 'bytes' },
      { 'name': 'takerFeeAssetData', 'type': 'bytes' }
      ]
  },
  'domain': {
    'name': '0x Protocol',
    'version': '3.0.0',
    'chainId': 4,
    'verifyingContract': '0x0721be0636eaff1e5198da70e8280edff14f6939'
  },
  'message': {
    'makerAddress': '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401',
    'takerAddress': '0x0000000000000000000000000000000000000000',
    'feeRecipientAddress': '0x0000000000000000000000000000000000000000',
    'senderAddress': '0x0000000000000000000000000000000000000000',
    'makerAssetAmount': '1',
    'takerAssetAmount': '200',
    'makerFee': '0',
    'takerFee': '0',
    'expirationTimeSeconds': '1649930500082',
    'salt': '0',
    'takerAssetData': '0xf47261b0000000000000000000000000b506bfaa7661dabf4de80672bd3f13f4610a5fdf',
    'makerAssetData': '0x025717920000000000000000000000006b0d7ed64d8facde81b76f8ea6598808ee93fb0b0000000000000000000000000000000000000000000000000000000000000001',
    'makerFeeAssetData': '0x',
    'takerFeeAssetData': '0x',
    'chainId': '4',
    'exchangeAddress': '0x0721be0636eaff1e5198da70e8280edff14f6939'
  },
  'primaryType': 'Order'
}

