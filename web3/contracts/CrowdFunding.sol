// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MyContract {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign)  public campaigns;

    uint256 public numberOfCampaigns = 0;

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Campaign storage compaign = compaigns[numberOfCampaigns];

        require(compaign.deadline < block.timestamp, "The deadline should be a date in futute");

        compaign.owner = _owner;
        compaign.title = _title;
        compaign.description = _description;
        compaign.target = _target;
        compaign.deadline = _deadline;
        compaign.amountCollected = 0;
        compaign.image = _image;
        
        numberOfCampaigns++;

        return numberOfCampaigns-1;
    }

    function donateTocompaign (uint256 _id) public payable {
        uint256 amount = msg.value;

        Compaign storage compaign = compaigns[_id];

        compaign.donators.push(msg.sender);
        campaigns.donations.push(amount);

        (bool sent, ) = payable(compaign.owner).call{value: amount}("");

        if(sent) {
            compaign.amountCollected = compaign.amountCollected + amount;
        }

    }

    function getDonators(uint256 _id) view public return(address[] memory, uint256[] memory){

        return (compaigns[_id].donators, compaigns[_id].donations);
    }

    function getCompaigns() public view return (Compaign[] memory) {
        Campaign[] memory allCompaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i< numberOfCampaigns; i++) {
            Compaign storage item = compaigns[i];

            allCompaigns[i] = item;
        }

        return allCompaigns;
    }
    
}