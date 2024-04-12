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
        // assert.notEqual(finalBuyerBalance, initialBuyerBalance, "Buyer's balance did not increase after buying tokens");
        assert.notEqual(initialBuyerBalance,finalBuyerBalance,"balance are not equal")
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

    it("send Ether", async () => {
        const recipient = accounts[1];
        const tokenPriceInEther = 1; // Token price in Ether
        const tokenPriceInWei = web3.utils.toWei(tokenPriceInEther.toString(), "ether");
        const initialRecipientBalance = await web3.eth.getBalance(recipient);
        console.log(initialRecipientBalance);
        // Send Ether to the recipient
        await tokenSaleInstance.setTokenPrice(tokenPriceInWei); 
        await tokenSaleInstance.sendEther(recipient, { value: tokenPriceInWei });
    
        // Check if the recipient's balance increased by the amount sent
        const finalRecipientBalance = await web3.eth.getBalance(recipient);
        assert.equal(finalRecipientBalance.toString(), new web3.utils.BN(initialRecipientBalance).add(new web3.utils.BN(tokenPriceInWei)).toString(), "Ether was not sent correctly to the recipient");
    
        // Check if the tip was calculated correctly
        // const tip = await tokenSaleInstance.tip();
        // assert.equal(tip.toString(), 10000000000000000000, "Tip was not calculated correctly");
    
        // // Check if the valid token mapping was updated correctly
        // const validTokens = await tokenSaleInstance.validToken(recipient, accounts[0]);
        // assert.equal(validTokens, web3.utils.toBN(initialRecipientBalance).div(web3.utils.toBN(initialRecipientBalance)).toNumber(), "Valid token mapping was not updated correctly");
    });

    it("transfer tokens", async () => {
        const sender = accounts[1];
        const recipient = accounts[2];
        const middleMan = accounts[3]
        const numberOfTokens = 10;
    
        // Transfer tokens to the sender
        await tokenInstance.transfer(sender, numberOfTokens, { from: admin });
    
        // Approve transfer from sender to recipient
        await tokenInstance.approve(middleMan, numberOfTokens, { from: sender });
    
        // Perform token transfer from sender to recipient
        await tokenSaleInstance.transferToken(sender, recipient, { from: middleMan });
    
        // Check if the sender's balance decreased by the number of tokens transferred
        const finalSenderBalance = await tokenSaleInstance.balanceOf(sender);
        assert.equal(finalSenderBalance.toString(), 0, "Sender's balance did not decrease correctly");
    
        // Check if the recipient's balance increased by the number of tokens transferred
        const finalRecipientBalance = await tokenSaleInstance.balanceOf(recipient);
        assert.equal(finalRecipientBalance.toString(), numberOfTokens.toString(), "Recipient's balance did not increase correctly");
    
       
     
    });
    it("should add a new commissioner", async () => {
        // Call the addCommissioner function
        await tokenSaleInstance.addCommissioner(accounts[2], "Commissioner 1", { from: accounts[1] });

        // Get the added commissioner details
        const commissioner = await yourContractInstance.commissioners(accounts[1]);

        // Check if the commissioner details are correct
        assert.equal(commissioner.addr, accounts[2], "Commissioner address doesn't match");
        assert.equal(commissioner.status, 0, "Commissioner status is not RECEIVED");
        assert.equal(commissioner.commissionAmount, 0, "Commission amount is not 0");
    });

    it("should not allow adding an existing commissioner", async () => {
        // Attempt to add an existing commissioner
        try {
            await tokenSaleInstance.addCommissioner(accounts[2], "Commissioner 1", { from: accounts[1] });
            // If it succeeds, fail the test
            assert.fail("Should not allow adding an existing commissioner");
        } catch (error) {
            // Check if the error message is correct
            assert(
                error.message.includes("Commissioner already exists"),
                "Unexpected error message: " + error.message
            );
        }
    });
    


  
});
