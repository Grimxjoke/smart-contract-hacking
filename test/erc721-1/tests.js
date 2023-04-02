const { ethers } = require('hardhat');
const { expect } = require('chai');
const { parseEther } = require("ethers/lib/utils")

describe('ERC721 Tokens Exercise 1', function () {

    let deployer, user1, user2;
    let tokenId = 1;

    // Constants 
    const DEPLOYER_MINT = 5;
    const USER1_MINT = 3;
    const MINT_PRICE = ethers.utils.parseEther('0.1');

    before(async function () {
        /** Deployment and minting tests */

        [deployer, user1, user2] = await ethers.getSigners();

        /** CODE YOUR SOLUTION HERE */
        // TODO: Contract deployment

        const smartHackerFactory = await ethers.getContractFactory("SmartHacker");
        this.contract = await smartHackerFactory.deploy();







    });

    it('Minting Tests', async function () {
        /** CODE YOUR SOLUTION HERE */



        // TODO: Deployer mints
        // Deployer should own token ids 1-5
        for (i = 1; i <= 5; i++) {
            await this.contract.connect(deployer).safeMint({ value: parseEther("0.1") });
        }

        // TODO: User 1 mints
        // User1 should own token ids 6-8
        for (i = 6; i <= 8; i++) {
            await this.contract.connect(user1).safeMint({ value: parseEther("0.1") });
        }

        // TODO: Check Minting

        expect(await this.contract.balanceOf(deployer.address)).to.equal(5);
        expect(await this.contract.balanceOf(user1.address)).to.equal(3);

    });

    it('Transfers Tests', async function () {
        /** CODE YOUR SOLUTION HERE */

        // TODO: Transfering tokenId 6 from user1 to user2
        await this.contract.connect(user1).transferFrom(user1.address, user2.address, 6);

        // TODO: Checking that user2 owns tokenId 6
        expect(await this.contract.ownerOf(6)).to.equal(user2.address);

        // TODO: Deployer approves User1 to spend tokenId 3
        await this.contract.connect(deployer).approve(user1.address, 3);

        // TODO: Test that User1 has approval to spend TokenId3
        expect(await this.contract.connect(user1).getApproved(3)).to.equal(user1.address);

        // TODO: Use approval and transfer tokenId 3 from deployer to User1
        await this.contract.transferFrom(deployer.address, user1.address, 3)


        // TODO: Checking that user1 owns tokenId 3
        expect(await this.contract.ownerOf(3)).to.equal(user1.address);

        // TODO: Checking balances after transfer
        // Deployer: 5 minted, 1 sent, 0 received
        expect(await this.contract.balanceOf(deployer.address)).to.equal(4)

        // User1: 3 minted, 1 sent, 1 received
        expect(await this.contract.balanceOf(user1.address)).to.equal(3)

        // User2: 0 minted, 0 sent, 1 received
        expect(await this.contract.balanceOf(user2.address)).to.equal(1)

    });
});
