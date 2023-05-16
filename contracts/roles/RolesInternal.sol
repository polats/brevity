// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import { AccessControlInternal } from "@solidstate/contracts/access/access_control/AccessControlInternal.sol";
import { AccessControlStorage } from "@solidstate/contracts/access/access_control/AccessControlStorage.sol";
import { RolesStorage } from './RolesStorage.sol';

contract RolesInternal is AccessControlInternal {

    error Roles_MissingAdminRole();
    error Roles_MissingManagerRole();
    error Roles_MissingAutomationRole();

    modifier onlyDefaultAdmin() {
        if (!_hasRole(_defaultAdminRole(), msg.sender))
            revert Roles_MissingAdminRole();
        _;
    }

    modifier onlyManager() {
        if (!_hasRole(_managerRole(), msg.sender))
            revert Roles_MissingManagerRole();
        _;
    }

    modifier onlyAutomation() {
        if (!_hasRole(_managerRole(), msg.sender) && !_hasRole(_automationRole(), msg.sender))
            revert Roles_MissingAutomationRole();
        _;
    }

    function _defaultAdminRole() internal pure returns (bytes32) {
        return AccessControlStorage.DEFAULT_ADMIN_ROLE;
    }

    function _managerRole() internal view returns (bytes32) {
        return RolesStorage.layout().managerRole;
    }

    function _automationRole() internal view returns (bytes32) {
        return RolesStorage.layout().automationRole;
    }

    function _initRoles() internal {
        RolesStorage.Layout storage rolesSL = RolesStorage.layout();
        rolesSL.managerRole = keccak256("manager.role");
        rolesSL.automationRole = keccak256("automation.role");

        _grantRole(_defaultAdminRole(), msg.sender);
        _grantRole(_managerRole(), msg.sender);
    }
}