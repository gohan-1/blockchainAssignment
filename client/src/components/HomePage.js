
// HomePage.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../env';

const HomePage = () => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [tokenSale, setTokenSale] = useState(null);
    const [tokenPrice, setTokenPrice] = useState('');
    const [tokensToBuy, setTokensToBuy] = useState(1);
    
  
    useEffect(() => {
      const loadBlockchainData = async () => {
        const web3Instance = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');
        setWeb3(web3Instance);
  
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
  
        const tokenSaleInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        setTokenSale(tokenSaleInstance);
  
        const price = await tokenSaleInstance.methods.tokenPrice().call();
        setTokenPrice(web3Instance.utils.fromWei(price, 'ether'));
      };
  
      loadBlockchainData();
    }, []);
  
    const handleBuyTokens = async () => {
      const priceToPay = web3.utils.toWei((tokenPrice * tokensToBuy).toString(), 'ether');
  
      try {
        const transactionReceipt = await tokenSale.methods.buyTokens(tokensToBuy.toString()).send({
          from: account,
          value: priceToPay
        });
        console.log(`Successfully purchased ${tokensToBuy} tokens!`, transactionReceipt);
      } catch (error) {
        console.error('Error buying tokens:', error);
        alert('There was an error purchasing tokens.');
      }
    };
  
  
  
    return (
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex flex-col space-y-4">
        <h2 className="font-bold text-xl">Buy Tokens</h2>
        <input
          type="number"
          value={tokensToBuy}
          onChange={e => setTokensToBuy(e.target.value)}
          className="input input-bordered w-full max-w-xs"
          placeholder="Tokens to Buy"
        />
        <button onClick={handleBuyTokens} className="btn btn-primary bg-blue">Buy Tokens</button>
  
        
      </div>
    );
  };
  
  export default HomePage;


