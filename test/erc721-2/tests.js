const { ethers } = require('hardhat');
const { expect } = require('chai');
const { parseEther } = require("ethers/lib/utils")

describe('ERC721 Tokens Exercise 2', function () {

    let deployer, user1, user2, user3;

    const CUTE_NFT_PRICE = parseEther('5');
    const BOOBLES_NFT_PRICE = parseEther('7');

    before(async function () {
        /** Deployment and minting tests */

        [deployer, user1, user2, user3] = await ethers.getSigners();

        // User1 creates his own NFT collection
        let NFTFactory = await ethers.getContractFactory('DummyERC721', user1);
        this.cuteNFT = await NFTFactory.deploy("Crypto Cuties", "CUTE", 1000);
        await this.cuteNFT.mintBulk(30);
        expect(await this.cuteNFT.balanceOf(user1.address)).to.be.equal(30);

        // User3 creates his own NFT collection
        NFTFactory = await ethers.getContractFactory('DummyERC721', user3);
        this.booblesNFT = await NFTFactory.deploy("Rare Boobles", "BOO", 10000);
        await this.booblesNFT.mintBulk(120);
        expect(await this.booblesNFT.balanceOf(user3.address)).to.be.equal(120);

        // Store users initial balance
        this.user1InitialBalance = await ethers.provider.getBalance(user1.address);


        this.user2InitialBalance = await ethers.provider.getBalance(user2.address);
        this.user3InitialBalance = await ethers.provider.getBalance(user3.address);
    });

    it('Deployment & Listing Tests', async function () {
        /** CODE YOUR SOLUTION HERE */

        // TODO: Deploy Marketplace from deployer
        let nftMarketPlace = await ethers.getContractFactory('OpenOcean', deployer);
        this.markeplace = await nftMarketPlace.deploy();



        // TODO: User1 lists Cute NFT tokens 1-10 for 5 ETH each
        for (i = 1; i <= 10; i++) {
            await this.cuteNFT.connect(user1).approve(this.markeplace.address, i);
            await this.markeplace.connect(user1).listItem(this.cuteNFT.address, i, parseEther("5"));

        }

        // TODO: Check that Marketplace owns 10 Cute NFTs

        expect(await this.markeplace.itemsCounter()).to.equal(10);

        let items = await this.markeplace.itemsCounter()
        let numberOfCuteNfts = 0;
        for (i = 1; i <= items; i++) {
            const item = await this.markeplace.listedItems(i);
            if (item.collection == this.cuteNFT.address) numberOfCuteNfts++;
        }
        expect(numberOfCuteNfts).to.equal(10)
        console.log(`Number of Cute Nft is ${numberOfCuteNfts}`);




        // TODO: Checks that the marketplace mapping is correct (All data is correct), check the 10th item.

        for (i = 1; i <= 10; i++) {
            const item = await this.markeplace.listedItems(i);
            expect(item.itemId).to.equal(i);
            expect(item.collection).to.equal(this.cuteNFT.address)
            expect(item.price).to.equal(parseEther("5"))
        }

        // TODO: User3 lists Boobles NFT tokens 1-5 for 7 ETH each

        for (i = 1; i <= 5; i++) {
            await this.booblesNFT.connect(user3).approve(this.markeplace.address, i);
            await this.markeplace.connect(user3).listItem(this.booblesNFT.address, i, parseEther("7"));
        }

        // TODO: Check that Marketplace owns 5 Booble NFTs
        items = await this.markeplace.itemsCounter()
        let numberOfBoobleNfts = 0;
        for (i = 1; i <= items; i++) {
            const item = await this.markeplace.listedItems(i);
            if (item.collection == this.booblesNFT.address) numberOfBoobleNfts++;
        }
        expect(numberOfBoobleNfts).to.equal(5)
        console.log(`Number of Cute Nft is ${numberOfBoobleNfts}`);
        console.log(`Number of Totals Nfts ${items}`);



        // TODO: Checks that the marketplace mapping is correct (All data is correct), check the 15th item.
        const item = await this.markeplace.listedItems(15);
        expect(item.itemId).to.equal(15);
        expect(item.collection).to.equal(this.booblesNFT.address)
        expect(item.price).to.equal(parseEther("7"))

    });

    it('Purchases Tests', async function () {

        /** CODE YOUR SOLUTION HERE */

        // All Purchases From User2 //

        this.user1BalanceAfterFees = await ethers.provider.getBalance(user1.address);
        this.user3BalanceAfterFees = await ethers.provider.getBalance(user3.address);
        items = await this.markeplace.itemsCounter()

        for (i = 1; i <= items; i++) {
            item = await this.markeplace.listedItems(i);
            if (item.collection == this.cuteNFT.address) {
                await this.markeplace.connect(user2).purchase(i, { value: parseEther("5") });
            } else if (item.collection == this.booblesNFT.address) {
                await this.markeplace.connect(user2).purchase(i, { value: parseEther("7") });
            }
        }




        // TODO: Try to purchase itemId 100, should revert
        expect(() => this.markeplace.connect(user2).purchase(100, { value: 100 })).to.be.reverted;
        // TODO: Try to purchase itemId 3, without ETH, should revert
        expect(() => this.markeplace.connect(user2).purchase(3, { value: 0 })).to.be.reverted;

        // TODO: Try to purchase itemId 3, with ETH, should work
        //Don't understand, The user2 already bought all the NFTs
        // await this.markeplace.connect(user2).purchase(3, { value: CUTE_NFT_PRICE });



        // TODO: Can't purchase sold item
        expect(() => this.markeplace.connect(user2).purchase(3, { value: CUTE_NFT_PRICE })).to.be.reverted;


        // TODO: User2 owns itemId 3 -> Cuties tokenId 3
        expect(await this.cuteNFT.ownerOf(3)).to.equal(user2.address);

        // TODO: User1 got the right amount of ETH for the sale
        expect(await ethers.provider.getBalance(user1.address)).to.equal(parseEther("50").add(this.user1BalanceAfterFees))

        // TODO: User3 got the right amount of ETH for the sale
        expect(await ethers.provider.getBalance(user3.address)).to.equal(parseEther("35").add(this.user3BalanceAfterFees))

    });
});
