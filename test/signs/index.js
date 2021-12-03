/* globals describe:false,it:false */

const Web3 = require('web3')
const { Account } = require('eth-lib')
const secrets = require('../../../secrets.json')
let web3Provider = new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${secrets.infuraKey}`)
const web3 = new Web3(web3Provider)
//0xeA199722372dea9DF458dbb56be7721af117a9Bc
// let account1 = web3.eth.accounts.wallet.add(secrets.accounts['0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'])
let account1 = web3.eth.accounts.wallet.add(secrets.accounts['0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401'])
web3.eth.defaultAccount = account1.address.toLowerCase()

const signatureObj = async (message, account) => {
  //实际签名的hash 是这个
  let messageHash = web3.eth.accounts.hashMessage(message)
  let signature = await web3.eth.sign(message, account)
  const result = signature.substring(2)
  const r = '0x' + result.substring(0, 64)
  const s = '0x' + result.substring(64, 128)
  const v = parseInt(result.substring(128, 130), 16) // The signature is now comprised of r, s, and v.
  // const v = "0x" + result.substring(128, 130)//
  let addr = await web3.eth.accounts.recover(message, signature)
  if (addr.toLowerCase() != account.toLowerCase()) return {}
  return {
    message,
    messageHash,
    r,
    s,
    v,
    signature
  }
}

;(async () => {
  // let signature = await signatureObj('message', '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401')
  // console.log(signature)
  //0x7f2ac5ec17818641ca7c87166375da6b7fa2030d34670905e92e96b4e601ff52

  //0xfd081c5739204e79bde84656b6f798f72f465209eeb13ff1380df7028c4e605c

  const okHash =
    '0x0a56b3317ed60dc4e1027a63ffbe9df6fb102401000000000000000000000000000000000000000000000000000000000000000131'

  //0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401,1,1
  const sender = web3.utils.toHex('0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401')
  const qty = web3.utils.toHex(1)
  const nonce = web3.utils.asciiToHex('1')
  // const nonce = web3.utils.fromAscii('1')
  // console.log(web3.utils.hexToAscii(val));
  // const encode = web3.utils.toHex('1')
  // const encode = web3.eth.abi.encodeParameter('string', '1')
  console.log(sender, qty, nonce)
  const hash = web3.utils.sha3(okHash)
  console.log(hash)
  const msgHash = web3.utils.soliditySha3(
    '\x19Ethereum Signed Message:\n32',
    '0xd83d9eecbc448500cb6cac3403d03b80fc54aadf6f50c1e261619a98ad206ab5'
  )
  console.log(msgHash)

  // bytes32 hash =  keccak256(abi.encodePacked(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
  const addressHash = web3.utils.soliditySha3('0x5B38Da6a701c568545dCfcB03FcB875f56beddC4')
  const addressHash1 = web3.utils.sha3('0x5B38Da6a701c568545dCfcB03FcB875f56beddC4')
  const addressHash2 = web3.utils.soliditySha3Raw('0x5B38Da6a701c568545dCfcB03FcB875f56beddC4')
  console.log(addressHash)
  console.log(addressHash1)
  console.log(addressHash2)

  //0xd83d9eecbc448500cb6cac3403d03b80fc54aadf6f50c1e261619a98ad206ab5

  const data = await web3.eth.accounts.sign(
    '0x5931b4ed56ace4c46b68524cb5bcbf4195f1bbaacbe5228fbd090546c88dd229',
    secrets.accounts['0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401']
  )
  // const data1 = Account.sign(addressHash, secrets.accounts['0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401'])
  console.log(data)
})()
