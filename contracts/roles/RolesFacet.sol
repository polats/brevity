// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import { AccessControl } from "@solidstate/contracts/access/access_control/AccessControl.sol";
import { RolesInternal } from './RolesInternal.sol';
/**
 * @title RolesFacet
 * @notice This contract provides external functions to retrieve the role IDs used by the AccessControl contract.
 * The contract extends the RolesInternal contract which provides internal functions to manage roles.
 * This contract can be used as a facet of a diamond which follows the EIP-2535 diamond standard
 */
contract RolesFacet is RolesInternal, AccessControl {
    /**
     * @notice Returns the ID of the default admin role
     * @return The ID of the default admin role
     */
    function defaultAdminRole() external pure returns (bytes32) {
        return _defaultAdminRole();
    }

    /**
     * @notice Returns the ID of the manager role
     * @return The ID of the manager role
     */
    function managerRole() external view returns (bytes32) {
        return _managerRole();
    }

    /**
     * @notice Returns the ID of the automation role
     * @return The ID of the automation role
     */
    function automationRole() external view returns (bytes32) {
        return _automationRole();
    }
}