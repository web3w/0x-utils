// https://docs.ethers.io/v5/api/signer/
import { ethers } from 'ethers'
import secrets from '../../../../secrets.json'

// const account1 = web3.eth.accounts.wallet.add()
  // const account2 = web3.eth.accounts.wallet.add(secrets.accounts['0xeb1e5B96bFe534090087BEb4FB55CC3C32bF8bAA'])



(async () => {

  // web3AccountSignature 0x70c3169996e404a237d97567a0977d3cea9c97eb67e51df5eacc9dd5047f46445a98eeb7f72743d98e14130011fe572f8e63955ea12be65cbc6097e97572e17e1c
  // web3EthSignature 0x70c3169996e404a237d97567a0977d3cea9c97eb67e51df5eacc9dd5047f46445a98eeb7f72743d98e14130011fe572f8e63955ea12be65cbc6097e97572e17e1c

  // const signer = web3.eth.accounts.wallet.add(secrets.accounts['0x32f4B63A46c1D12AD82cABC778D75aBF9889821a'])
  // const provider = new ethers.providers.Web3Provider(window.ethereum)
  const sigeAddr = '0x32f4B63A46c1D12AD82cABC778D75aBF9889821a'
  const signerPrivate = secrets.accounts[sigeAddr]
  const testAddr = '0xDb093eA18823a867f5a28D335d9142AEd3979fE9'
  const hashAddr = ethers.utils.keccak256(testAddr)
  const binaryData = ethers.utils.arrayify(hashAddr)
  const wallet = new ethers.Wallet(signerPrivate)
  const signature = await wallet.signMessage(binaryData)
  console.log(signature)
})()

