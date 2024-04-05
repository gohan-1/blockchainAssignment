var MyToken = artifacts.require("./MyToken");

module.exports = function(deployer) {
  // Deploy the simple contract as our only task
  deployer.deploy(MyToken,1000000);
};