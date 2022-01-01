// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Posts {
    uint256 totalPosts;
    event NewPost(address indexed from, uint256 timestamp, string message);

    struct Post {
        address sender;
        string message;
        string title;
        string img;
        string desc;
        uint256 timestamp;
    }

    Post[] posts;

    constructor() {
        console.log("I AM ALIVE");
    }

    function post(string memory _message, string memory _title, string memory _img, string memory _desc) public {
        totalPosts += 1;
        console.log("%s has waved!", msg.sender);

        posts.push(Post(msg.sender, _message, _title, _img, _desc, block.timestamp));

        emit NewPost(msg.sender, block.timestamp, _message);
    }

    function getAllPosts() public view returns (Post[] memory) {
        return posts;
    }

    function getTotalPosts() public view returns (uint256) {
        console.log("We have %d total posts!", totalPosts);
        return totalPosts;
    }
}