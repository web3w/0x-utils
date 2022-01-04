// import { ECSignature } from '../../order-utils'

import * as ethUtil from 'ethereumjs-util'
import { joinSignature } from 'ethers/lib/utils'

export interface ECSignature {
  v: number;
  r: string;
  s: string;
}

import { ethers, Signer } from 'ethers'
import { Deferrable } from '@ethersproject/properties'
import { TransactionRequest, Provider } from '@ethersproject/abstract-provider'
import {
  EIP1193Provider,
  JSONRPCErrorCallback,
  JSONRPCRequestPayload,
  JSONRPCResponsePayload,
  SupportedProvider,
  ZeroExProvider
} from 'ethereum-types'
import * as _ from 'lodash'
import { EIP712TypedData, WalletPrikey } from '../../../index'
import { signTypedDataUtils } from './sign_typed_data_utils'

class SingerProvider {
  private priKeyBuff: Buffer
  private account: string
  private walletInfo: WalletPrikey
  // private wallet: Signer

  constructor(wallet: WalletPrikey) {
    const prikeyBuff = ethUtil.toBuffer(wallet.priKey)
    this.priKeyBuff = prikeyBuff
    this.account = ethUtil.bufferToHex(ethUtil.privateToAddress(prikeyBuff))
    this.walletInfo = wallet
    // this.wallet = new ethers.Wallet(wallet.priKey)
  }

  private ecsign(hashBuff: Buffer) {
    const prikeyBuff = this.priKeyBuff
    const signAddr = ethUtil.bufferToHex(ethUtil.privateToAddress(prikeyBuff))
    const signature = ethUtil.ecsign(hashBuff, prikeyBuff)

    const pubKey = ethUtil.ecrecover(
      hashBuff,
      signature.v,
      signature.r,
      signature.s
    )
    const retrievedAddress = ethUtil.bufferToHex(ethUtil.pubToAddress(pubKey))

    if (signAddr !== retrievedAddress) return ''

    const signRsv: ECSignature = {
      v: signature.v,
      s: ethUtil.bufferToHex(signature.s),
      r: ethUtil.bufferToHex(signature.r)
    }
    return joinSignature(signRsv)
  }

  private signMessage(message: string): string {
    const msgBuff = ethUtil.toBuffer(message)
    const prefixedMsgBuff = ethUtil.hashPersonalMessage(msgBuff)
    return this.ecsign(prefixedMsgBuff)
  }

  async sendAsync(payload: JSONRPCRequestPayload, callback: JSONRPCErrorCallback) {
    const account = this.account
    console.log('sendAsync', payload.method)
    if (payload.method === 'eth_sign' || payload.method === 'personal_sign') {
      const [address, message] = payload.params
      console.log(message)
      const signatureStr = this.signMessage(message)
      callback(null, {
        id: 42,
        jsonrpc: '2.0',
        result: signatureStr
      })
    } else if (payload.method === 'eth_signTypedData_v4'
      || payload.method === 'eth_signTypedData_v3'
      || payload.method === 'eth_signTypedData_v2'
      || payload.method === 'eth_signTypedData') {
      const [address, message] = payload.params

      const msgParams = JSON.parse(message) as EIP712TypedData
      // console.log('eth_signTypedData_x', JSON.stringify(msgParams, null, 2))

      // const signatureStr =await this.wallet._signTypedData(msgParams.domain, msgParams.types, msgParams.message)
      // const sign712 = new Eip712Sign(this.priKeyBuff, msgParams)
      // const hashMsgBuff = sign712.signHash(msgParams)
      // const signature = sign712.sign(msgParams)

      const hashBuff = signTypedDataUtils.generateTypedDataHash(msgParams)
      const signatureStr = this.ecsign(hashBuff)

      callback(null, {
        id: 42,
        jsonrpc: '2.0',
        result: signatureStr
      })
    } else if (payload.method === 'eth_chainId') {
      console.log("eth_chainId",this.walletInfo.chainId)
      callback(null, { id: 42, jsonrpc: '2.0', result: this.walletInfo.chainId })
    } else {
      callback(null, { id: 42, jsonrpc: '2.0', result: [account] })
    }
  }

  // async send(transactionObject: Deferrable<TransactionRequest>, provider: Provider) {
  //   const signer = this.wallet.connect(provider)
  //   return signer.sendTransaction(transactionObject)
  // }

}

const fakeProvider = { isEIP1193: true } as any

