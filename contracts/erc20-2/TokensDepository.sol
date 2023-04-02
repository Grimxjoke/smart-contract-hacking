// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {rToken} from "./rToken.sol";

/**
 * @title TokensDepository
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract TokensDepository {

    // TODO: Complete this contract functionality
    mapping(address => IERC20) public tokens;
    mapping(address => rToken) public receiptTokens;

    constructor(address _aave, address _uni, address _weth) {

        tokens[_aave] = IERC20(_aave);
        tokens[_uni] = IERC20(_uni);
        tokens[_weth] = IERC20(_weth);

        receiptTokens[_aave] = new rToken(_aave, "Receipt Aave", "rAave");
        receiptTokens[_uni] = new rToken(_uni, "Receipt Uni", "rUni");
        receiptTokens[_weth] = new rToken(_weth, "Receipt Uni", "rUni");

    }

    modifier isTokenSupported(address _token) {
        require(address(tokens[_token]) != address(0), "The address is not valid ");
        _;
    }
    
    function deposit(address _token, uint256 _amount) external isTokenSupported(_token){
       bool success = tokens[_token].transferFrom(msg.sender, address(this), _amount);
       require(success, "TransferFrom Failed");
       receiptTokens[_token].mint(msg.sender, _amount);
    }
    function withdraw(address _token, uint256 _amount) external isTokenSupported(_token){
        receiptTokens[_token].burn(msg.sender, _amount);
        bool success = tokens[_token].transfer(msg.sender, _amount);
        require(success, "Transfer Failed");

    }
}
