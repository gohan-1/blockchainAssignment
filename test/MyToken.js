var MyToken = artifacts.require("./MyToken");

contract('MyToken', (accounts)=>{
    it('sets the total supply upon deployment',async()=>{
        const token =await MyToken.deployed();
        const totalSupply =await token.totalSupply();
        assert.equal(totalSupply.toNumber(),1000000,'sets total supply to 1 millions')
     
    })

    it('balance of',async()=>{
        const token =await MyToken.deployed();
        const adminBalance =await token.balanceOf(accounts[0]);
        assert.equal(adminBalance.toNumber(),1000000,'balance of admin')
        // return MyToken.deployed().then((instance)=>{
        //     tokenInstance = instance;
        //     return tokenInstance.totalSupply();
   
    })
    it('initialize token',async()=>{
        const token =await MyToken.deployed();
        const tokenName =await token.name();
        const tokenSymbol = await token.symbol();
        const standard = await token.standard()

        assert.equal(tokenName,'My Token','Name of token')
        assert.equal(tokenSymbol,'VIS','symbol of token')
        assert.equal(standard,'MyToken version 0.1','standard of token')
     
   
    })

    it('Transfer token ownership',async()=>{
        // const token =await MyToken.deployed();
        const contractInstance = await MyToken.deployed();

        // Initial balances
        const sender = accounts[0];
        const receiver = accounts[1];
        const initialSenderBalance = await contractInstance.balanceOf(sender);
        const initialReceiverBalance = await contractInstance.balanceOf(receiver);

        // Amount to transfer
        const amount = 100; // assuming 100 tokens

        // Transfer tokens
        const transferInstance = await contractInstance.transfer(receiver, amount, { from: sender });
        assert.equal(transferInstance.logs.length,1,'triggers on event')
        assert.equal(transferInstance.logs[0].event,"Transfer",'should be Transfer event')
        // console.log(transferInstance)
        // assert.equal(transferInstance,'True','return True')
        // Updated balances
        const updatedSenderBalance = await contractInstance.balanceOf(sender);
        const updatedReceiverBalance = await contractInstance.balanceOf(receiver);

        // Check if balances are updated correctly
        assert.equal(updatedSenderBalance.toNumber(), initialSenderBalance.toNumber() - amount, "Sender balance should decrease by amount");
        assert.equal(updatedReceiverBalance.toNumber(), initialReceiverBalance.toNumber() + amount, "Receiver balance should increase by amount");

        const transferSuccess = await contractInstance.transfer.call(receiver, amount, { from: sender });
    
        // Check if transfer was successful
        assert.isTrue(transferSuccess, 'Transfer should be successful');
        // return MyToken.deployed().then((instance)=>{
        //     tokenInstance = instance;
        //     return tokenInstance.totalSupply();
   
    })

    it('approve tokens for delegated transfer',async ()=>{
        const sender = accounts[0];
        const receiver = accounts[1];
        const contractInstance = await MyToken.deployed();
        const approve = await contractInstance.approve.call(receiver,100)
        const approve1 = await contractInstance.approve(receiver,100)
        const allowance = await contractInstance.allowance(sender,receiver)

        assert.equal(allowance.toNumber(),100,"Allowance returned 100")

        assert.equal(approve, true , 'it returns  true')

    })

    it("transferFrom ",async ()=>{
        const from = accounts[2];
        const to = accounts[3];
        const spender = accounts[4]; // Corrected variable name from spend to spender
        const contractInstance = await MyToken.deployed();
    
        // Transfer tokens from account[0] to 'from' account
        const transferInstance = await contractInstance.transfer(from, 100, { from: accounts[0] });
    
        // Approve spender to spend tokens from 'from' account
        const approve1 = await contractInstance.approve(spender, 100, { from: from });
    
        // Attempt transferFrom from 'from' account to 'to' account using spender
        const atransferFrom = await contractInstance.transferFrom.call(from, to, 25, { from: spender });
    
        assert.equal(atransferFrom, true);

        // assert.equal(symbol,"blaha")

    })

})