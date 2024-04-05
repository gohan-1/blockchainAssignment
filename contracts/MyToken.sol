// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract MyToken{
    // constructor
    string public name = "My Token";
    string public symbol ="VIS";
    string public standard="MyToken version 0.1";
    uint256 public totalSupply;
    mapping(address=>mapping(address=>uint256))public allowance;
    mapping(address=>uint256) public balanceOf;
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);


    event Transfer(address _from, address _to,uint256 _value);
    constructor(uint256 _initalSppply){
        balanceOf[msg.sender]=  _initalSppply;
        totalSupply = _initalSppply;
    }

    function transfer(address _to, uint256  _value) public returns (bool success){
       require(balanceOf[msg.sender] >= _value); 
       balanceOf[msg.sender] -= _value;
       balanceOf[_to] += _value;
       emit Transfer(msg.sender, _to, _value);
       return true;
    }  

    function approve(address _spender, uint256 _value) public returns (bool success){
            //alwance function
            allowance[msg.sender][_spender]=_value;

            emit Approval(msg.sender,_spender,_value);

            return true;
        


     }
     function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
            require(_value<=balanceOf[_from],"failed");
            require(_value<=allowance[_from][msg.sender]);
            balanceOf[_from] -=_value;
            balanceOf[_to]+=_value;
            allowance[_from][msg.sender]-=_value;
            emit Transfer(_from,_to,_value);
            return true;
    }
}