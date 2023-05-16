// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import { ReentrancyGuard } from "@solidstate/contracts/utils/ReentrancyGuard.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { AddressUtils } from "@solidstate/contracts/utils/AddressUtils.sol";
import { ArrayUtils } from "@solidstate/contracts/utils/ArrayUtils.sol";
import { EnumerableSet } from "@solidstate/contracts/data/EnumerableSet.sol";
import { RolesInternal } from "../roles/RolesInternal.sol";
import { InventoryStorage } from "./InventoryStorage.sol";
import { IERC1155 } from "@solidstate/contracts/interfaces/IERC1155.sol";

contract InventoryInternal is
    ReentrancyGuard,
    RolesInternal
{
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.Bytes32Set;
    using AddressUtils for address;

    error Inventory_InvalidERC1155Contract();
    error Inventory_UnequippingPermanentSlot();
    error Inventory_InvalidSlotId();
    error Inventory_ItemDoesNotHaveSlotAssigned();
    error Inventory_InsufficientItemBalance();
    error Inventory_UnequippingEmptySlot();
    error Inventory_UnequippingBaseSlot();
    error Inventory_SlotNotSpecified();
    error Inventory_ItemNotSpecified();
    error Inventory_NotArcadianOwner();
    error Inventory_ArcadianNotUnique();
    error Inventory_NotAllBaseSlotsEquipped();
    error Inventory_InputDataMismatch();
    error Inventory_ItemAlreadyEquippedInSlot();
    error Inventory_CouponNeededToModifyBaseSlots();
    error Inventory_NonBaseSlot();

    event ItemsAllowedInSlotUpdated(
        address indexed by,
        uint slotId
    );

    event ItemsEquipped(
        address indexed by,
        uint indexed arcadianId,
        uint[] slots
    );

    event ItemsUnequipped(
        address indexed by,
        uint indexed arcadianId,
        uint[] slots
    );

    event SlotCreated(
        address indexed by,
        uint slotId,
        bool permanent,
        bool isBase
    );

    event BaseModifierCouponAdded(
        address indexed by,
        address indexed to,
        uint[] slotsIds,
        uint[] amounts
    );

    event BaseModifierCouponConsumed(
        address indexed account,
        uint[] slotsIds
    );

    // Helper structs only used in view functions to ease data reading from web3
    struct ItemInSlot {
        uint slotId;
        address erc721Contract;
        uint itemId;
    }
    struct BaseModifierCoupon {
        uint slotId;
        uint amount;
    }

    modifier onlyValidSlot(uint slotId) {
        if (slotId == 0 || slotId > InventoryStorage.layout().numSlots) revert Inventory_InvalidSlotId();
        _;
    }

    modifier onlyArcadianOwner(uint arcadianId) {
        IERC721 arcadiansContract = IERC721(address(this));
        if (msg.sender != arcadiansContract.ownerOf(arcadianId)) revert Inventory_NotArcadianOwner();
        _;
    }

    function _numSlots() internal view returns (uint) {
        return InventoryStorage.layout().numSlots;
    }

    function _equip(
        uint arcadianId,
        InventoryStorage.Item[] calldata items,
        bool freeBaseModifier
    ) internal onlyArcadianOwner(arcadianId) {

        if (items.length == 0) 
            revert Inventory_ItemNotSpecified();

        InventoryStorage.Layout storage inventorySL = InventoryStorage.layout();
        uint numBaseSlotsModified;
        uint[] memory slotsIds = new uint[](items.length);
        for (uint i = 0; i < items.length; i++) {
            uint slotId = _equipSingleSlot(arcadianId, items[i], freeBaseModifier);
            if (inventorySL.slots[slotId].isBase) {
                numBaseSlotsModified++;
            }
            slotsIds[i] = slotId;
        }

        if (!_baseSlotsEquipped(arcadianId)) 
            revert Inventory_NotAllBaseSlotsEquipped();

        if (numBaseSlotsModified > 0) {
            if (!_hashBaseItemsUnchecked(arcadianId))
                revert Inventory_ArcadianNotUnique();
            
            if (!freeBaseModifier) {
                uint[] memory baseSlotsModified = new uint[](numBaseSlotsModified);
                uint counter;
                for (uint i = 0; i < items.length; i++) {
                    uint slotId = inventorySL.itemSlot[items[i].erc721Contract][items[i].id];
                    if (inventorySL.slots[slotId].isBase) {
                        baseSlotsModified[counter] = slotId;
                        counter++;
                    }
                }
                emit BaseModifierCouponConsumed(msg.sender, baseSlotsModified);
            }
        }

        emit ItemsEquipped(msg.sender, arcadianId, slotsIds);
    }

    function _equipSingleSlot(
        uint arcadianId,
        InventoryStorage.Item calldata item,
        bool freeBaseModifier
    ) internal returns (uint slotId) {

        InventoryStorage.Layout storage inventorySL = InventoryStorage.layout();
        slotId = inventorySL.itemSlot[item.erc721Contract][item.id];
        
        if (slotId == 0 || slotId > InventoryStorage.layout().numSlots) 
            revert Inventory_ItemDoesNotHaveSlotAssigned();
        
        if (!freeBaseModifier && inventorySL.slots[slotId].isBase) {
            if (inventorySL.baseModifierCoupon[msg.sender][slotId] < 1)
                revert Inventory_CouponNeededToModifyBaseSlots();

            inventorySL.baseModifierCoupon[msg.sender][slotId]--;
        }

        InventoryStorage.Item storage existingItem = inventorySL.equippedItems[arcadianId][slotId];
        if (inventorySL.slots[slotId].permanent && existingItem.erc721Contract != address(0)) 
            revert Inventory_UnequippingPermanentSlot();
        if (existingItem.erc721Contract == item.erc721Contract && existingItem.id == item.id)
            revert Inventory_ItemAlreadyEquippedInSlot();

        if (inventorySL.equippedItems[arcadianId][slotId].erc721Contract != address(0))
            _unequipUnchecked(arcadianId, slotId);

        IERC1155 erc1155Contract = IERC1155(item.erc721Contract);
        if (erc1155Contract.balanceOf(msg.sender, item.id) < 1)
            revert Inventory_InsufficientItemBalance();

        erc1155Contract.safeTransferFrom(
            msg.sender,
            address(this),
            item.id,
            1,
            ''
        );

        inventorySL.equippedItems[arcadianId][slotId] = item;
    }

    function _baseSlotsEquipped(uint arcadianId) internal view returns (bool) {
        InventoryStorage.Layout storage inventorySL = InventoryStorage.layout();
        uint numSlots = inventorySL.numSlots;
        for (uint i = 0; i < numSlots; i++) {
            uint slotId = i + 1;
            if (!inventorySL.slots[slotId].isBase)
                continue;
            if (inventorySL.slots[slotId].isBase && inventorySL.equippedItems[arcadianId][slotId].erc721Contract == address(0)) {
                return false;
            }
        }
        return true;
    }

    function _unequipUnchecked(
        uint arcadianId,
        uint slotId
    ) internal {
        InventoryStorage.Layout storage inventorySL = InventoryStorage.layout();
        InventoryStorage.Item storage existingItem = inventorySL.equippedItems[arcadianId][slotId];

        IERC1155 erc1155Contract = IERC1155(existingItem.erc721Contract);
        erc1155Contract.safeTransferFrom(
            address(this),
            msg.sender,
            existingItem.id,
            1,
            ''
        );
        delete inventorySL.equippedItems[arcadianId][slotId];
    }

    function _unequipSingleSlot(
        uint arcadianId,
        uint slotId
    ) internal onlyValidSlot(slotId) {
        InventoryStorage.Layout storage inventorySL = InventoryStorage.layout();

        if (inventorySL.slots[slotId].permanent) 
            revert Inventory_UnequippingPermanentSlot();

        if (inventorySL.equippedItems[arcadianId][slotId].erc721Contract == address(0)) 
            revert Inventory_UnequippingEmptySlot();
        
        if (inventorySL.slots[slotId].isBase)
            revert Inventory_UnequippingBaseSlot();

        _unequipUnchecked(arcadianId, slotId);
    }

    function _unequip(
        uint arcadianId,
        uint[] calldata slotIds
    ) internal onlyArcadianOwner(arcadianId) {

        if (slotIds.length == 0) 
            revert Inventory_SlotNotSpecified();

        for (uint i = 0; i < slotIds.length; i++) {
            _unequipSingleSlot(arcadianId, slotIds[i]);
        }

        _hashBaseItemsUnchecked(arcadianId);

        emit ItemsUnequipped(
            msg.sender,
            arcadianId,
            slotIds
        );
    }

    function _equipped(
        uint arcadianId,
        uint slotId
    ) internal view returns (ItemInSlot memory) {
        InventoryStorage.Item storage item = InventoryStorage.layout().equippedItems[arcadianId][slotId];
        return ItemInSlot(slotId, item.erc721Contract, item.id);
    }

    function _equippedBatch(
        uint arcadianId,
        uint[] calldata slotIds
    ) internal view returns (ItemInSlot[] memory equippedSlots) {
        InventoryStorage.Layout storage inventorySL = InventoryStorage.layout();
        equippedSlots = new ItemInSlot[](slotIds.length);
        for (uint i = 0; i < slotIds.length; i++) {
            InventoryStorage.Item storage equippedItem = inventorySL.equippedItems[arcadianId][slotIds[i]];
            equippedSlots[i] = ItemInSlot(slotIds[i], equippedItem.erc721Contract, equippedItem.id);
        }
    }

    function _equippedAll(
        uint arcadianId
    ) internal view returns (ItemInSlot[] memory equippedSlots) {
        InventoryStorage.Layout storage inventorySL = InventoryStorage.layout();
        uint numSlots = inventorySL.numSlots;
        equippedSlots = new ItemInSlot[](numSlots);
        for (uint i = 0; i < numSlots; i++) {
            uint slot = i + 1;
            InventoryStorage.Item storage equippedItem = inventorySL.equippedItems[arcadianId][slot];
            equippedSlots[i] = ItemInSlot(slot, equippedItem.erc721Contract, equippedItem.id);
        }
    }

    function _isArcadianUnique(
        uint arcadianId,
        InventoryStorage.Item[] calldata items
    ) internal view returns (bool) {

        InventoryStorage.Layout storage inventorySL = InventoryStorage.layout();
        uint numSlots = inventorySL.numSlots;

        bytes memory encodedItems;
        for (uint i = 0; i < numSlots; i++) {
            uint slotId = i + 1;
            if (!inventorySL.slots[slotId].isBase)
                continue;

            InventoryStorage.Item memory item;
            for (uint j = 0; j < items.length; j++) {
                if (_allowedSlot(items[j]) == slotId) {
                    item = items[j];
                    break;
                }
            }
            if (item.erc721Contract == address(0)) {
                if (inventorySL.equippedItems[arcadianId][slotId].erc721Contract != address(0)) {
                    item = inventorySL.equippedItems[arcadianId][slotId];
                } else {
                    revert Inventory_NotAllBaseSlotsEquipped();
                }
            }
            
            encodedItems = abi.encodePacked(encodedItems, slotId, item.erc721Contract, item.id);
        }

        return !inventorySL.baseItemsHashes.contains(keccak256(encodedItems));
    }

    function _hashBaseItemsUnchecked(
        uint arcadianId
    ) internal returns (bool isUnique) {
        InventoryStorage.Layout storage inventorySL = InventoryStorage.layout();
        bytes memory encodedItems;
        uint numSlots = inventorySL.numSlots;

        for (uint i = 0; i < numSlots; i++) {
            uint slotId = i + 1;
            if (!inventorySL.slots[slotId].isBase)
                continue;
            InventoryStorage.Item storage equippedItem = inventorySL.equippedItems[arcadianId][slotId];
            encodedItems = abi.encodePacked(encodedItems, slotId, equippedItem.erc721Contract, equippedItem.id);
        }

        bytes32 baseItemsHash = keccak256(encodedItems);
        isUnique = !inventorySL.baseItemsHashes.contains(baseItemsHash);
        inventorySL.baseItemsHashes.remove(inventorySL.arcadianToBaseItemHash[arcadianId]);
        inventorySL.baseItemsHashes.add(baseItemsHash);
        inventorySL.arcadianToBaseItemHash[arcadianId] = baseItemsHash;
    }

    function _createSlot(
        bool permanent,
        bool isBase,
        InventoryStorage.Item[] calldata allowedItems
    ) internal {
        InventoryStorage.Layout storage inventorySL = InventoryStorage.layout();

        // slots are 1-index
        inventorySL.numSlots += 1;
        uint newSlot = inventorySL.numSlots;
        inventorySL.slots[newSlot].permanent = permanent;
        inventorySL.slots[newSlot].isBase = isBase;
        inventorySL.slots[newSlot].id = newSlot;

        if (allowedItems.length > 0) {
            _allowItemsInSlot(newSlot, allowedItems);
        }

        emit SlotCreated(msg.sender, newSlot, permanent, isBase);
    }

    function _setSlotBase(
        uint slotId,
        bool isBase
    ) internal onlyValidSlot(slotId) {
        InventoryStorage.layout().slots[slotId].isBase = isBase;
    }

    function _setSlotPermanent(
        uint slotId,
        bool permanent
    ) internal onlyValidSlot(slotId) {
        InventoryStorage.layout().slots[slotId].permanent = permanent;
    }

    function _addBaseModifierCoupons(
        address account,
        uint[] calldata slotIds,
        uint[] calldata amounts
    ) internal {
        if (slotIds.length != amounts.length)
            revert Inventory_InputDataMismatch();

        InventoryStorage.Layout storage inventorySL = InventoryStorage.layout();
        uint numSlots = inventorySL.numSlots;

        for (uint i = 0; i < slotIds.length; i++) {
            if (slotIds[i] == 0 && slotIds[i] > numSlots) 
                revert Inventory_InvalidSlotId();
            if (!inventorySL.slots[slotIds[i]].isBase) {
                revert Inventory_NonBaseSlot();
            }
            InventoryStorage.layout().baseModifierCoupon[account][slotIds[i]] += amounts[i];
        }

        emit BaseModifierCouponAdded(msg.sender, account, slotIds, amounts);
    }

    function _getbaseModifierCoupon(address account, uint slotId) internal view onlyValidSlot(slotId) returns (uint) {
        if (!InventoryStorage.layout().slots[slotId].isBase) {
            revert Inventory_NonBaseSlot();
        }
        return InventoryStorage.layout().baseModifierCoupon[account][slotId];
    }

    function _getBaseModifierCouponAll(address account) internal view returns (BaseModifierCoupon[] memory) {
        InventoryStorage.Layout storage inventorySL = InventoryStorage.layout();

        uint numSlots = inventorySL.numSlots;

        uint baseCounter;
        for (uint i = 0; i < numSlots; i++) {
            uint slotId = i + 1;
            if (inventorySL.slots[slotId].isBase) {
                baseCounter++;
            }
        }

        BaseModifierCoupon[] memory coupons = new BaseModifierCoupon[](baseCounter);
        uint counter;
        for (uint i = 0; i < numSlots; i++) {
            uint slotId = i + 1;
            if (!inventorySL.slots[slotId].isBase)
                continue;
            coupons[counter].slotId = slotId;
            coupons[counter].amount = inventorySL.baseModifierCoupon[account][slotId];
            counter++;
        }
        return coupons;
    }

    function _allowItemsInSlot(
        uint slotId,
        InventoryStorage.Item[] calldata items
    ) internal virtual onlyValidSlot(slotId) {
        InventoryStorage.Layout storage inventorySL = InventoryStorage.layout();

        for (uint i = 0; i < items.length; i++) {
            if (!items[i].erc721Contract.isContract()) 
                revert Inventory_InvalidERC1155Contract();

            uint currentAllowedSlot = inventorySL.itemSlot[items[i].erc721Contract][items[i].id];
            if (currentAllowedSlot > 0 && currentAllowedSlot != slotId) {
                _disallowItemInSlotUnchecked(currentAllowedSlot, items[i]);
            }
            inventorySL.allowedItems[slotId].push(items[i]);
            inventorySL.itemSlot[items[i].erc721Contract][items[i].id] = slotId;
        }

        emit ItemsAllowedInSlotUpdated(msg.sender, slotId);
    }

    function _disallowItemsInSlot(
        uint slotId,
        InventoryStorage.Item[] calldata items
    ) internal virtual onlyValidSlot(slotId) {
        
        for (uint i = 0; i < items.length; i++) {
            _disallowItemInSlotUnchecked(slotId, items[i]);
        }

        emit ItemsAllowedInSlotUpdated(msg.sender, slotId);
    }

    function _disallowItemInSlotUnchecked(
        uint slotId,
        InventoryStorage.Item calldata item
    ) internal virtual {
        InventoryStorage.Layout storage inventorySL = InventoryStorage.layout();
        
        uint numAllowedSlots = inventorySL.allowedItems[slotId].length;
        for (uint i = 0; i < numAllowedSlots; i++) {
            if (inventorySL.allowedItems[slotId][i].id == item.id) {
                inventorySL.allowedItems[slotId][i] = inventorySL.allowedItems[slotId][numAllowedSlots-1];
                inventorySL.allowedItems[slotId].pop();
                break;
            }
        }
        
        delete inventorySL.itemSlot[item.erc721Contract][item.id];
    }

    function _allowedSlot(InventoryStorage.Item calldata item) internal view returns (uint) {
        return InventoryStorage.layout().itemSlot[item.erc721Contract][item.id];
    }

    function _allowedItem(uint slotId, uint index) internal view onlyValidSlot(slotId) returns (InventoryStorage.Item memory) {
        return InventoryStorage.layout().allowedItems[slotId][index];
    }

    function _numAllowedItems(uint slotId) internal view onlyValidSlot(slotId) returns (uint) {
        return InventoryStorage.layout().allowedItems[slotId].length;
    }

    function _slot(uint slotId) internal view returns (InventoryStorage.Slot storage slot) {
        return InventoryStorage.layout().slots[slotId];
    }

    function _slotsAll() internal view returns (InventoryStorage.Slot[] memory slotsAll) {
        InventoryStorage.Layout storage inventorySL = InventoryStorage.layout();
        
        uint numSlots = inventorySL.numSlots;
        slotsAll = new InventoryStorage.Slot[](numSlots);

        for (uint i = 0; i < numSlots; i++) {
            uint slotId = i + 1;
            slotsAll[i] = inventorySL.slots[slotId];
        }
    }
}