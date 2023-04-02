// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title rToken
 * @author JohnnyTime (https://smartcontractshacking.com) 
 */
contract rToken is ERC20, Ownable {

    address public underlyingToken;
    mapping(address => uint) userBalance;


    // TODO: Complete this contract functionality
    constructor(address _underlyingToken, string memory _name, string memory _symbol)
    ERC20(_name, _symbol) {
        require(_underlyingToken != address(0), "The underlyingToken cannot be the 0 address");
        underlyingToken = _underlyingToken;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    function burn(address to, uint256 amount) public onlyOwner {
        _burn(to, amount);
    }
}
