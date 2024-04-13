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
  const [balance, setBalance] = useState('0');

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

        // const supply = await myTokenInstance.methods.totalSupply().call();
        // setTotalSupply(supply);

      
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
      console.log(myToken)
      const name = await myToken.methods.name().call()
      setName(name)
      const symbol = await myToken.methods.symbol().call()
      setSymbol(symbol)
      const standard = await myToken.methods.standard().call()
      setStandard(standard)
      const balance = await tokenSale.methods.balanceOf(account).call();
      console.log('balaceOf')
      console.log(balance)

      setBalance(balance);

    } catch (error) {
      console.error("Error purchasing tokens:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Token Dashboard</h1>
      <div className="space-y-4 mb-6">
        <p><span className="font-semibold">Account:</span> {account}</p>
        <p><span className="font-semibold">Token Name:</span> {name}</p>
        <p><span className="font-semibold">Symbol:</span> {symbol}</p>
        <p><span className="font-semibold">Standard:</span> {standard}</p>
        <p><span className="font-semibold">Total Supply:</span> {balance.toString()}</p>
        <p><span className="font-semibold">Token Price:</span> {tokenPrice} ETH</p>
      </div>
  
      <form onSubmit={handleBuyTokens} className="flex flex-col items-center">
        <input
          type="number"
          value={tokensToBuy}
          onChange={e => setTokensToBuy(e.target.value)}
          placeholder="Enter number of tokens to buy"
          className="px-3 py-2 border border-gray-300 rounded shadow-sm mb-4 w-full"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Buy Tokens
        </button>
      </form>
    </div>
  );
  
}

export default App;


