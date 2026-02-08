from flask import Flask, render_template, request, redirect, url_for, flash, send_file
from blockchain import Blockchain
import hashlib
import os

app = Flask(__name__)
app.secret_key = 'academic_demo_key'  # Needed for flash messages

# Initialize Blockchain
blockchain = Blockchain()

# Hardcoded candidates for the demo with metadata for UI
CANDIDATES = [
    {"id": "c1", "name": "Alice Johnson", "party": "Tech Innovation Party", "color": "#3498db"},
    {"id": "c2", "name": "Bob Smith", "party": "Green Earth Alliance", "color": "#27ae60"},
    {"id": "c3", "name": "Charlie Davis", "party": "Future Vision Party", "color": "#9b59b6"}
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    voter_id = request.form.get('voter_id')
    if not voter_id:
        flash("Please enter a valid Voter ID")
        return redirect(url_for('index'))
    
    # 1. Check if voter has already voted (Academic Single Vote Enforcement)
    # Note: We check the blockchain directly for the hashed ID
    voter_hash = hashlib.sha256(voter_id.encode()).hexdigest()
    for block in blockchain.chain:
        if block.voter_id == voter_hash:
            # Voter found in ledger -> Redirect to Error Page
            return redirect(url_for('already_voted'))

    # If new voter, allow access
    return redirect(url_for('vote', voter_id=voter_id))

@app.route('/vote')
def vote():
    voter_id = request.args.get('voter_id')
    
    # Security check: If no ID in URL, go home
    if not voter_id:
        return redirect(url_for('index'))
    
    # Security check: Re-verify if this ID has voted (prevent URL jumping)
    voter_hash = hashlib.sha256(voter_id.encode()).hexdigest()
    for block in blockchain.chain:
        if block.voter_id == voter_hash:
            return redirect(url_for('already_voted'))
            
    return render_template('vote.html', voter_id=voter_id, candidates=CANDIDATES)

@app.route('/submit_vote', methods=['POST'])
def submit_vote():
    voter_id = request.form.get('voter_id')
    candidate = request.form.get('candidate')

    if not voter_id or not candidate:
        flash("Invalid vote submission")
        return redirect(url_for('index'))

    # Add vote to blockchain
    success, message = blockchain.add_vote(voter_id, candidate)

    if success:
        return render_template('confirmation.html', message=message, block_index=blockchain.get_latest_block().index)
    else:
        # If vote failed (likely duplicate catch), redirect to error page
        return redirect(url_for('already_voted'))

@app.route('/already_voted')
def already_voted():
    return render_template('already_voted.html')

@app.route('/pdf/view')
def view_pdf():
    """Serve the PDF file for inline viewing in browser"""
    pdf_path = os.path.join(app.root_path, 'templates', 'PDF', 'FOB-236340316058.pdf')
    return send_file(pdf_path, mimetype='application/pdf')

@app.route('/pdf/download')
def download_pdf():
    """Serve the PDF file for download"""
    pdf_path = os.path.join(app.root_path, 'templates', 'PDF', 'FOB-236340316058.pdf')
    return send_file(pdf_path, as_attachment=True, download_name='FOB-236340316058.pdf')

@app.route('/chain')
def view_chain():
    # Helper route to view chain in browser JSON format (used by Terminal UI)
    chain_data = [block.to_dict() for block in blockchain.chain]
    return {"length": len(chain_data), "chain": chain_data}

if __name__ == '__main__':
    print("Electronic Voting System using Blockchain - Demo Started")
    print("Access the UI at: http://127.0.0.1:5000")
    app.run(debug=True)
