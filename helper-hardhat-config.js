// This file is a trick used by aave to deal with multiple chains

const networkConfig = {
    31337: {
        name: "localhost",
    },
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    137: {
        name: "polygon",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    },
    // chain id: 31337 hardhat network??...
}

const developmentChains = ["hardhat", "localhost"]
//below is for testing. variables are from the MockV3Aggregator
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000

// below, module.exports is formatted like this instead of default so we can export multiple things
module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
}
