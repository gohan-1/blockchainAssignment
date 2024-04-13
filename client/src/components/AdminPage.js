
import React, { useState, useEffect } from 'react';
// import ProgressBar from 'react-bootstrap/ProgressBar';
// import Card from 'react-bootstrap/Card';
import Web3 from 'web3';
import MyToken from '../contracts/MyToken.json';
import TokenSale from '../contracts/TokenSale.json';
// import Main from './main';

function App() {
  const [account, setAccount] = useState('');
  const [deployer, setDeployer] = useState('');
  const [buyer, setBuyer] = useState('');
  const [name, setName] = useState('');
  const [web3,setWeb3] = useState('')
  const [symbol, setSymbol] = useState('');
  const [standard, setStandard] = useState('');
  const [totalSupply,setTotalSuplly] = useState('')
  const [tokenSale, setTokenSale] = useState(null);
  const [tokenPrice, setTokenPrices] = useState('0')
 
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
        setWeb3(web3)
        const accounts = await web3.eth.getAccounts();
        console.log(accounts)
        setAccount(accounts[0])
        const networkId = await web3.eth.net.getId();
        const networkDataMyToken = MyToken.networks[networkId];
        const networkDataSale = TokenSale.networks[networkId];

        if (networkDataMyToken && networkDataSale) {
          const myToken = new web3.eth.Contract(MyToken.abi, networkDataMyToken.address);
          const tokenSale = new web3.eth.Contract(TokenSale.abi, networkDataSale.address);
          setTokenSale(tokenSale)
          const address = await web3.eth.getCoinbase();
          console.log(networkDataMyToken.address)
          setAccount(address);

          console.log(myToken)
          const name = await myToken.methods.name().call()
          setName(name)
          const symbol = await myToken.methods.symbol().call()
          setSymbol(symbol)
          const standard = await myToken.methods.standard().call()
          setStandard(standard)
          const totalSupply = await myToken.methods.totalSupply().call()
          console.log(totalSupply)
          setTotalSuplly(totalSupply)

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

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
    
        const numberOfTokens = event.target.postContent.value;
    
    // Convert the value to a number
    const tokenPriceInEther = Number(numberOfTokens); // Token price in Ether
      const tokenPriceInWei = web3.utils.toWei(tokenPriceInEther.toString(), "ether"); // Convert to wei
        console.log(tokenPriceInWei)
      // Set token price
      await tokenSale.methods.setTokenPrice(tokenPriceInWei).send({ from: account });
  
      // Get token price
      const tokenPrice = await tokenSale.methods.tokenPrice().call();
  
      // Update state with the token price
      setTokenPrices(tokenPrice.toString());
  
      console.log("Token price:", tokenPrice);
    } catch (error) {
      console.error("Error handling form submission:", error);
    }
  };
  return (
    <div className="max-w-xl mx-auto my-8">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <input
            id="postContent"
            type="number"
            className="block w-full px-3 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            placeholder="number of tokens"
            required
          />
          <div className="space-y-2 text-center">
            <p className="font-semibold">Account: {account}</p>
            <p className="font-semibold">Token Name: {name}</p>
            <p className="font-semibold">Symbol: {symbol}</p>
            <p className="font-semibold">Standard: {standard}</p>
            <p className="font-semibold">TotalSupply: {totalSupply.toString()}</p>
            <p className="font-semibold">TokenPrice: {tokenPrice}</p>
          </div>
    
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Set Tokens Price
          </button>  
   
        </div>
      </form>
    </div>
  );
 
}

export default App;