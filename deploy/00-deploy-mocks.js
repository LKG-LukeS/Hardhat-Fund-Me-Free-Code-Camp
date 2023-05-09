const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    //above is grabbing the "deployer" account from our namedAccounts in the hardhat.config.js
    //configure the above in hardhat.config.js
    //instead of adding the private keys (accounts) to the network section, you can name them and make it easier in hardhat.config.js

    //below, this is checking to see if the network we are deploying on is one of our "developmentChains" defined in the helper-hardhat-config.js file
    //below, we use network.name because our helper hardhat config is using names not chain ID ----- MATCH DATA TYPES!!!
    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
            //above, args are the constructor parameters from the MockV3Aggregator which can be found in node_modules
            //above, it can also be found at docs.chain.link
            //above, these args correspond to the constructor objects (DECIMALS first, INITIAL_ANSWER second)
        })
        log("Mocks deployed!")
        log("----------------------------------------------------------------")
        //above, this line is to mark the end of the deploy  script in the console
    }
}

//below, this allows us to run only this deploy-mocks script
module.exports.tags = ["all", "mocks"]