export const providerUtils = {
  getSignerProvider(wallet: WalletPrikey): SupportedProvider {
    return new SingerProvider(wallet)
  },

  getFakeProvider(): SupportedProvider {
    return fakeProvider
  },

  /**
   * Starts the Web3ProviderEngine without excess block polling
   * @param providerEngine The Web3ProviderEngine
   */
  startProviderEngine(providerEngine: any): void {
    if (providerEngine.start === undefined) {
      throw new Error(`Invalid Web3ProviderEngine`)
    }
    // HACK: When calling start() Web3ProviderEngine starts a block polling service
    // this continuously pulls data from the network and can result in high data usage
    // for long running services. If used in a front end application this can cause
    // a high amount of load on a node (one request per user per block).
    providerEngine._ready.go()
    providerEngine._running = true
  },
  /**
   * Standardize the supported provider types into our internal provider interface
   * or throw if unsupported provider supplied.
   * @param supportedProvider Potentially supported provider instance
   * @return Provider that conforms of our internal provider interface
   */
  standardizeOrThrow(supportedProvider: SupportedProvider): ZeroExProvider {
    if (supportedProvider === undefined) {
      throw new Error(`supportedProvider cannot be 'undefined'`)
    }
    const provider = {
      isStandardizedProvider: true,
      isMetaMask: (supportedProvider as any).isMetaMask,
      isParity: (supportedProvider as any).isParity,
      stop: (supportedProvider as any).stop,
      enable: (supportedProvider as any).enable,
      sendAsync: _.noop.bind(_) // Will be replaced
    }
    if (provider.enable) {
      // Need to bind, metamask can lose reference to function without binding as of 7.7.0
      provider.enable.bind(supportedProvider)
    }
    // Case 1: We've already converted to our ZeroExProvider so noop.
    if ((supportedProvider as any).isStandardizedProvider) {
      // tslint:disable-next-line:no-unnecessary-type-assertion
      return supportedProvider as ZeroExProvider
      // Case 2: It's a compliant EIP 1193 Provider
      // tslint:disable-next-line:no-unnecessary-type-assertion
    } else if ((supportedProvider as EIP1193Provider).isEIP1193) {
      provider.sendAsync = (payload: JSONRPCRequestPayload, callback: JSONRPCErrorCallback) => {
        const method = payload.method
        const params = payload.params;
        (supportedProvider as any)
          .send(method, params)
          .then((result: any) => {
            callback(null, result)
          })
          .catch((err: Error) => {
            callback(err)
          })
      }
      return provider
      // Case 3: The provider has a `sendAsync` method, so we use it.
    } else if ((supportedProvider as any).sendAsync !== undefined) {
      provider.sendAsync = (supportedProvider as any).sendAsync.bind(supportedProvider)
      return provider
      // Case 4: The provider does not have a `sendAsync` method but does have a `send` method
    } else if ((supportedProvider as any).send !== undefined) {
      // HACK(fabio): Detect if the `send` method has the old interface `send(payload, cb)` such
      // as in versions < Web3.js@1.0.0-beta.37. If so, do a simple re-mapping
      if (_.includes((supportedProvider as any).send.toString().replace(' ', ''), 'function(payload,callback)')) {
        provider.sendAsync = (supportedProvider as any).send.bind(supportedProvider)
        return provider
      } else {
        // If doesn't have old interface, we assume it has new interface `send(method, payload)`
        // such as in versions > Web3.js@1.0.0-beta.38 and convert it to `sendAsync`
        provider.sendAsync = (payload: JSONRPCRequestPayload, callback: JSONRPCErrorCallback) => {
          const method = payload.method
          const params = payload.params;
          (supportedProvider as any)
            .send(method, params)
            .then((result: any) => {
              callback(null, result)
            })
            .catch((err: Error) => {
              callback(err)
            })
        }
        return provider
      }
    }
    throw new Error(
      `Unsupported provider found. Please make sure it conforms to one of the supported providers. See 'Provider' type in 'ethereum-types' package.`
    )
  },

  /**
   * Retrieve the chain ID from a supported provider.
   * @param supportedProvider A supported provider instance.
   * @return A promise that resolves to the chain ID of the network the provider
   * is connected to.
   */
  async getChainIdAsync(supportedProvider: SupportedProvider): Promise<number> {
    const provider = providerUtils.standardizeOrThrow(supportedProvider)
    // tslint:disable-next-line:custom-no-magic-numbers
    const RPC_ID_MAX = 2 ** 64
    return new Promise<number>((accept, reject) => {
      provider.sendAsync(
        {
          jsonrpc: '2.0',
          id: _.random(1, RPC_ID_MAX),
          method: 'eth_chainId',
          params: []
        },
        (err: Error | null, result?: JSONRPCResponsePayload) => {
          if (!_.isNil(err)) {
            reject(err)
          }
          if (!result) {
            throw new Error('Invalid \'eth_chainId\' response')
          }
          accept(_.toNumber(result.result))
        }
      )
    })
  }
}
