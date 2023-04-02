// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SmartHacker is ERC721, Ownable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  constructor() ERC721("SmartHacker", "SH") {}

  function safeMint() external payable {
    require(msg.value == 0.1 ether, "The value should be 0.1 Ether");
    uint256 tokenId = _tokenIdCounter.current();
    require(tokenId <= 10000, "All the tokens have already been minted");
    _tokenIdCounter.increment();
    _safeMint(msg.sender, tokenId);
  }
}
