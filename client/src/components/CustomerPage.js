import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const SendEther = ({ account }) => {
  const [web3, setWeb3] = useState(null);
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initWeb3 = () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        window.ethereum.enable().catch((error) => {
          console.error("User denied account access", error);
        });
      } else if (window.web3) {
        setWeb3(new Web3(window.web3.currentProvider));
      } else {
        setMessage('Non-Ethereum browser detected. Consider using MetaMask!');
      }
    };

    initWeb3();
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
      const amountInWei = web3.utils.toWei(amount, 'ether');
      await web3.eth.sendTransaction({
        from: account,
        to: receiver,
        value: amountInWei
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

export default SendEther;

