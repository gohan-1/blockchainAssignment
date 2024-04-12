import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MyToken from '../contracts/MyToken.json';
import TokenSale from '../contracts/TokenSale.json';

function App() {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [myToken, setMyToken] = useState(null);
  const [tokenSale, setTokenSale] = useState(null);
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [standard, setStandard] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [tokenPrice, setTokenPrice] = useState('');
  const [tokensToBuy, setTokensToBuy] = useState('');

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }

      const web3 = window.web3;
      setWeb3(web3);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      console.log(accounts[0])
      
      const networkId = await web3.eth.net.getId();
      const networkDataMyToken = MyToken.networks[networkId];
      const networkDataSale = TokenSale.networks[networkId];

      if (networkDataMyToken && networkDataSale) {
        const myTokenInstance = new web3.eth.Contract(MyToken.abi, networkDataMyToken.address);
        const tokenSaleInstance = new web3.eth.Contract(TokenSale.abi, networkDataSale.address);
        setMyToken(myTokenInstance);
        setTokenSale(tokenSaleInstance);

        const price = await tokenSaleInstance.methods.tokenPrice().call();
        setTokenPrice(web3.utils.fromWei(price, 'ether'));

        const supply = await myTokenInstance.methods.totalSupply().call();
        setTotalSupply(supply);
      }
    };

    loadBlockchainData();
  }, []);

  const handleBuyTokens = async (event) => {
    event.preventDefault();
    if (!tokenSale) {
      console.error("The token sale contract is not loaded.");
      return;
    }

    try {
      const priceInWei = web3.utils.toWei((tokenPrice * tokensToBuy).toString(), 'ether');
      await tokenSale.methods.buyTokens(tokensToBuy).send({ from: account, value: priceInWei });
      console.log("Tokens purchased successfully!");
    } catch (error) {
      console.error("Error purchasing tokens:", error);
    }
  };

  return (
    <div>
      <h1>Token Dashboard</h1>
      <p>Account: {account}</p>
      <p>Token Name: {name}</p>
      <p>Symbol: {symbol}</p>
      <p>Standard: {standard}</p>
      <p>Total Supply: {totalSupply.toString()}</p>
      <p>Token Price: {tokenPrice} ETH</p>

      <form onSubmit={handleBuyTokens}>
        <input
          type="number"
          value={tokensToBuy}
          onChange={e => setTokensToBuy(e.target.value)}
          placeholder="Enter number of tokens to buy"
          required
        />
        <button type="submit">Buy Tokens</button>
      </form>
    </div>
  );
}

export default App;


