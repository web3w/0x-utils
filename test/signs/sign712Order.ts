import * as ethUtil from 'ethereumjs-util'
import { utils } from 'ethers'

const abiCoder = new utils.AbiCoder()
const typedData = {
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

const types = typedData.types

// Recursively finds all the dependencies of a type
function dependencies(primaryType: string, found = []) {
  // @ts-ignore
  if (found.includes(primaryType)) {
    return found
  }
  // @ts-ignore
  if (types[primaryType] === undefined) {
    return found
  }
  // @ts-ignore
  found.push(primaryType)
  // @ts-ignore
  for (let field of types[primaryType]) {
    for (let dep of dependencies(field.type, found)) {
      if (!found.includes(dep)) {
        found.push(dep)
      }
    }
  }
  return found
}

function encodeType(primaryType: string) {
  // Get dependencies primary first, then alphabetical
  let deps = dependencies(primaryType)
  deps = deps.filter(t => t != primaryType)
  // @ts-ignore
  deps = [primaryType].concat(deps.sort())

  // Format as a string with fields
  let result = ''
  for (let type of deps) {
    // @ts-ignore
    result += `${type}(${types[type].map(({ name, type }) => `${type} ${name}`).join(',')})`
  }
  return result
}

function typeHash(primaryType: string) {
  const str = encodeType(primaryType)
  return ethUtil.keccakFromString(str)
}

function encodeData(primaryType: string, data: any) {
  let encTypes = []
  let encValues = []

  // Add typehash
  encTypes.push('bytes32')
  encValues.push(typeHash(primaryType))

  // Add field contents
  // @ts-ignore
  for (let field of types[primaryType]) {
    let value = data[field.name]
    if (field.type == 'string' || field.type == 'bytes') {
      encTypes.push('bytes32')
      value = ethUtil.keccakFromString(value)
      encValues.push(value)
    } else { // @ts-ignore
      if (types[field.type] !== undefined) {
        encTypes.push('bytes32')
        value = ethUtil.keccak256(encodeData(field.type, value))
        encValues.push(value)
      } else if (field.type.lastIndexOf(']') === field.type.length - 1) {
        throw 'TODO: Arrays currently unimplemented in encodeData'
      } else {
        encTypes.push(field.type)
        encValues.push(value)
      }
    }
  }
  const abi = abiCoder.encode(encTypes, encValues)
  return ethUtil.toBuffer(abi)
}

function structHash(primaryType: string, data: any) {
  console.log(primaryType)
  const strBuff = encodeData(primaryType, data)
  return ethUtil.keccak256(strBuff)
}

function signHash() {
  const buff1 = Buffer.from('1901', 'hex')
  const buff2 = structHash('EIP712Domain', typedData.domain)
  const buff3 = structHash(typedData.primaryType, typedData.message)
  const buffAll = Buffer.concat([buff1, buff2, buff3])
  return ethUtil.keccak256(buffAll)
}

const privateKey = ethUtil.keccakFromString('cow')

const address = ethUtil.privateToAddress(privateKey)
const sig = ethUtil.ecsign(signHash(), privateKey)

console.log(sig)
