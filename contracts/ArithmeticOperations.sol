
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
contract ArithmeticOperations{
    function calculateTip(uint256 value) public pure returns (uint256 tip) {
       
        uint256 dividedValue = value / 10;

    

        return dividedValue;
    }

    function multiply(uint8 x, uint256 y) public pure returns(uint256 z){
        require(y==0 || (z=x*y)/y ==x);
    }

    
}