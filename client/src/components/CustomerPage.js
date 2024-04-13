
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

  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
 
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
          
          const accounts = await web3.eth.getAccounts();
            console.log(accounts)
            setAccount(accounts[0])

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


  const handleSendEther = async (event) => {
    event.preventDefault();

    if (!web3) {
      setMessage('Web3 is not initialized');
      console.log('web 3');
      console.log(web3);
      return;
    }

    try {
      console.log(amount)
      console.log(receiver)
      console.log(account)
      const amountInWei = web3.utils.toWei(amount, 'ether');
      console.log(amountInWei)
      await tokenSale.methods.sendEther(receiver).send({
        from: account,
        value:amountInWei
        
      });

      setMessage('Ether sent successfully!');
    } catch (error) {
      console.error('Error sending Ether:', error);
      setMessage('Failed to send Ether. See console.');
    }

    // Clear the form
    setReceiver('');
    setAmount('');
  };

  return (
    <div>
      <h1>Send Ether</h1>
      <form onSubmit={handleSendEther}>
        <div>
          <label htmlFor="receiver">Receiver Address:</label>
          <input
            id="receiver"
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="amount">Amount (in ETH):</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Ether</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default App;

