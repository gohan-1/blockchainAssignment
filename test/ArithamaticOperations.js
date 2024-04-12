

const ArithamaticOperations = artifacts.require("./ArithamaticOperations");

contract('ArithamaticOperations', (accounts) => {
    let arithmaticOperations;

    before(async () => {
        arithmaticOperations = await ArithamaticOperations.deployed();
    });

    it('calculateTip function should return the correct tip', async () => {
        const value = 100;
        const expectedTip = 10;

        const tip = await arithmaticOperations.calculateTip(value);

        assert.equal(tip, expectedTip, "Tip calculation is incorrect");
    });

    it('multiply function should return the correct result', async () => {
        const x = 5;
        const y = 10;
        const expectedZ = 50;

        const z = await arithmaticOperations.multiply(x, y);

        assert.equal(z, expectedZ, "Multiplication result is incorrect");
    });
});
