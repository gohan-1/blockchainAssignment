// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;
import './IERC20.sol';
contract MyToken is IERC20 {
    // initalize toke properties
    string constant public name = "My Token";
    string constant public symbol = "VIS";
    string public standard = "MyToken version 0.1";
    uint256 public totalSupply;
    address[] public owners;
    mapping(address => uint256) holds; 
    address public admin;

    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => uint256)  public balanceOf;

   

    constructor(uint256  _initialSupply) {
         admin = msg.sender;
        balanceOf[admin] = _initialSupply;
        totalSupply = _initialSupply;
        owners=[admin];
       
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Admin can only do this operation");
        _;
    }
    modifier ownerAccess(){
        assert(msg.sender != admin);
        _;
    }

       function transfer(address _to, uint256 _value) public override  returns (bool success) {
        require(balanceOf[msg.sender] >= _value,"insufficient balancesss"); 
        balanceOf[msg.sender] =balanceOf[admin] - _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        holds[_to]+= _value;
        return true;
    }

    function adminTransfer(address _to, uint256 _value) public  virtual returns (bool success) {
        require(balanceOf[admin] >= _value,"insufficient balancesss"); 
        balanceOf[admin] =balanceOf[admin] - _value;
        balanceOf[_to] += _value;
        emit Transfer(admin, _to, _value);
        holds[_to]+= _value;
        return true;
    }  

    function approve(address _spender, uint256 _value) public override returns (bool success){
        // Allowance function
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public override returns (bool success) {
        require(_value <= balanceOf[_from], "Insufficient balance");
        require(_value <= allowance[_from][msg.sender], "Allowance exceeded");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        holds[_to]+= _value;
        emit Transfer(_from, _to, _value);
        owners.push(_to);
        return true;
    }
}