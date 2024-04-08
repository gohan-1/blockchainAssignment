import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './env';

const App = () => {
  const [web3, setWeb3] = useState({});
  const [account, setAccount] = useState('');
  const [tokenSale, setTokenSale] = useState({});
  const [tokenPrice, setTokenPrice] = useState(1);
  const [tokensToBuy, setTokensToBuy] = useState(1);
  //const ganacheURL= 'HTTP://127.0.0.1:7545' 

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
  
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
  
        // Directly use CONTRACT_ABI and CONTRACT_ADDRESS imported from ./env
        const tokenSale = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        setTokenSale(tokenSale);
  
        const price = await tokenSale.methods.tokenPrice().call();
        setTokenPrice(web3.utils.fromWei(price, 'ether'));
      } else {
        window.alert('Ethereum browser not detected. Consider using MetaMask.');
      }
    };
  
    loadBlockchainData();
  }, []);
  
  

  const buyTokens = async (number) => {
    if (tokenSale) {
      try {
        const price = web3.utils.toWei((tokenPrice * number).toString(), 'ether');
        await tokenSale.methods.buyTokens(number).send({ from: account, value: price });
        window.location.reload(); // Simple way to refresh the user's balance (consider a more elegant solution)
      } catch (error) {
        console.error('Error buying tokens:', error);
      }
    }
  };

  return (
    <div>
      <h1>Token Sale</h1>
      <p>Buy Tokens</p>
      <input
        type="number"
        value={tokensToBuy}
        onChange={(e) => setTokensToBuy(e.target.value)}
        min="1"
      />
      <button onClick={() => buyTokens(tokensToBuy)}>Buy Tokens</button>
      <p>Token Price: {tokenPrice} ETH</p>
      <p>Your Account: {account}</p>
      <div className="text-xl font-medium text-black">Hello, world!</div>
    </div>
  );
};

export default App;


