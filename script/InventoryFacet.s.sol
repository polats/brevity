// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import { InventoryFacet } from "contracts/inventory/InventoryFacet.sol";

contract Deploy is Script {
  function setUp() public {}

  function run() public {
    vm.startBroadcast();
    new InventoryFacet();
    vm.stopBroadcast();
  }
}
