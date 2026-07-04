// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title LisbonTipping
/// @notice On-chain tipping contract for the Nomad Lisbon Buddy app.
///         Deployed on 0G Network mainnet. Tips are paid in 0G tokens
///         (the native gas token). The deployer becomes the recipient —
///         all tips go to them. Tipping at least 0.1 0G unlocks premium
///         local content (token-gating).
contract LisbonTipping {
    address public immutable recipient;
    uint256 public constant PREMIUM_THRESHOLD = 0.1 ether;

    struct Tip {
        address sender;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    Tip[] public tips;
    mapping(address => uint256) public totalTippedBy;

    event TipSent(address indexed sender, uint256 amount, string message, uint256 timestamp);
    event Withdrawn(address indexed recipient, uint256 amount);

    constructor() {
        recipient = msg.sender;
    }

    /// @notice Send a tip in 0G tokens with an optional message
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

    /// @notice Withdraw all collected 0G tokens (recipient only)
    function withdraw() external {
        require(msg.sender == recipient, "Only recipient can withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success, ) = recipient.call{value: balance}("");
        require(success, "Withdrawal failed");
        emit Withdrawn(recipient, balance);
    }
}
