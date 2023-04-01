const { ethers } = require('hardhat');
const { expect } = require('chai');
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { formatEther } = require("ethers/lib/utils");

describe('ERC20 Tokens Exercise 1', function () {

    let deployer, user1, user2, user3;
    let contract; // declare contract variable outside of the before function

    // Constants 
    const DEPLOYER_MINT = ethers.utils.parseEther('100000');
    const USERS_MINT = ethers.utils.parseEther('5000');
    const FIRST_TRANSFER = ethers.utils.parseEther('100');
    const SECOND_TRANSFER = ethers.utils.parseEther('1000');

    before(async function () {
        this.timeout(0); // disable timeout for this test suite

        /** Deployment and minting tests */

        [deployer, user1, user2, user3] = await ethers.getSigners();

        const weiAmount = ethers.BigNumber.from('1000000000000000000');
        const etherAmount = ethers.utils.formatEther(weiAmount);

        // TODO: Contract deployment
        const contractFactory = await ethers.getContractFactory("SimpleTokenERC");
        contract = await contractFactory.deploy()
        await contract.deployed()

        // TODO: Minting
        let mintingToMe = await contract.connect(deployer).mint(deployer.address, DEPLOYER_MINT);
        await mintingToMe.wait();

        let mintingToUser1 = await contract.connect(deployer).mint(user1.address, USERS_MINT);
        await mintingToUser1.wait();

        let mintingToUser2 = await contract.connect(deployer).mint(user2.address, USERS_MINT);
        await mintingToUser2.wait();

        let mintingToUser3 = await contract.connect(deployer).mint(user3.address, USERS_MINT);
        await mintingToUser3.wait();

        // TODO: Check Minting
        expect(await contract.balanceOf(deployer.address)).to.equal(DEPLOYER_MINT)
        expect(await contract.balanceOf(user1.address)).to.equal(USERS_MINT)
        expect(await contract.balanceOf(user2.address)).to.equal(USERS_MINT)
        expect(await contract.balanceOf(user3.address)).to.equal(USERS_MINT)
    });

    it('Transfer tests', async function () {
        /** Transfers Tests */

        // TODO: First transfer
        let firstTransfer = await contract.connect(user2).transfer(user3.address, FIRST_TRANSFER);
        await firstTransfer.wait();

        // TODO: Approval & Allowance test
        let approvalFromUser3toUser1 = await contract.connect(user3).approve(user1.address, FIRST_TRANSFER);
        await approvalFromUser3toUser1.wait();

        // TODO: Second transfer

        // TODO: Checking balances after transfer
    });
});