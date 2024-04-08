// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import './MyToken.sol';
contract TokenSale is MyToken{
    MyToken public tokenContract;
    //In wei
    uint256 public tokenPrice;
    uint256 public tokenSold;
    event Sell(address from, uint256 _amount);
    constructor(MyToken _tokenContract,uint256 _initialSupply) MyToken(_initialSupply) {
            tokenContract = _tokenContract;
    }   

    function setTokenPrice(uint256  _price) public onlyAdmin{
        tokenPrice = _price ;
    }
    function multiply(uint256 x, uint256 y) internal pure returns(uint256 z){
        require(y==0 || (z=x*y)/y ==x);
    }

    function buyTokens(uint256 _numberOfToken) public payable{
        require(msg.value == multiply(_numberOfToken,tokenPrice));
        require(balanceOf[admin] >= _numberOfToken,"failed due to insuffficient balance");
        require(adminTransfer(msg.sender,_numberOfToken));

        tokenSold+=_numberOfToken;
        emit Sell(msg.sender,_numberOfToken);
    }


    function EndSale() public payable{
        require(msg.sender == admin);
        // require(balanceOf[admin] >= _numberOfToken,"failed due to insuffficient balance");
        require(transfer(admin,tokenContract.balanceOf(address(this))));
        // selfdestruct(admin);
    }
    
    function sendEather(address payable _to) public payable{
        (bool sent ,bytes memory data) = _to.call{value:msg.value}("");
        require(sent,"Failed to send Eather");
    }




    function transferToken(address _from,address _to,uint256 _tokens) public payable{
        require(balanceOf[_from] >= _tokens);
        require(transferFrom(_from, _to, _tokens));

    }

    receive() external payable{}
    fallback() external payable{}

} 