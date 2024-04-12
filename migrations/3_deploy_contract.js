var ArithamaticOperations = artifacts.require("./ArithamaticOperations");

module.exports = function(deployer) {
  // Deploy the simple contract as our only task
  deployer.deploy(ArithamaticOperations);
};