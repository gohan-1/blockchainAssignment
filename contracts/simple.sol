// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;



contract simple {
    uint public x;
    event Message(string action, uint value);

    function incrementX() public {
        x++;
        emit Message("increment", x);
    }

    function decrementX() public {
        require(x > 0, "Cannot decrement below zero");
        x--;
        emit Message("decrement", x);
    }
}
