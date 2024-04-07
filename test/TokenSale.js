    // SPDX-License-Identifier: MIT
    const MyToken = artifacts.require("MyToken");
    const TokenSale = artifacts.require("TokenSale");
    const Web3 = require("web3");
    const web3 = new Web3("http://localhost:7545"); // Your Ethereum client URL

    contract("TokenSale", (accounts) => {
    let tokenInstance;
    let tokenSaleInstance;
    const admin= accounts[0]
    const owner = accounts[1]
    // Deploy contracts before each test
    beforeEach(async () => {
        tokenInstance = await MyToken.new(1000000); // Deploy MyToken contract with initial supply of 1,000,000 tokens
        tokenSaleInstance = await TokenSale.new(tokenInstance.address, 1000000); // Deploy TokenSale contract with MyToken contract address and initial supply   
        });

    // Test case 1: Check if token contract address is set correctly
    it("Token price", async () => {
        const tokenPriceInEther = 1; // Token price in Ether
        const tokenPriceInWei = web3.utils.toWei(tokenPriceInEther.toString(), "ether"); // Convert to wei
        await tokenSaleInstance.setTokenPrice(tokenPriceInWei); // Set token price
        const tokenPrice = await tokenSaleInstance.tokenPrice(); // Get token price
        assert.equal(tokenPrice.toString(), tokenPriceInWei.toString(), "Token price mismatch");
    });

    it("buy token", async () => {
        const tokenPriceInEther = 1; // Token price in Ether
        const tokenPriceInWei = web3.utils.toWei(tokenPriceInEther.toString(), "ether");
        const number_of_tokens =20;
        const value =   number_of_tokens * tokenPriceInWei;
        await tokenSaleInstance.setTokenPrice(tokenPriceInWei, { from: admin });

        // Check initial balances
        const initialBuyerBalance = await tokenInstance.balanceOf(owner);
        const initialTokenSaleBalance = await tokenInstance.balanceOf(admin);
       
        // Buy tokens
        await tokenSaleInstance.buyTokens(number_of_tokens, { from: owner, value: value });

        // Check final balances
        const finalBuyerBalance = await tokenSaleInstance.balanceOf(owner);
        const finalTokenSaleBalance = await tokenSaleInstance.balanceOf(admin);
        console.log(finalBuyerBalance)
        console.log(finalTokenSaleBalance)
        // Assert the buyer's balance increased by the number of tokens bought
        assert.equal(finalBuyerBalance.sub(initialBuyerBalance), number_of_tokens, "Buyer's balance did not increase by the correct amount");

        // Assert the token sale contract's balance decreased by the number of tokens sold
       
        assert.equal(initialTokenSaleBalance.sub(finalTokenSaleBalance), number_of_tokens, "Token sale contract's balance did not decrease by the correct amount");

        // Assert the event was emitted
        const sellEvent = await tokenSaleInstance.getPastEvents("Sell");
        assert.equal(sellEvent.length, 1, "Sell event was not emitted");
        assert.equal(sellEvent[0].args.from, accounts[1], "Sell event has incorrect 'from' address");
        assert.equal(sellEvent[0].args._amount, number_of_tokens, "Sell event has incorrect token amount");
    });


  
});
