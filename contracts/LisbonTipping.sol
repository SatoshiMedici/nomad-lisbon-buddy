// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title LisbonTipping
/// @notice On-chain tipping contract for the Nomad Lisbon Buddy app.
///         Users send ETH tips with optional messages. Tipping at least
///         0.001 ETH unlocks premium local content (token-gating).
contract LisbonTipping {
    address public owner;
    uint256 public constant PREMIUM_THRESHOLD = 0.001 ether;

    struct Tip {
        address sender;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    Tip[] public tips;
    mapping(address => uint256) public totalTippedBy;

    event TipSent(address indexed sender, uint256 amount, string message, uint256 timestamp);
    event Withdrawn(address indexed owner, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    /// @notice Send a tip with an optional message
    function sendTip(string calldata message) external payable {
        require(msg.value > 0, "Tip must be greater than 0");
        tips.push(
            Tip({
                sender: msg.sender,
                amount: msg.value,
                message: message,
                timestamp: block.timestamp
            })
        );
        totalTippedBy[msg.sender] += msg.value;
        emit TipSent(msg.sender, msg.value, message, block.timestamp);
    }

    /// @notice Total number of tips received
    function getTipCount() external view returns (uint256) {
        return tips.length;
    }

    /// @notice Get a specific tip by index
    function getTip(uint256 index)
        external
        view
        returns (address sender, uint256 amount, string memory message, uint256 timestamp)
    {
        require(index < tips.length, "Index out of bounds");
        Tip memory tip = tips[index];
        return (tip.sender, tip.amount, tip.message, tip.timestamp);
    }

    /// @notice Check if an address has unlocked premium content
    function hasPremiumAccess(address user) external view returns (bool) {
        return totalTippedBy[user] >= PREMIUM_THRESHOLD;
    }

    /// @notice Withdraw all collected tips (owner only)
    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
        emit Withdrawn(owner, balance);
    }
}
