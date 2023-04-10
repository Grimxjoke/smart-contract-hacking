const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Reentrancy Exercise 4', function () {

  let deployer, user1, user2, attacker;

  before(async () => {

    [deployer, user1, user2, attacker] = await ethers.getSigners();

    const CryptoEmpireTokenFactory = await ethers.getContractFactory(
      'contracts/reentrancy-4/CryptoEmpireToken.sol:CryptoEmpireToken',
      deployer
    );
    this.token = await CryptoEmpireTokenFactory.deploy();

    const CryptoEmpireGameFactory = await ethers.getContractFactory(
      'contracts/reentrancy-4/CryptoEmpireGame.sol:CryptoEmpireGame',
      deployer
    );
    this.game = await CryptoEmpireGameFactory.deploy(this.token.address);

    // Giving 1 NFT to each user
    this.token.mint(user1.address, 1, 0);
    this.token.mint(user2.address, 1, 1);
    this.token.mint(attacker.address, 1, 2);

    // The game gained many users already and has some NFTs either staked or listed in it
    for (let i = 0; i <= 5; i++) {
      this.token.mint(this.game.address, 20, i);
    }
  });

  it('Exploit', async () => {
    /** CODE YOUR SOLUTION HERE */

    const HackerFactory = await ethers.getContractFactory(
      'contracts/reentrancy-4/Hacker.sol:Hacker',
      attacker
    );
    this.hacker = await HackerFactory.deploy(this.game.address, this.token.address);

    await this.token.connect(attacker).setApprovalForAll(this.hacker.address, true);
    // await this.token.connect(attacker).safeTransferFrom(attacker.address, this.hacker.address, 2, 1,"");
    await this.hacker.simpleCall();


  });

  after(async () => {

    // Attacker stole all the tokens from the game contract
    expect(await this.token.balanceOf(attacker.address, 2)).to.be.at.least(20)
    expect(await this.token.balanceOf(this.game.address, 2)).to.be.equal(0)

  });
});