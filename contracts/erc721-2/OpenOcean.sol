pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract OpenOcean {
  // TODO: Complete this contract functionality

  // TODO: Constants
  uint256 public maxPrice = 100 ether;

  // TODO: Item Struct
  struct Item {
    uint256 itemId;
    address collection;
    uint tokenId;
    uint price;
    address payable seller;
    bool isSold;
  }

  // TODO: State Variables and Mappings
  uint public itemsCounter;
  mapping(uint => Item) public listedItems;

  constructor() {}

  function listItem(
    address _collection,
    uint256 _tokenId,
    uint256 _price
  ) external {
    itemsCounter++;
    listedItems[itemsCounter].itemId = itemsCounter;
    listedItems[itemsCounter].collection = _collection;
    listedItems[itemsCounter].tokenId = _tokenId;
    listedItems[itemsCounter].price = _price;
    listedItems[itemsCounter].seller = payable(msg.sender);

    IERC721(_collection).transferFrom(msg.sender, address(this), _tokenId);
  }

  function purchase(uint _itemId) external payable {
    require(itemsCounter >= _itemId, "Item not Available");
    require(!listedItems[_itemId].isSold, "Item has been sold");
    require(msg.value >= listedItems[_itemId].price, "You didn't pay enought");
    listedItems[_itemId].isSold = true;
    (bool success, ) = (listedItems[_itemId].seller).call{ value: msg.value }(
      ""
    );
    require(success, "Seller didn't get paid");

    IERC721(listedItems[_itemId].collection).transferFrom(
      address(this),
      msg.sender,
      listedItems[_itemId].tokenId
    );
  }
}
