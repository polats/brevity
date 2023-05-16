// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

library RolesStorage {

    bytes32 constant ROLES_STORAGE_POSITION =
        keccak256("roles.storage.position");

    struct Layout {
        bytes32 managerRole;
        bytes32 automationRole;
    }

    function layout()
        internal
        pure
        returns (Layout storage es)
    {
        bytes32 position = ROLES_STORAGE_POSITION;
        assembly {
            es.slot := position
        }
    }
}