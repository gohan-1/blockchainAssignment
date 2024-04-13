var ArithmeticOperations = artifacts.require("./ArithmeticOperations");

module.exports = function(deployer) {
  // Deploy the simple contract as our only task
  deployer.deploy(ArithmeticOperations);
};