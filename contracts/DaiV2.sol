// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Dai} from "./Dai.sol";

contract DaiV2 is Dai {
    event BuildBearDAIV2Event(string data);

    constructor(uint256 chainId) Dai(chainId) {}

    function transferFrom(address src, address dst, uint256 wad) public override returns (bool) {
        super.transferFrom(src, dst, wad);
        emit BuildBearDAIV2Event("buildbear capture");
        return true;
    }
}
