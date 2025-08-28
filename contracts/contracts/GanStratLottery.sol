// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GanStratLottery {
    // État de la loterie
    address public owner;
    uint256 public ticketPrice = 0.001 ether; // Prix en ETH/BONE
    uint256 public currentLotteryId;
    uint256 public prizePool;
    
    // Structure d'un ticket
    struct Ticket {
        uint256[5] numbers;
        uint256[2] stars;
        address player;
        uint256 lotteryId;
    }
    
    // Structure d'un tirage
    struct Draw {
        uint256 id;
        uint256[5] winningNumbers;
        uint256[2] winningStars;
        uint256 totalPrize;
        uint256 timestamp;
        bool isDrawn;
    }
    
    // Stockage
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => Draw) public draws;
    mapping(address => uint256[]) public playerTickets;
    
    uint256 public ticketCounter;
    
    // Events
    event TicketPurchased(address indexed player, uint256 ticketId, uint256 lotteryId);
    event DrawExecuted(uint256 indexed lotteryId, uint256[5] numbers, uint256[2] stars);
    event WinnerPaid(address indexed winner, uint256 amount);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        currentLotteryId = 1;
    }
    
    // Acheter un ticket
    function buyTicket(uint256[5] memory _numbers, uint256[2] memory _stars) external payable {
        require(msg.value == ticketPrice, "Incorrect ticket price");
        require(validateNumbers(_numbers, _stars), "Invalid numbers");
        
        ticketCounter++;
        
        tickets[ticketCounter] = Ticket({
            numbers: _numbers,
            stars: _stars,
            player: msg.sender,
            lotteryId: currentLotteryId
        });
        
        playerTickets[msg.sender].push(ticketCounter);
        prizePool += msg.value;
        
        emit TicketPurchased(msg.sender, ticketCounter, currentLotteryId);
    }
    
    // Valider les numéros
    function validateNumbers(uint256[5] memory _numbers, uint256[2] memory _stars) private pure returns (bool) {
        // Vérifier que les numéros sont entre 1 et 49
        for (uint i = 0; i < 5; i++) {
            if (_numbers[i] < 1 || _numbers[i] > 49) return false;
            // Vérifier les doublons
            for (uint j = i + 1; j < 5; j++) {
                if (_numbers[i] == _numbers[j]) return false;
            }
        }
        
        // Vérifier que les étoiles sont entre 1 et 12
        for (uint i = 0; i < 2; i++) {
            if (_stars[i] < 1 || _stars[i] > 12) return false;
        }
        if (_stars[0] == _stars[1]) return false;
        
        return true;
    }
    
    // Exécuter le tirage (simplifié - en production utiliser Chainlink VRF)
    function executeDraw() external onlyOwner {
        require(!draws[currentLotteryId].isDrawn, "Draw already executed");
        
        // Générer des numéros pseudo-aléatoires (PAS SECURE - juste pour le test)
        uint256[5] memory winningNumbers;
        uint256[2] memory winningStars;
        
        // Génération simplifiée pour le test
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, prizePool)));
        
        for (uint i = 0; i < 5; i++) {
            winningNumbers[i] = (seed % 49) + 1;
            seed = uint256(keccak256(abi.encodePacked(seed)));
        }
        
        for (uint i = 0; i < 2; i++) {
            winningStars[i] = (seed % 12) + 1;
            seed = uint256(keccak256(abi.encodePacked(seed)));
        }
        
        draws[currentLotteryId] = Draw({
            id: currentLotteryId,
            winningNumbers: winningNumbers,
            winningStars: winningStars,
            totalPrize: prizePool,
            timestamp: block.timestamp,
            isDrawn: true
        });
        
        emit DrawExecuted(currentLotteryId, winningNumbers, winningStars);
        
        // Préparer la prochaine loterie
        currentLotteryId++;
        prizePool = 0;
    }
    
    // Récupérer les numéros gagnants
    function getWinningNumbers(uint256 _lotteryId) external view returns (uint256[5] memory, uint256[2] memory) {
        require(draws[_lotteryId].isDrawn, "Draw not yet executed");
        return (draws[_lotteryId].winningNumbers, draws[_lotteryId].winningStars);
    }
    
    // Récupérer les tickets d'un joueur
    function getPlayerTickets(address _player) external view returns (uint256[] memory) {
        return playerTickets[_player];
    }
    
    // Récupérer les détails d'un ticket
    function getTicket(uint256 _ticketId) external view returns (
        uint256[5] memory numbers,
        uint256[2] memory stars,
        address player,
        uint256 lotteryId
    ) {
        Ticket memory ticket = tickets[_ticketId];
        return (ticket.numbers, ticket.stars, ticket.player, ticket.lotteryId);
    }
    
    // Fonction de retrait pour le owner (simplifié)
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    // Obtenir le solde du contrat
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}