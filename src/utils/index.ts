export {addressUtils} from './src/address_utils'
export {intervalUtils} from './src/interval_utils'
export {providerUtils} from './src/provider_utils'
export {BigNumber} from './src/configured_bignumber'
export {AbiDecoder} from './src/abi/abi_decoder'
export {abiUtils} from './src/abi/abi_utils'
// export { NULL_BYTES, NULL_ADDRESS } from './src/constants'
// export {constants as AbiEncoderConstants} from './src/abi/abi_encoder/utils/constants'

export {signTypedDataUtils} from './src/sign_typed_data_utils'
export {hexUtils} from './src/hex_utils'
import * as AbiEncoder from './src/abi/abi_encoder'

export {AbiEncoder}
// export type { EncodingRules, DecodingRules } from './src/abi/abi_encoder';
export type {EncodingRules, DecodingRules} from './src/abi/abi_encoder/utils/rules'
export * from './src/types'
export {generatePseudoRandom256BitNumber} from './src/random'
export {
    decodeBytesAsRevertError,
    decodeThrownErrorAsRevertError,
    coerceThrownErrorAsRevertError,
    RawRevertError,
    registerRevertErrorType,
    RevertError,
    StringRevertError,
    AnyRevertError
} from './src/revert_errors/revert_error'
export {fromTokenUnitAmount, toTokenUnitAmount} from './src/token_utils'

export import BrokerRevertErrors = require('./src/revert_errors/broker/revert_errors')
export import CoordinatorRevertErrors = require('./src/revert_errors/coordinator/revert_errors')
export import ExchangeForwarderRevertErrors = require('./src/revert_errors/exchange-forwarder/revert_errors')
export import LibMathRevertErrors = require('./src/revert_errors/exchange-libs/lib_math_revert_errors')
export import ExchangeRevertErrors = require('./src/revert_errors/exchange/revert_errors')
export import LibAssetDataTransferRevertErrors = require('./src/revert_errors/extensions/lib_asset_data_transfer_revert_errors')
export import MixinWethUtilsRevertErrors = require('./src/revert_errors/extensions/mixin_weth_utils_revert_errors')
export import FixedMathRevertErrors = require('./src/revert_errors/staking/fixed_math_revert_errors')
export import StakingRevertErrors = require('./src/revert_errors/staking/staking_revert_errors')
export import AuthorizableRevertErrors = require('./src/revert_errors/utils/authorizable_revert_errors')
export import LibAddressArrayRevertErrors = require('./src/revert_errors/utils/lib_address_array_revert_errors')
export import LibBytesRevertErrors = require('./src/revert_errors/utils/lib_bytes_revert_errors')
export import OwnableRevertErrors = require('./src/revert_errors/utils/ownable_revert_errors')
export import ReentrancyGuardRevertErrors = require('./src/revert_errors/utils/reentrancy_guard_revert_errors')
export import SafeMathRevertErrors = require('./src/revert_errors/utils/safe_math_revert_errors')

export const ZeroExRevertErrors = {
    Common: require('./src/revert_errors/zero-ex/common_revert_errors'),
    Proxy: require('./src/revert_errors/zero-ex/proxy_revert_errors'),
    SimpleFunctionRegistry: require('./src/revert_errors/zero-ex/simple_function_registry_revert_errors'),
    Ownable: require('./src/revert_errors/zero-ex/ownable_revert_errors'),
    Spender: require('./src/revert_errors/zero-ex/spender_revert_errors'),
    TransformERC20: require('./src/revert_errors/zero-ex/transform_erc20_revert_errors'),
    Wallet: require('./src/revert_errors/zero-ex/wallet_revert_errors'),
    MetaTransactions: require('./src/revert_errors/zero-ex/meta_transaction_revert_errors'),
    SignatureValidator: require('./src/revert_errors/zero-ex/signature_validator_revert_errors'),
    LiquidityProvider: require('./src/revert_errors/zero-ex/liquidity_provider_revert_errors')
}

export {
    createExchangeProxyEIP712Domain,
    EIP712_DOMAIN_PARAMETERS,
    getExchangeProxyEIP712Hash,
    getExchangeProxyEIP712DomainHash,
    getTypeHash,
} from './eip712_utils';
export {
    eip712SignHashWithKey,
    eip712SignTypedDataWithProviderAsync,
    ethSignHashWithKey,
    ethSignHashWithProviderAsync,
    SignatureType,
} from './signature_utils';

export type {Signature} from './signature_utils'
