
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
contract ArithamaticOperations{
    function calculateTip(uint256 value) public pure returns (uint256 tip) {
        // Perform the division first to avoid overflow
        uint256 dividedValue = value / 10;

        // Multiply the divided value by 100 to get the tip amount
        // tip = dividedValue * 100;

        return dividedValue;
    }
    function multiply(uint8 x, uint256 y) public pure returns(uint256 z){
        require(y==0 || (z=x*y)/y ==x);
    }

    
}