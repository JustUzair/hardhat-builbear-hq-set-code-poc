// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Dai} from "./Dai.sol";

contract DaiV2 is Dai {
    event BuildBearDAIV2Event(string data);

    constructor(uint256 chainId) Dai(chainId) {
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("DaiV2")),
                keccak256("1"),
                chainId,
                address(this)
            )
        );
    }

    function transferFrom(address src, address dst, uint256 wad) public override returns (bool) {
        super.transferFrom(src, dst, wad);
        emit BuildBearDAIV2Event("buildbear capture");
        return true;
    }

    function getVersion() public pure returns (uint256) {
        return 2;
    }
}
