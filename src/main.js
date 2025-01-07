import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.6.4/dist/ethers.esm.min.js";

let userWalletAddress = null;
let provider;
let signer;
let contract;

// Contract Address and ABI (example, replace with your own)
const contractAddress = "0x71D5136Db74A5620633296a017A233d69091739C";
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "proposalId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "name": "ProposalCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "proposalId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "newName",
        "type": "string"
      }
    ],
    "name": "ProposalEdited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "proposalId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      }
    ],
    "name": "VoteUndone",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "proposalId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      }
    ],
    "name": "Voted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "startDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endDate",
        "type": "uint256"
      }
    ],
    "name": "createProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "proposalId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "newName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "newDescription",
        "type": "string"
      }
    ],
    "name": "editProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllProposals",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "voteCount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "startDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "endDate",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          }
        ],
        "internalType": "struct Voting.Proposal[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "proposalId",
        "type": "uint256"
      }
    ],
    "name": "getProposal",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "startDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endDate",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalProposals",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "proposals",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "startDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endDate",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "proposalId",
        "type": "uint256"
      }
    ],
    "name": "undoVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "proposalId",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Attach event listeners
document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("proposalForm").addEventListener("submit", submitProposal);

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask!");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();

  try {
    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });
    userWalletAddress = await signer.getAddress();
    document.getElementById("walletAddress").textContent = `Connected Wallet: ${userWalletAddress}`;

    // Initialize contract
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    alert("Wallet connected successfully!");
    loadProposals(); // Load proposals after connecting the wallet
  } catch (error) {
    console.error("Error connecting wallet:", error);
    alert("Connection failed. Please try again.");
  }
}

async function submitProposal(event) {
  event.preventDefault();

  const name = document.getElementById("proposalName").value;
  const description = document.getElementById("description").value;
  const startDate = parseInt(document.getElementById("startDate").value);
  const endDate = parseInt(document.getElementById("endDate").value);

  if (!name || !description || isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
    alert("Please fill out all fields correctly. Ensure start date is before end date.");
    return;
  }

  try {
    const tx = await contract.createProposal(name, description, startDate, endDate);
    await tx.wait();
    alert("Proposal submitted successfully!");
    loadProposals(); // Refresh the proposal list after submission
  } catch (error) {
    console.error("Error submitting proposal:", error);
    alert("Failed to submit the proposal.");
  }
}

async function loadProposals() {
  if (!contract) {
    return;
  }

  try {
    const proposals = await contract.getAllProposals();

    const proposalListContainer = document.getElementById("proposalList");
    proposalListContainer.innerHTML = ""; // Clear previous content

    // Create an Intl.DateTimeFormat instance for Indonesian locale
    const indonesianDateFormatter = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    proposals.forEach((proposal, index) => {
      const proposalCard = document.createElement("div");
      proposalCard.classList.add("card", "proposal-card");

      const startDate = indonesianDateFormatter.format(new Date(proposal.startDate * 1000));
      const endDate = indonesianDateFormatter.format(new Date(proposal.endDate * 1000));

      proposalCard.innerHTML = `
      <div class="card-header">
        <h5>${proposal.name}</h5>
      </div>
      <div class="card-body">
        <p class="card-text">${proposal.description}</p>
        <p class="card-text">
          <strong>Start Date:</strong> ${startDate}
        </p>
        <p class="card-text">
          <strong>End Date:</strong> ${endDate}
        </p>
        <p class="card-text">
          <strong>Creator:</strong> ${proposal.creator}
        </p>
      </div>
      <div class="card-footer">
        <button class="btn btn-primary" onclick="vote(${index})">Vote</button>
        <button class="btn btn-danger" onclick="unvote(${proposal.proposalId})">Unvote</button> <!-- Add Unvote button -->
      </div>
    `;

      proposalListContainer.appendChild(proposalCard);
    });
  } catch (error) {
    console.error(error);
    alert("Failed to load proposals.");
  }
}

// Load proposals when the page loads
window.addEventListener("load", loadProposals);

window.vote = async function vote(proposalId) {
  try {
    const tx = await contract.vote(proposalId);
    await tx.wait(); // Wait for the transaction to be mined
    alert("Vote successful!");
    loadProposals(); // Refresh the proposal list
  } catch (error) {
    console.error(error);
    alert("Failed to vote.");
  }
}


window.unvote = async function unvote(proposalId) {
  try {
    const tx = await contract.undoVote(proposalId);
    await tx.wait(); // Wait for the transaction to be mined
    alert("Vote undone successfully!");
    loadProposals(); // Refresh the proposal list to update vote counts
  } catch (error) {
    console.error(error);
    alert("Failed to undo the vote.");
  }
}