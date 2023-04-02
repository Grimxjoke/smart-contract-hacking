const { ethers } = require('hardhat');
const { expect } = require('chai');
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils")
const { formatEther } = require("ethers/lib/utils")


describe('ERC20 Tokens Exercise 1', function () {

    let deployer, user1, user2, user3;
    let contract;

    // Constants 
    const DEPLOYER_MINT = ethers.utils.parseEther('100000');
    const USERS_MINT = ethers.utils.parseEther('5000');
    const FIRST_TRANSFER = ethers.utils.parseEther('100');
    const SECOND_TRANSFER = ethers.utils.parseEther('1000');

    before(async function () {
        /** Deployment and minting tests */

        [deployer, user1, user2, user3] = await ethers.getSigners();

        // TODO: Contract deployment
        const contractFactory = await ethers.getContractFactory("SimpleTokenERC");
        contract = await contractFactory.deploy();
        await contract.deployed();

        // TODO: Minting

        await contract.connect(deployer).mint(deployer.address, DEPLOYER_MINT);

        await contract.connect(deployer).mint(user1.address, USERS_MINT);
        await contract.connect(deployer).mint(user2.address, USERS_MINT);
        await contract.connect(deployer).mint(user3.address, USERS_MINT);



        // TODO: Check Minting
        expect(await contract.balanceOf(deployer.address)).to.equal(DEPLOYER_MINT)
        expect(await contract.balanceOf(user1.address)).to.equal(USERS_MINT)
        expect(await contract.balanceOf(user2.address)).to.equal(USERS_MINT)
        expect(await contract.balanceOf(user3.address)).to.equal(USERS_MINT)

    });

    it('Transfer tests', async function () {
        /** Transfers Tests */

        // TODO: First transfer
        await contract.connect(user2).transfer(user3.address, FIRST_TRANSFER);
        expect(await contract.balanceOf(user3.address)).to.equal(parseEther("5100"))

        // TODO: Approval & Allowance test
        await contract.connect(user3).approve(user1.address, SECOND_TRANSFER);
        expect(await contract.allowance(user3.address, user1.address)).to.equal(SECOND_TRANSFER)

        // TODO: Second transfer
        await contract.connect(user1).transferFrom(user3.address, user1.address, SECOND_TRANSFER)

        // TODO: Checking balances after transfer
        expect(await contract.balanceOf(user1.address)).to.equal(parseEther("6000"));
        expect(await contract.balanceOf(user3.address)).to.equal(parseEther("4100"));
    });
});
