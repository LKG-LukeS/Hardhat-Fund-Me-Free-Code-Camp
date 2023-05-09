const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendValue = ethers.utils.parseEther("1") // 1 ETH
          beforeEach(async function () {
              //deploy our fundMe contract
              //using hardhat deploy
              //another way of doing what we did below and getting different accounts directly from hardhat.config is below
              // const accounts = await ethers.getSigners()
              // const accountZero = accounts[0]
              //below, we can tell ethers which account we want connected to fundMe
              // const { deployer } = await getNamedAccounts()
              deployer = (await getNamedAccounts()).deployer
              //below, fixture lets us run our entire deploy folder with as many tags as we want
              //below, just in this one line, we can deploy everything in our deploy folder
              await deployments.fixture(["all"])
              //below, hardhat deploy wraps ethers with the function getContract() which gets the most recent deployment of whatever we specify
              //below, this is how we connect deployer to our fundMe account after declaring it above...-
              //-... now whenever we call fundMe it will automatically be from that deployer account
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", async function () {
              it("sets the aggregator addresses correctly", async function () {
                  //below, we're getting the priceFeed variable from the FundMe.sol contract
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("fund", async function () {
              it("fails if you don't send enough ETH", async function () {
                  //below, we didn't pass anything into the fund() so we're funding with nothing which we expect to fail
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })
              it("updated the amount funded data structure", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Adds funder to array of funders", async function () {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(funder, deployer)
              })
          })
          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })
              it("withdraw ETH from a single founder", async function () {
                  //arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  //below, we found these variables inside the debug console! pretty cool!!! U can find stuff yourself :)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  //below, this is a BigNumber function. .mul multiplies big numbers (just like gasUsed * effectiveGasPrice)
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  //below, could've used ethers.provider instead of fundMe.provider   We just  need the getBalance function
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      endingDeployerBalance.add(gasCost).toString(),
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString()
                  )
              })
              it("allows us to withdraw with multiple funders", async function () {
                  //arrange
                  const accounts = await ethers.getSigners()
                  //below, we need to create new objects to connect to all the different accounts so it isn't the deployer
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  //act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  //below, we found these variables inside the debug console! pretty cool!!! U can find stuff yourself :)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  //below, this is a BigNumber function. .mul multiplies big numbers (just like gasUsed * effectiveGasPrice)
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  //assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      endingDeployerBalance.add(gasCost).toString(),
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString()
                  )

                  // make sure funders are reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted
                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("only allows the owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[1]
                  )
                  await expect(fundMeConnectedContract.withdraw()).to.be
                      .reverted
              })
          })
      })
