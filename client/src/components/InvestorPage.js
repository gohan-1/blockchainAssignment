// InvestorPage.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MyToken from '../contracts/MyToken.json';
import TokenSale from '../contracts/TokenSale.json';


const InvestorPage = () => {
 const [account, setAccount] = useState('');
 const [tokenSale, setTokenSale] = useState(null);
 const [myToken, setMyToken] = useState(null);
 const [tokenPrice, setTokenPrice] = useState(0);
 const [tokensToBuy, setTokensToBuy] = useState(0);
 const [userTokens, setUserTokens] = useState(0);
 const [web3,setWeb3] = useState('')
 
 



 // Initialize web3 and the contracts
 useEffect(() => {
   const initWeb3 = async () => {
     if (window.ethereum) {
       window.web3 = new Web3(window.ethereum);
       await window.ethereum.enable();
     } else if (window.web3) {
       window.web3 = new Web3(window.web3.currentProvider);
     } else {
       console.log('Non-Ethereum browser');
       return;
     }


     const web3 = window.web3;
     setWeb3(web3)
     

     const accounts = await web3.eth.getAccounts();
     setAccount(accounts[0]);


     const networkId = await web3.eth.net.getId();
     const tokenSaleData = TokenSale.networks[networkId];
     const myTokenData = MyToken.networks[networkId];


     if (tokenSaleData && myTokenData) {
       const tokenSaleInstance = new web3.eth.Contract(TokenSale.abi, tokenSaleData.address);
       setTokenSale(tokenSaleInstance);


       const myTokenInstance = new web3.eth.Contract(MyToken.abi, myTokenData.address);
       setMyToken(myTokenInstance);


       const price = await tokenSaleInstance.methods.tokenPrice().call();
       setTokenPrice(price);


       const balance = await myTokenInstance.methods.balanceOf(accounts[0]).call();
       setUserTokens(balance);
     } else {
       window.alert('Contract not deployed to detected network.');
     }
   };


   initWeb3();
 }, []);


 const buyTokens = async (e) => {
   e.preventDefault();
    if (!tokenSale || !myToken) {
     console.error("Contracts are not initialized.");
     return;
   }
    console.log(`Attempting to buy tokens: ${tokensToBuy} with price per token: ${tokenPrice}`);
   
   try {
     const tokensToBuyBN = web3.utils.toBN(tokensToBuy);
     const totalPrice = web3.utils.toBN(tokenPrice).mul(tokensToBuyBN);
     console.log(`Token Price ${tokenPrice}`);
     
     await tokenSale.methods.buyTokens(tokensToBuyBN.toString()).send({
       from: account,
       value: totalPrice,
       gas: 500000
     });
      console.log("Tokens purchased successfully.");
   } catch (error) {
     console.error("Error buying tokens:", error);
   }
 };


 return (
   <div>
     <h1>Investor Dashboard</h1>
     <p>Account: {account}</p>
     <p>Token Price: {Web3.utils.fromWei(tokenPrice, 'ether')} ETH</p>
     <p>Your Tokens: {userTokens}</p>
     <form onSubmit={buyTokens}>
       <input
         type="number"
         value={tokensToBuy}
         onChange={(e) => setTokensToBuy(e.target.value)}
         placeholder="Tokens to buy"
       />
       <button type="submit">Buy Tokens </button>
     </form>
   </div>
 );
};


export default InvestorPage;

