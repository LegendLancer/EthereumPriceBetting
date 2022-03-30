pragma solidity ^0.8.2;
// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "hardhat/console.sol";

interface AggregatorV3Interface {
    function decimals() external view returns (uint8);

    function description() external view returns (string memory);

    function version() external view returns (uint256);

    function getRoundData(uint80 _roundId)
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

contract PriceBet is Initializable, OwnableUpgradeable {
    // price oracle
    AggregatorV3Interface public oracle;

    enum Position {
        Bull,
        Bear,
        House
    }

    enum Status {
        NOT_INITIATED,
        ONGOING,
        FINISHED
    }

    struct BetInfo {
        Position position;
        address addr;
        uint256 reserveAmount;
        uint256 depositAmount;
        uint256 reward;
        bool claimed;
    }

    BetInfo private better1;
    BetInfo private better2;

    // bet info
    uint256 private totalEtherLocked;
    uint256 public pivotPrice;
    uint256 public endTimestamp;
    Status public betStatus;

    // events
    event Deposit(address indexed better, uint256 amount);
    event Withdraw(address indexed winner, uint256 amount);
    event BetInitiated(uint256 initTime);

    // modifers
    modifier onlyBetter() {
        require(
            msg.sender == better1.addr || msg.sender == better2.addr,
            "NOT_AN_ALLOWED_BETTER"
        );
        _;
    }

    function initialize(
        address[2] memory _betAddrs,
        uint256[2] memory _betReserveAmounts,
        Position[2] memory _betPosition,
        uint256 _endTimestamp,
        uint256 _pivotPrice
    ) public initializer {
        oracle = AggregatorV3Interface(
            0x0715A7794a1dc8e42615F059dD6e406A6594651A
        );
        better1 = BetInfo(
            _betPosition[0],
            _betAddrs[0],
            _betReserveAmounts[0],
            0,
            0,
            false
        );
        better2 = BetInfo(
            _betPosition[1],
            _betAddrs[1],
            _betReserveAmounts[1],
            0,
            0,
            false
        );
        endTimestamp = _endTimestamp;
        pivotPrice = _pivotPrice;
        betStatus = Status.NOT_INITIATED;
        OwnableUpgradeable.__Ownable_init();
    }

    function getBetInfo(address better) public view returns (BetInfo memory) {
        if (better == better1.addr) return better1;
        else if (better == better2.addr) return better2;
        return BetInfo(Position.House, address(0), 0, 0, 0, false);
    }

    function getEthereumPrice() public view returns (uint256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = oracle.latestRoundData();
        return uint256(price);
    }

    function deposit() external payable onlyBetter {
        require(msg.value > 0, "BET_AMOUNT_ZERO");
        require(
            betStatus == Status.NOT_INITIATED && block.timestamp < endTimestamp,
            "BET_ALREADY_INITIATED"
        );

        BetInfo storage currentBet = better1;
        if (msg.sender == better1.addr) currentBet = better1;
        else if (msg.sender == better2.addr) currentBet = better2;

        require(
            currentBet.depositAmount == 0 &&
                currentBet.reserveAmount <= msg.value,
            "DEPOSIT_FAILED"
        );

        currentBet.depositAmount = msg.value;
        totalEtherLocked += msg.value;

        if (better1.reserveAmount + better2.reserveAmount <= totalEtherLocked) {
            betStatus = Status.ONGOING;
            emit BetInitiated(block.timestamp);
        }

        emit Deposit(msg.sender, currentBet.depositAmount);
    }

    function execute() external onlyOwner {
        require(block.timestamp >= endTimestamp, "BET_NOT_FINISHED_YET");
        require(betStatus == Status.ONGOING, "BET_SHOULD_BE_ONGOING");

        uint256 lockPrice = getEthereumPrice();
        Position winnerPos;
        winnerPos = lockPrice > pivotPrice
            ? Position.Bull
            : (lockPrice == pivotPrice ? Position.House : Position.Bear);

        betStatus = Status.FINISHED;

        if (better1.position == better2.position) {
            // if both wins
            if (better1.position == winnerPos) {
                better1.reward = better1.depositAmount;
                better2.reward = better2.depositAmount;
            }
        } else {
            // if better1 wins
            if (better1.position == winnerPos) {
                better1.reward = totalEtherLocked;
            }
            // if better2 wins
            else {
                better2.reward = totalEtherLocked;
            }
        }
    }

    function withdraw() external onlyBetter {
        require(
            (betStatus == Status.NOT_INITIATED &&
                block.timestamp > endTimestamp) ||
                (betStatus == Status.FINISHED),
            "UNABLE_TO_WITHDRAW"
        );

        uint256 value = 0;
        if (msg.sender == better1.addr && better1.claimed == false) {
            better1.claimed = true;
            value = better1.reward;
        } else if (msg.sender == better2.addr && better1.claimed == false) {
            better1.claimed = true;
            value = better2.reward;
        }
        sendReward(msg.sender, value);

        emit Withdraw(msg.sender, value);
    }

    function sendReward(address addr, uint256 value) internal {
        require(value > 0, "WITHDRAW_AMOUNT_ZERO");
        (bool success, ) = addr.call{value: value}("");
        require(success, "TRANSFER_REWARD_FAILED");
    }

    receive() external payable {
        revert("Cannot send ether to this contract");
    }
}
