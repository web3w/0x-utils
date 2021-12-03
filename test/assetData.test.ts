import { BigNumber } from '../src/utils'
import { ethers } from 'ethers'
import { BaseOrder  } from '../src/types/types'

// import { assetDataUtils } from '../src/order-utils'


const NULL_ADDRESS = ethers.constants.AddressZero
const accountB = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401'
const bn = new BigNumber('0')
const bn1 = new BigNumber('1')
const bnMax = new BigNumber(ethers.constants.MaxInt256.toString())

const order = {
  makerAddress: accountB,
  takerAddress: NULL_ADDRESS,
  feeRecipientAddress: NULL_ADDRESS,
  senderAddress: NULL_ADDRESS,
  makerAssetAmount: bn1,
  takerAssetAmount: bn1,
  makerFee: bn,
  takerFee: bn,
  expirationTimeSeconds: bnMax,
  salt: bn,
  makerAssetData: '0x',
  takerAssetData: '0x',
  makerFeeAssetData: '0x',
  takerFeeAssetData: '0x'
} as BaseOrder;

(async () => {
  try {
   //  const data = assetDataUtils.encodeERC20AssetData(accountB)
   // const foo =  assetDataUtils.decodeAssetDataOrThrow(data)
   //
   //  const data721 = assetDataUtils.encodeERC721AssetData(accountB,new BigNumber(2))
   //  const fooo =  assetDataUtils.decodeAssetDataOrThrow(data721)
   //  console.log(foo,fooo)
  } catch (e) {
    console.log(e)
  }
})()
