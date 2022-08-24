// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract SimpleStorage {
    uint256 public number = 0;

    function incr_number() public {
        number++;
    }
}
