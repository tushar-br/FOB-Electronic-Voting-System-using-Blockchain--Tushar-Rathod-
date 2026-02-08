# Electronic Voting System using Blockchain (Academic Project)

This project is a conceptual demonstration of an Electronic Voting System secured by Blockchain technology. It is designed for academic purposes (Diploma/Final Year Project) to showcase how blockchain principles (immutability, transparency, hashing) can be applied to voting systems.

**Note:** This is an academic simulation. The blockchain runs locally on a single machine, and the cryptographic functions are implemented in Python for educational clarity.

---

## 🚀 How to Run

### Prerequisites
1. **Python 3.x** installed on your system.
2. **Flask** (Python web framework).

### Installation Steps
1. Open your terminal/command prompt.
2. Install Flask if you haven't already:
   ```bash
   pip install flask
   ```
3. Navigate to the project folder:
   ```bash
   cd "path/to/project_folder"
   ```
4. Run the application:
   ```bash
   python app.py
   ```
5. Open your web browser and go to:
   ```
   http://127.0.0.1:5000
   ```

### ⚡ Quick Start (Windows)
Double-click the **`run_project.bat`** file.
- It will automatically open your browser.
- It will start the voting server in the terminal.

---

## 🌐 GitHub & Vercel Deployment

This project is ready for GitHub and Vercel.

### GitHub Upload
1. Initialize git: `git init`
2. Add files: `git add .`
3. Commit: `git commit -m "Initial commit"`
4. Push to your repository.

### Vercel Deployment (Live Hosting)
1. Install Vercel CLI or connect your GitHub repo to Vercel.
2. The project includes `vercel.json` for automatic configuration.
3. **Important Note for Vercel:** 
   Attributes like `self.chain = []` are stored in memory. On serverless platforms like Vercel, the memory resets frequently. 
   *   **For the best Academic Demo:** Run it **Locally** (using `run_project.bat`) so you can show the Terminal output with the Blockchain hashes accumulating.
   *   **For Vercel:** It will work, but the blockchain might reset if the server sleeps. This is expected behavior for serverless demos.

---

## 📂 Project Structure

- **`app.py`**: The main Python application (Flask server) connecting the UI and Blockchain.
- **`blockchain.py`**: The core blockchain logic (Block creation, SHA-256 detailed hashing, Chain validation).
- **`templates/`**: Contains HTML files for the user interface.
- **`static/`**: Contains CSS files for styling.

---

## 🔗 Blockchain Concepts Explained

### 1. What is Blockchain?
Start with the simple idea: "A Blockchain is a digital ledger (notebook) that is duplicated and distributed across a network." 
In our project, we simulate this ledger. It is a chain of blocks, where each block contains data (a vote).

### 2. Why for Voting?
- **Immutability:** Once a block is added, it cannot be changed. This prevents vote tampering.
- **Transparency:** Anyone can inspect the blockchain to verify votes (in a public system).
- **Security:** Hashing ensures that if one block is altered, the entire chain after it becomes invalid.

### 3. How it Works in this Project
1. **Voter Login:** The system accepts a Voter ID.
2. **Vote Cast:** The user selects a candidate.
3. **Hashing:** The system creates a "Block" containing:
   - **Voter ID Hash:** We hash the ID (SHA-256) so the original identity is hidden but unique.
   - **Timestamp:** Exact time of the vote.
   - **Candidate Name:** Who received the vote.
   - **Previous Hash:** The digital fingerprint of the *previous* block.
4. **Chaining:** This block is added to the list. Because it contains the "Previous Hash," it is cryptographically linked to the history.

---

## 📐 System Architecture

### Data Flow Components
1. **Voter (User):** Interacts via the Web Browser.
2. **HTML UI:** Simple forms for input and display.
3. **Python Backend:** Receives data, handles logic.
4. **Blockchain Ledger:** The immutable list of vote blocks.

### Diagram (Text-Based)

```
[ Voter ]
    |
    | (Inputs ID & Vote)
    v
[ HTML UI (Browser) ]
    |
    | (HTTP Request - POST)
    v
[ Python Backend (Flask) ] ----> [ Voter Validation ]
    |                                   |
    | (Creates Block)                   | (Verify ID)
    v                                   |
[ Blockchain Simulation ] <-------------+
    | 
    +---> [ Calculate Hash (SHA-256) ]
    |
    +---> [ Link to Previous Block ]
    |
    +---> [ Append to Chain ]
    |
    v
[ Terminal/Console Output ] (Displays Updated Ledger)
```

---

## ⚠️ Academic Disclaimer
This system is a **prototype** for educational demonstration only. It lacks advanced security features required for a real-world national election (e.g., distributed consensus, elliptical curve cryptography, biometric authentication, secure network transmission). It is meant to demonstrate the **logic** of blockchain in voting.
