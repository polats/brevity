// SPDX-License-Identifier: UNLICENSED

/**
 * Crated based in the following work:
 * Authors: Moonstream DAO (engineering@moonstream.to)
 * GitHub: https://github.com/G7DAO/contracts
 */

pragma solidity 0.8.19;

import { ReentrancyGuard } from "@solidstate/contracts/utils/ReentrancyGuard.sol";
import { ERC1155Holder } from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import { InventoryStorage } from "./InventoryStorage.sol";
import { InventoryInternal } from "./InventoryInternal.sol";

/**
 * @title InventoryFacet
 * @dev This contract is responsible for managing the inventory system for the Arcadians using slots. 
 * It defines the functionality to equip and unequip items to Arcadians, check if a combination of items 
 * are unique, and retrieve the inventory slots and allowed items for a slot. 
 * This contract also implements ERC1155Holder to handle ERC1155 token transfers
 * This contract can be used as a facet of a diamond which follows the EIP-2535 diamond standard.
 * It also uses the ReentrancyGuard and Multicall contracts for security and gas efficiency.
 */
contract InventoryFacet is
    ERC1155Holder,
    ReentrancyGuard,
    InventoryInternal
{

    /**
     * @notice Returns the number of inventory slots
     * @dev Slots are 1-indexed
     * @return The number of inventory slots 
     */
    function numSlots() external view returns (uint) {
        return _numSlots();
    }

    function arcadianToBaseItemHash(uint arcadianId) external view returns (bytes32) {
        return InventoryStorage.layout().arcadianToBaseItemHash[arcadianId];
    }

    /**
     * @notice Returns the details of an inventory slot given its ID
     * @dev Slots are 1-indexed
     * @param slotId The ID of the inventory slot
     * @return existentSlot The details of the inventory slot
     */
    function slot(uint slotId) external view returns (InventoryStorage.Slot memory existentSlot) {
        return _slot(slotId);
    }

    /**
     * @notice Returns the details of all the existent slots
     * @dev Slots are 1-indexed
     * @return existentSlots The details of all the inventory slots
     */
    function slotsAll() external view returns (InventoryStorage.Slot[] memory existentSlots) {
        return _slotsAll();
    }

    /**
     * @notice Creates a new inventory slot
     * @dev This function is only accessible to the manager role
     * @dev Slots are 1-indexed
     * @param permanent Whether or not the slot can be unequipped once equipped
     * @param isBase If the slot is base
     * @param items The list of items to allow in the slot
     */
    function createSlot(
        bool permanent,
        bool isBase,
        InventoryStorage.Item[] calldata items
    ) external onlyManager {
        _createSlot(permanent, isBase, items);
    }

    /**
     * @notice Sets the slot permanent property
     * @dev This function is only accessible to the manager role
     * @dev Slots are 1-indexed
     * @param permanent Whether or not the slot is permanent
     */
    function setSlotPermanent(
        uint slotId,
        bool permanent
    ) external onlyManager {
        _setSlotPermanent(slotId, permanent);
    }

    /**
     * @notice Sets the slot base property
     * @dev This function is only accessible to the manager role
     * @dev Slots are 1-indexed
     * @param isBase Whether or not the slot is base
     */
    function setSlotBase(
        uint slotId,
        bool isBase
    ) external onlyManager {
        _setSlotBase(slotId, isBase);
    }

    /**
     * @notice Returns the number coupons available for an account that allow to modify the base traits
     * @param account The accounts to increase the number of coupons
     * @param slotId The slot to get the coupon amount from
     */
    function getBaseModifierCoupon(
        address account,
        uint slotId
    ) external view returns (uint) {
        return _getbaseModifierCoupon(account, slotId);
    }

    /**
     * @notice Returns the number coupons available for an account that allow to modify the base traits
     * @param account The accounts to increase the number of coupons
     */
    function getBaseModifierCouponAll(
        address account
    ) external view returns (BaseModifierCoupon[] memory) {
        return _getBaseModifierCouponAll(account);
    }

    /**
     * @notice Adds coupons to accounts that allow to modify the base traits
     * @param account The account to increase the number of coupons
     * @param slotsIds The slots ids to increase the number of coupons
     * @param amounts the amounts of coupons to increase
     */
    function addBaseModifierCoupons(
        address account,
        uint[] calldata slotsIds,
        uint[] calldata amounts
    ) external onlyAutomation {
        _addBaseModifierCoupons(account, slotsIds, amounts);
    }

    /**
     * @notice Adds items to the list of allowed items for an inventory slot
     * @param slotId The slot id
     * @param items The list of items to allow in the slot
     */
    function allowItemsInSlot(
        uint slotId,
        InventoryStorage.Item[] calldata items
    ) external onlyManager {
        _allowItemsInSlot(slotId, items);
    }
    
    /**
     * @notice Removes items from the list of allowed items
     * @param slotId The ID of the inventory slot
     * @param items The list of items to disallow in the slot
     */
    function disallowItemsInSlot(
        uint slotId,
        InventoryStorage.Item[] calldata items
    ) external onlyManager {
        _disallowItemsInSlot(slotId, items);
    }

    /**
     * @notice Returns the allowed slot for a given item
     * @param item The item to check
     * @return The allowed slot id for the item. Slots are 1-indexed.
     */
    function allowedSlot(InventoryStorage.Item calldata item) external view returns (uint) {
        return _allowedSlot(item);
    }

    /**
     * @notice Returns the allowed item for a given slot and the index
     * @param slotId The slot id to query
     * @param index The index of the item
     * @return A list of all the items that are allowed in the slot
     */
    function allowedItem(uint slotId, uint index) external view returns (InventoryStorage.Item memory) {
        return _allowedItem(slotId, index);
    }

    /**
     * @notice Returns the number of allowed items for a given slot
     * @param slotId The slot id to check
     * @return A list of all the items that are allowed in the slot
     */
    function numAllowedItems(uint slotId) external view returns (uint) {
        return _numAllowedItems(slotId);
    }

    /**
     * @notice Equips multiple items to multiple slots for a specified Arcadian NFT
     * @param arcadianId The ID of the Arcadian NFT to equip the items for
     * @param items An array of items to equip in the corresponding slots
     */
    function equip(
        uint arcadianId,
        InventoryStorage.Item[] calldata items
    ) external nonReentrant {
        _equip(arcadianId, items, false);
    }

    /**
     * @notice Unequips the items equipped in multiple slots for a specified Arcadian NFT
     * @param arcadianId The ID of the Arcadian NFT to equip the item for
     * @param slotIds The slots ids in which the items will be unequipped
     */
    function unequip(
        uint arcadianId,
        uint[] calldata slotIds
    ) external nonReentrant {
        _unequip(arcadianId, slotIds);
    }

    /**
     * @notice Retrieves the equipped item in a slot for a specified Arcadian NFT
     * @param arcadianId The ID of the Arcadian NFT to query
     * @param slotId The slot id to query
     */
    function equipped(
        uint arcadianId,
        uint slotId
    ) external view returns (ItemInSlot memory item) {
        return _equipped(arcadianId, slotId);
    }

    /**
     * @notice Retrieves the equipped items in the slot of an Arcadian NFT
     * @param arcadianId The ID of the Arcadian NFT to query
     * @param slotIds The slots ids to query
     */
    function equippedBatch(
        uint arcadianId,
        uint[] calldata slotIds
    ) external view returns (ItemInSlot[] memory equippedSlot) {
        return _equippedBatch(arcadianId, slotIds);
    }

    /**
     * @notice Retrieves all the equipped items for a specified Arcadian NFT
     * @param arcadianId The ID of the Arcadian NFT to query
     */
    function equippedAll(
        uint arcadianId
    ) external view returns (ItemInSlot[] memory equippedSlot) {
        return _equippedAll(arcadianId);
    }

    /**
     * @notice Indicates if a list of items applied to an the arcadian is unique
     * @dev The uniqueness is calculated using the existent arcadian items and the input items as well
     * @dev Only items equipped in 'base' slots are considered for uniqueness
     * @param arcadianId The ID of the Arcadian NFT to query
     * @param items An array of items to check for uniqueness after "equipped" over the existent arcadian items.
     */
    function isArcadianUnique(
        uint arcadianId,
        InventoryStorage.Item[] calldata items
    ) external view returns (bool) {
        return _isArcadianUnique(arcadianId, items);
    }
}