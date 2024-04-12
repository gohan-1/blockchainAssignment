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
        require(transfer(msg.sender,_numberOfToken));

        tokenSold+=_numberOfToken;
        emit Sell(msg.sender,_numberOfToken);
    }
} 