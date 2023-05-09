require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("@nomiclabs/hardhat-etherscan")
require("@nomicfoundation/hardhat-chai-matchers")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("dotenv")

/** @type import('hardhat/config').HardhatUserConfig */

const GOERLI_RPC_URL =
    process.env.GOERLI_RPC_URL ||
    "https://eth-goerli.g.alchemy.com/v2/sGkCMgQLpZUCcpULB_z8dRinV7UD50wt"
const PRIVATE_KEY = process.env.PRIVATE_KEY
const COINMARKETCAP_API_KEY =
    process.env.COINMARKETCAP_API_KEY ||
    "0x503ac82e-b2e7-4699-9c82-5780bf02d8d8"
const ETHERSCAN_API_KEY =
    process.env.ETHERSCAN_API_KEY || "Y9N3CXWGF64ISF5R8NYI54JVFDGDGZECAF"

// module.exports = {
//     defaultNetwork: "hardhat",
//     networks: {
//         hardhat: {
//             chainId: 31337,
//             // gasPrice: 130000000000,
//         },
//         goerli: {
//             url: GOERLI_RPC_URL,
//             accounts: [PRIVATE_KEY],
//             chainId: 5,
//             blockConfirmations: 6,
//         },
//     },
//     solidity: {
//         compilers: [
//             {
//                 version: "0.8.8",
//             },
//             {
//                 version: "0.6.6",
//             },
//         ],
//     },
//     etherscan: {
//         apiKey: {
//             goerli: process.env.ETHERSCAN_API_KEY,
//         },
//         // customChains: [], // uncomment this line if you are getting a TypeError: customChains is not iterable
//     },
//     namedAccounts: {
//         deployer: {
//             default: 0, // here this will by default take the first account as deployer
//             1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
//         },
//     },
//     mocha: {
//         timeout: 500000,
//     },
// }

module.exports = {
    //solidity: "0.8.17",
    // below, we enable MULLLTIPLLE versions of solidity! :D

    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: PRIVATE_KEY,
            chainId: 5,
            blockConfirmations: 6,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },

    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "MATIC",
    },
}
