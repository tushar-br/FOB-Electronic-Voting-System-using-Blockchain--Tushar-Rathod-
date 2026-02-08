import hashlib
import time
import json

class Block:
    def __init__(self, index, timestamp, voter_id, candidate, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.voter_id = voter_id  # This will be hashed for privacy in the chain
        self.candidate = candidate
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        # Create a string representation of the block (excluding the hash itself)
        # Using json.dumps ensures a consistent string format for hashing
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "voter_id": self.voter_id,
            "candidate": self.candidate,
            "previous_hash": self.previous_hash
        }, sort_keys=True)
        
        # Calculate SHA-256 hash
        return hashlib.sha256(block_string.encode()).hexdigest()

    def to_dict(self):
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "voter_id": self.voter_id,
            "candidate": self.candidate,
            "previous_hash": self.previous_hash,
            "hash": self.hash
        }

class Blockchain:
    def __init__(self):
        self.chain = []
        self.create_genesis_block()

    def create_genesis_block(self):
        # The first block in a blockchain is the Genesis Block
        # It has no previous hash (or arbitrary string like "0")
        genesis_block = Block(0, time.time(), "GENESIS", "System Initialization", "0")
        self.chain.append(genesis_block)
        print("Blockchain Initialized with Genesis Block")

    def get_latest_block(self):
        return self.chain[-1]

    def add_vote(self, voter_id, candidate):
        # 1. Check if voter has already voted (simple check based on hashed ID in chain)
        # In a real system, this would be more complex (e.g., separate voter registry)
        voter_hash = hashlib.sha256(voter_id.encode()).hexdigest()
        
        for block in self.chain:
            if block.voter_id == voter_hash:
                return False, "Error: Voter has already cast a vote."

        # 2. Create new block
        previous_block = self.get_latest_block()
        new_block = Block(
            index=previous_block.index + 1,
            timestamp=time.time(),
            voter_id=voter_hash,  # Store hash of ID for simple anonymity
            candidate=candidate,
            previous_hash=previous_block.hash
        )

        # 3. Add to chain (immutability starts here)
        self.chain.append(new_block)
        
        # 4. Display blockchain contents in terminal (as requested)
        self.print_chain()
        
        return True, "Vote recorded successfully on blockchain"

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i-1]

            # Check if current block's hash is valid
            if current_block.hash != current_block.calculate_hash():
                return False
            
            # Check if current block points to the correct previous block
            if current_block.previous_hash != previous_block.hash:
                return False
        return True

    def print_chain(self):
        print("\n--- Current Blockchain State ---")
        for block in self.chain:
            print(json.dumps(block.to_dict(), indent=4))
        print("--------------------------------\n")
