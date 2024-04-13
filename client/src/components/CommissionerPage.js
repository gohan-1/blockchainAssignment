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
    const [tokenSale, setTokenSale] = useState(null);
    const [allowance,setAllowance] = useState('0')

  
    
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
              const tokenSale = new web3.eth.Contract(TokenSale.abi, networkDataSale.address);
              setTokenSale(tokenSale)
              
              
              const address = await web3.eth.getCoinbase();
              console.log(networkDataMyToken.address)
              setAccount(address);
           

    
              console.log(myToken)
              
    
              // const tokenPrice = await tokenSale.methods.tokenPrice().call()
              // setTokenPrices(tokenPrice)
              
    
              
    
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
                await tokenSale.methods.transferToken(fromAddress, toAddress).call({ from: account, value: amountInWei });
                setMessage(`Successfully transferred ${amount} tokens from ${fromAddress} to ${toAddress}`);
                // const standard = await myToken.methods.allowance("0x943a3D20EB84bcc2D3C0f311DB79477bc5eB3270",account).call()
                // setAllowance(standard)
            } catch (error) {
                console.error('Transfer error:', error);
                setMessage('Error transferring');
            }
    
            setFromAddress('');
            setToAddress('');
            setAmount('');
        };
    
        return (
            <div>
                <h1>Token Dashboard</h1>
                <p>Connected Account: {account}</p>
                <form onSubmit={handleTransferFrom}>
                    <div>
                        <label htmlFor="fromAddress">From Address:</label>
                        <input
                            id="fromAddress"
                            type="text"
                            value={fromAddress}
                            onChange={(e) => setFromAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="toAddress">To Address:</label>
                        <input
                            id="toAddress"
                            type="text"
                            value={toAddress}
                            onChange={(e) => setToAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="amount">Amount:</label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Transfer Tokens</button>
                </form>
                {allowance}
                {message && <p>{message}</p>}
            </div>
        );
}
    
export default CommissionerPage;






