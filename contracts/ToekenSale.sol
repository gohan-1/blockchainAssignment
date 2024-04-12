// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import './MyToken.sol';
import './ArithamaticOperations.sol';


contract TokenSale is MyToken,ArithamaticOperations{
    // need to add aggrgation and composition
    // 1 more class needed 
    // Optimised for    Gas
    //polymorphic
    // static and dynmic  modiiers
    //use of structures and enums
    // Balance None Pre-balanceOf transfer Post-balanceOf Correct Result
   
    
    MyToken public tokenContract;
    //In wei
    uint256 public tokenPrice;
    uint8 public tokenSold;
    // uint256 public tip;
    mapping(address=>mapping (address=> uint256)) public validToken;
    event Sell(address from, uint256 _amount);
    mapping(address => Commissioner) public commissioners;

    enum CommissionStatus { RECEIVED ,NOT_RECEIVED }
    event CommissionerAdded(address indexed addr, string name);

    
    struct Commissioner {
        address addr;
        CommissionStatus status;
        uint256 commissionAmount;
    }
    constructor(MyToken _tokenContract,uint256 _initialSupply) MyToken(_initialSupply) {
            tokenContract = _tokenContract;
    } 


    function setTokenPrice(uint256  _price) public onlyAdmin{
        tokenPrice = _price ;
    }
    /*
    Normal multiplication is typically done using the * operator in Solidity. The provided function is not replacing normal multiplication; rather, it's a wrapper around the multiplication operation with additional safety checks.

    The reason for including such a function with checks is to ensure that the multiplication operation doesn't result in overflow, which can lead to unexpected behavior or vulnerabilities in smart contracts.

    Here's why such checks might be necessary:

    Overflow Protection: In Solidity, overflow and underflow are not automatically handled. If the result of a multiplication operation exceeds the maximum representable value for the data type (uint256 in this case), it will wrap around and produce unexpected results. By including the additional checks in the provided function, developers can prevent such overflow conditions.

    Security: Smart contracts often deal with large numbers and financial transactions. Integer overflow can lead to vulnerabilities, allowing attackers to manipulate the contract state or drain funds. By enforcing checks to ensure that multiplication doesn't result in overflow, developers can reduce the attack surface and make contracts more secure.

    Robustness: Including these checks improves the robustness of the contract by preventing unexpected behavior due to arithmetic errors. It helps ensure that the contract behaves predictably under all circumstances, reducing the likelihood of bugs and vulnerabilities.
    */
    // function multiply(uint8 x, uint256 y) internal pure returns(uint256 z){
    //     require(y==0 || (z=x*y)/y ==x);
    // }


     function addCommissioner(address _addr, string memory _name) external {
        require(commissioners[_addr].addr == _addr, "Commissioner already exists");
        Commissioner storage newCommissioner = commissioners[_addr];
        newCommissioner.addr = _addr;
        newCommissioner.status = CommissionStatus.NOT_RECEIVED;
        emit CommissionerAdded(_addr, _name);
    }
    function buyTokens(uint8 _numberOfToken) public payable{
        //While this can prevent incorrect payments, any miscalculations or vulnerabilities in the multiply function could lead to incorrect assertions.
        uint256 totalPrice = multiply(_numberOfToken, tokenPrice);
        require(msg.value == totalPrice, "Incorrect payment amount");

        require(balanceOf[admin] >= _numberOfToken, "Insufficient balance");

        require(adminTransfer(msg.sender, _numberOfToken), "Token transfer failed");

        tokenSold+=_numberOfToken;
        emit Sell(msg.sender,_numberOfToken);
    }


    function EndSale() public payable onlyAdmin(){
        require(msg.sender == admin);
        // require(balanceOf[admin] >= _numberOfToken,"failed due to insuffficient balance");
        require(transfer(admin,tokenContract.balanceOf(address(this))));
         revert("Failed to transfer remaining tokens to admin");
    }
    
    function sendEther(address payable _to) public payable{
        // call function is used
        (bool sent ,bytes memory data) = _to.call{value:msg.value}("");
        require(sent,"Failed to send Ether");
        assert(msg.value>0);
        uint256 _tip = calculateTip(msg.value);
        Commissioner memory _commissioner =commissioners[_to] ;
        _commissioner.commissionAmount +=_tip; 
        require(_tip <= msg.value, "Tip exceeds message value");
        uint256 _value =msg.value - _tip;
        require(tokenPrice != 0, "Token price cannot be zero");

        validToken[_to][msg.sender] = uint256((_value)/tokenPrice);
    }




    function transferToken(address _from,address _to) public payable{
        require(balanceOf[_from] >= validToken[msg.sender][_to]);
        assert(transferFrom(_from, _to, validToken[msg.sender][_to]));
        // emit Transfer(_from, _to, validToken[msg.sender][_to]);
        revert("Failed to transfer tokens");


    }

    receive() external payable{}
    fallback() external payable{}

} 