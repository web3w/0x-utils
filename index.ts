// let img = 'module-alias/register';
// require(`${img}`)

// import * from 'module-alias/register';

// import moduleAlias from 'module-alias'
// //
// moduleAlias.addAlias('@0x/types', __dirname + '/src/types/types')
// moduleAlias.addAlias('@0x/assert', __dirname + '/src/assert/index')
// moduleAlias.addAlias('@0x/utils', __dirname + '/src/utils/index')
// //
// // moduleAlias(__dirname + '/package.json')
// moduleAlias()

// "_moduleAliases": {
//     "@0x/types": "./src/types/types",
//         "@0x/assert": "./src/assert/index",
//         "@0x/utils": "./src/utils/index"
// }

const typesPath = './src/types';
export {
    NULL_ADDRESS,
    BigNumber, ethers, SignatureType,
    OrderStatus, MarketOperation, AssetProxyId
} from './src/types';
export type {
    DealOrder,
    BaseOrder,
    SignedOrder,
    Order,
    OrderState,
    ExcludeBaseOrder
} from './src/types';
export type {
    EIP712DomainWithDefaultSchema,
    EIP712Object,
    EIP712ObjectValue,
    EIP712TypedData,
    EIP712Types,
    EIP712Parameter
} from './src/types';

export type {
    AssetData,
    ERC20AssetData,
    AssetDataAndType,
    ERC721AssetData,
    ERC1155AssetData,
    ERC20BridgeAssetData,
    StaticCallAssetData,
    SingleAssetData,
    MultiAssetData,
    MultiAssetDataWithRecursiveDecoding,
    AssetProxyKey
} from './src/types';

export type {
    WalletInfo,
    WalletPrikey,
    ECSignature,
    ValidatorSignature,
    SignedExchangeProxyMetaTransaction,
    ExchangeProxyMetaTransaction,
    SignedZeroExTransaction,
    ZeroExTransaction,
    ObjectMap,
} from './src/types'

export {assert, schemas} from './src/assert'

export {
    RevertError,
    ExchangeRevertErrors, decodeBytesAsRevertError
} from './src/utils'

export {
    AbiEncoder,
    hexUtils,
    signTypedDataUtils,
    providerUtils,
    abiUtils,
    generatePseudoRandom256BitNumber
} from './src/utils';

export type {DecodingRules} from './src/utils';

export {Web3Wrapper} from './src/web3_wrapper'


