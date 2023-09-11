// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MyContract {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadlin;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign)  public campaigns;

    uint256 public numberOfCampaigns = 0;
    constructor() {}
}