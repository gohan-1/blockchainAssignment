// SPDX-License-Identifier: MIT
const MyToken = artifacts.require("MyToken");
const TokenSale = artifacts.require("TokenSale");

module.exports = function (deployer) {
  // Deploy MyToken contract
  const initialSupply = 1000000;
  deployer.deploy(MyToken, initialSupply).then(() => {
    // Get the deployed MyToken instance
    return MyToken.deployed();
  }).then((tokenInstance) => {
    // Deploy TokenSale contract and pass the deployed MyToken instance as an argument
    return deployer.deploy(TokenSale, tokenInstance.address, initialSupply);
  });
};