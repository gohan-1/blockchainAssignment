import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MyToken from '../contracts/MyToken.json';
import TokenSale from '../contracts/TokenSale.json';





const CommissionerPage = () => {
    const [account, setAccount] = useState('');
    const [fromAddress, setFromAddress] = useState(''); // Added state for fromAddress
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [web3, setWeb3] = useState(null);
    const [myToken, setMyToken] = useState(null);
  
    
    useEffect(() => {
        const loadBlockchainData = async () => {
          try {
            if (window.ethereum) {
              window.web3 = new Web3(window.ethereum);
              await window.ethereum.enable();
            } else if (window.web3) {
              window.web3 = new Web3(window.web3.currentProvider);
            } else {
              console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
    
            const web3 = window.web3;
            console.log(web3)
            console.log("-------")
            setWeb3(web3)
            const accounts = await web3.eth.getAccounts();
            console.log(accounts)
            setAccount(accounts[0])
            const networkId = await web3.eth.net.getId();
            const networkDataMyToken = MyToken.networks[networkId];
            const networkDataSale = TokenSale.networks[networkId];
    
            if (networkDataMyToken && networkDataSale) {
              const myToken = new web3.eth.Contract(MyToken.abi, networkDataMyToken.address);
              setMyToken(myToken);
              
              
              const address = await web3.eth.getCoinbase();
              console.log(networkDataMyToken.address)
              setAccount(address);
    
              console.log(myToken)
              
    
            //   const tokenPrice = await tokenSale.methods.tokenPrice().call()
            //   setTokenPrices(tokenPrice)
              
    
              
    
            //   console.log(balanceOfADmin)
            }
          } catch (error) {
            console.error('Error loading blockchain data:', error);
          }
        };
        loadBlockchainData();
    }, []);

    
    
    


    
        
        
    const handleTransferFrom = async (event) => {
            event.preventDefault();
            console.log('Contract instance at time of transfer:', myToken);
            if (!web3 || !myToken) {
                setMessage('Web3 or token contract not loaded');
                return;
            }

            console.log(myToken)
            
            try {
                const amountInWei = web3.utils.toWei(amount, 'ether');
                console.log(amountInWei);
                console.log("-----")
                await myToken.methods.transferFrom(fromAddress, toAddress, amountInWei).send({ from: account });
                setMessage(`Successfully transferred ${amount} tokens from ${fromAddress} to ${toAddress}`);
            } catch (error) {
                console.error('Transfer error:', error);
                setMessage('Error transferring');
            }
    
            setFromAddress('');
            setToAddress('');
            setAmount('');
        };
    
        return (
          <div className="max-w-lg mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6">Token Dashboard</h1>
            <p className="text-gray-800 text-sm mb-4">Connected Account: {account}</p>
            <form onSubmit={handleTransferFrom} className="space-y-4">
              <div>
                <label htmlFor="fromAddress" className="text-gray-700">From Address:</label>
                <input
                  id="fromAddress"
                  type="text"
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="toAddress" className="text-gray-700">To Address:</label>
                <input
                  id="toAddress"
                  type="text"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="amount" className="text-gray-700">Amount:</label>
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              >
                Transfer Tokens
              </button>
            </form>
        
            {message && <p className="text-center text-gray-600 mt-4">{message}</p>}
          </div>
        );
        
}
    
export default CommissionerPage;






