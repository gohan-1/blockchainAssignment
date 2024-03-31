var MyToken = artifacts.require("./MyToken");

contract('MyToken', (accounts)=>{
    it('sets the total supply upon deployment',async()=>{
        const token =await MyToken.deployed();
        const totalSupply =await token.totalSupply();
        assert.equal(totalSupply.toNumber(),1000000,'sets total supply to 1 million')
        // return MyToken.deployed().then((instance)=>{
        //     tokenInstance = instance;
        //     return tokenInstance.totalSupply();
   
    })
})