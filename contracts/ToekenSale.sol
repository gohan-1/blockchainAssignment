// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import './MyToken.sol';
import './ArithmeticOperations.sol';


contract TokenSale is MyToken,ArithmeticOperations{
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
    mapping(address=>mapping (address=> uint256)) public validToken;
    event Sell(address from, uint256 _amount);
    mapping(address => Commissioner) public commissioners;
    event TransferFailed(address indexed recipient, uint8 numberOfTokens, string reason);

    bool private locked = false;
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



     function addCommissioner(address _addr, string memory _name) external {
        require(commissioners[_addr].addr == _addr, "Commissioner already exists");
        Commissioner storage newCommissioner = commissioners[_addr];
        newCommissioner.addr = _addr;
        newCommissioner.status = CommissionStatus.NOT_RECEIVED;
        emit CommissionerAdded(_addr, _name);
    }
   
    modifier checkBalance(uint balance,uint amount) {
        require(balance >= amount, "Insufficient balance");
        _;
    }
    function buyTokens(uint8 _numberOfTokens) public payable checkBalance(balanceOf[admin], _numberOfTokens) {
        uint256 totalPrice = multiply(_numberOfTokens, tokenPrice);
        require(msg.value == totalPrice, "Incorrect payment amount");

        bool transferSuccessful = adminTransfer(msg.sender, _numberOfTokens);
        if (!transferSuccessful) {
                // Refund the buyer if the transfer fails
                payable(msg.sender).transfer(msg.value);
                // Emit the failure event with a reason
                emit TransferFailed(msg.sender , _numberOfTokens, "Token transfer failed");
                return;
            }

            tokenSold += _numberOfTokens;
            emit Sell(msg.sender, _numberOfTokens);
    }

    function EndSale() public onlyAdmin {
        require(msg.sender == admin, "Only admin can end the sale");

        uint256 remainingTokens = tokenContract.balanceOf(address(this));
        require(remainingTokens > 0, "No remaining tokens to transfer");

        bool transferSuccessful = transfer(admin, remainingTokens);
        require(transferSuccessful, "Failed to transfer remaining tokens to admin");
    }

    // Modifier to prevent reentrancy attacks 
    modifier noReentrancy() {
        require(!locked, "No reentrancy allowed.");
        locked = true;
        _;
        locked = false;
    }
    
    function sendEther(address payable _to) public payable noReentrancy(){
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
     

    }

    receive() external payable{}
    fallback() external payable{}

} 