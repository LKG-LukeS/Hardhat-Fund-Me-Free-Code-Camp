//import
//main function
//calling of main function
//above, dont need to do bottom 2 with hardhat-deploy because it will call a function we specify in the script

//below, we are going to export the function as the default function for our hardhat-deploy to look for

// function deployFunc() {
//     console.log("hi")
// }

// module.exports.default = deployFunc

//above is not the best way to do it, but it works fine
//below is the best way to do it
const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
//above is a simpler version of below:
// const helperConfig = require("../helper-hardhat-config")
// const networkConfig = helperConfig.networkConfig
const { verify } = require("../utils/verify")
//above, this is our verify function from our verify.js file
require("dotenv").config()
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre
//     //above line is the same as the 2 lines below
//     //hre.getNamedAccounts
//     //hre.deployments
// }
//above is the more complex version of doing this one line below:
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    //above is grabbing the "deployer" account from our namedAccounts in the hardhat.config.js
    //configure the above in hardhat.config.js
    //instead of adding the private keys (accounts) to the network section, you can name them and make it easier in hardhat.config.js
    const chainId = network.config.chainId

    //if chainId is X use address Y
    //if chainId is Z use address A
    //aave is good for this
    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        //Below, this line gets the latest mock deployment "if" it exists
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    //if the contract doesn't exist, we deploy a minimal version of it for our local testing (mocks (new folder "00-deploy-mocks"))
    const args = [ethUsdPriceFeedAddress]
    //below is to make inputing args easier
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // put price feed address here
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    //below, we're doing this for when we deploy on a testnet/mainnet. not development chains
    //below, then we're going to verify it, given that it isn't on our development chains.
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        //below, since this is the verify function and it takes a contract address and args, we pass it in here when it's called
        //below, we made args easier in our code, we took its declaration out of the fundMe object and declared it outside, now using it in the fundMe object and in the function call below by just typing args. Easy peasy.
        await verify(fundMe.address, args)
    }
    log(ETHERSCAN_API_KEY)
    log("-----------------------------------------------------------------")
}
module.exports.tags = ["all", "fundme"]
