import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MyToken from '../contracts/MyToken.json';
import TokenSale from '../contracts/TokenSale.json';

const CommissionerPage = () => {
    const [account, setAccount] = useState('');
    const [web3, setWeb3] = useState(null);
    const [myToken, setMyToken] = useState(null);
    const [tokenSale, setTokenSale] = useState(null);
    const [tokenBalance, setTokenBalance] = useState('0');
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
                const networkId = await web3.eth.net.getId();

                const deployedNetworkMyToken = MyToken.networks[networkId];
                const deployedNetworkTokenSale = TokenSale.networks[networkId];
                const myTokenInstance = new web3.eth.Contract(MyToken.abi, deployedNetworkMyToken.address);
                const tokenSaleInstance = new web3.eth.Contract(TokenSale.abi, deployedNetworkTokenSale.address);

                setWeb3(web3);
                setMyToken(myTokenInstance);
                setTokenSale(tokenSaleInstance);

                if (myTokenInstance) {
                    const balance = await myTokenInstance.methods.balanceOf(accounts[0]).call();
                    setTokenBalance(balance);
                }
            } else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        };

        loadBlockchainData();
    }, []);

    const handleTransfer = async (event) => {
        event.preventDefault();
        if (!web3 || !myToken) {
            setMessage('Web3 or token contract not loaded');
            return;
        }

        try {
            const amountInWei = web3.utils.toWei(amount, 'ether');
            await myToken.methods.transfer(toAddress, amountInWei).send({ from: account });
            setMessage(`Successfully transferred ${amount} tokens to ${toAddress}`);
        } catch (error) {
            console.error('Transfer error:', error);
            setMessage('Error transferring tokens. See console.');
        }

        setToAddress('');
        setAmount('');
    };

    
    const formattedTokenBalance = web3 ? web3.utils.fromWei(tokenBalance, 'ether') : 'Loading...';

    return (
        <div>
            <h1>Token Dashboard</h1>
            <p>Account: {account}</p>
            

            <form onSubmit={handleTransfer}>
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
                    <label htmlFor="amount">Amount to Transfer:</label>
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

            {message && <p>{message}</p>}
        </div>
    );
}

export default CommissionerPage;




