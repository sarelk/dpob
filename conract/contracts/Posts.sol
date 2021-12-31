// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Posts {
    uint256 public postsCount;
    mapping(uint256 => Post) public posts;
    event NewPost(uint256 id, address indexed from, uint256 timestamp, string message);

    struct Post {
        uint256 id;
        address sender;
        string message;
        string title;
        string img;
        string desc;
        uint256 timestamp;
    }

    constructor() {
        postsCount=0;
    }

    function post(string memory _message, string memory _title, string memory _img, string memory _desc) public {
        postsCount += 1;
        posts[postsCount] = Post(postsCount,msg.sender, _message, _title, _img, _desc, block.timestamp);
        emit NewPost(postsCount,msg.sender, block.timestamp, _message);
    }

    function getpostsCount() public view returns (uint256) {
        return postsCount;
    }
}