
// HomePage.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../env';

const HomePage = () => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [tokenSale, setTokenSale] = useState(null);
    const [tokenPrice, setTokenPrice] = useState('1');
    const [tokensToBuy, setTokensToBuy] = useState(1);
    
  
    useEffect(() => {
      const loadBlockchainData = async () => {
        const web3Instance = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');
        setWeb3(web3Instance);
  
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
  
        const tokenSaleInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        setTokenSale(tokenSaleInstance);
        console.log(tokenSaleInstance)
        const price = await tokenSaleInstance.methods.name().call();
        // setTokenPrice(web3Instance.utils.fromWei(price, 'ether'));
        console.log('price')
        console.log(price)
      };
  
      loadBlockchainData();
    }, []);
  
    const handleBuyTokens = async () => {
      const priceToPay = web3.utils.toWei((tokenPrice * tokensToBuy).toString(), 'ether');
      console.log(priceToPay)
  
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
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto mt-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold uppercase mb-1"> TOKEN  SALE</h1>
        <p className="text-gray-600">Introducing " Token". Token price in Ether.</p>
      </div>
      <div className="mb-6">
        <label htmlFor="tokenAmount" className="block text-gray-700 text-sm font-bold mb-2">Amount:</label>
        <input
          id="tokenAmount"
          type="number"
          value={tokensToBuy}
          onChange={e => setTokensToBuy(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="0"
        />
      </div>
      <div className="text-center">
        <button
          onClick={handleBuyTokens}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Buy Tokens
        </button>
      </div>
      <div className="mt-6">
        <p className="text-gray-600">/<span className="font-semibold">{tokenSale && tokenSale.tokensSold}</span> tokens sold</p>
        <p className="text-gray-600">Your Account: <span className="font-semibold">{account}</span></p>
      </div>
    </div>
  );
};
  
  export default HomePage;


