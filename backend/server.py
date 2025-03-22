from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import tempfile
import requests
import PyPDF2
import re

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY') 
app.config['URL'] = os.getenv('URL')

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # Allow cross-origin requests

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    # Check file type
    if not (file.filename.endswith('.pdf') or file.filename.endswith('.txt')):
        return jsonify({"error": "Only PDF and TXT files are supported"}), 400
    
    # Save the file temporarily
    temp_file = tempfile.NamedTemporaryFile(delete=False)
    file.save(temp_file.name)
    temp_file.close()
    
    try:
        # Extract text based on file type
        if file.filename.endswith('.pdf'):
            text, page_count = extract_text_from_pdf(temp_file.name)
            if page_count > 3:
                os.unlink(temp_file.name)
                return jsonify({"error": "PDF exceeds 3 pages limit"}), 400
        else:  # txt file
            with open(temp_file.name, 'r', encoding='utf-8') as f:
                text = f.read()
                # Rough estimate of pages (3000 chars per page)
                if len(text) > 9000:
                    os.unlink(temp_file.name)
                    return jsonify({"error": "Text file too large, exceeds equivalent of 3 pages"}), 400
        
        # Generate summary
        summary = generate_summary(text)
        
        # Return result
        response = {
            "success": True,
            "summary": summary["candidates"][0]["content"]["parts"][0]["text"],
            "full_text": text
        }
        
        os.unlink(temp_file.name)
        return jsonify(response)
    
    except Exception as e:
        os.unlink(temp_file.name)
        return jsonify({"error": str(e)}), 500

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        page_count = len(pdf_reader.pages)
        
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
            
    return text, page_count

def generate_summary(text):
        url = app.config['URL']
        headers = {
            "Content-Type": "application/json"
        }
        param = {
            "key" : app.config['SECRET_KEY']
        }
        body = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"Please provide a concise summary of the following text in about 100-150 words:\n\n{text}"
                    }
                ]
            }
        ]
        }
        
        try:
            response = requests.post(url, headers=headers, params=param, json=body)
            response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)
            data = response.json()  # Parse the JSON response
            print("Response Data:", data)
            return data
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
            return None


@app.route('/api/question', methods=['POST'])
def ask_question():  
    try:
        data = request.json
        if not data or "question" not in data:
                return jsonify({"error": "Question is required"}), 400

        question = data["question"]  # Extract question from JSON
        context = data.get("context")
        print("Question:", question)   
        print("Context:", context)
        # Get answer from AI
        answer = generate_answer(question, context)
        return jsonify({"answer": answer})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def make_api_call(question, context):
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    headers = {
        "Content-Type": "application/json"
    }
    param = {
        "key" : "AIzaSyB1Tv5j_Igqr9JTevm-fVXyCCNFQh7zV9Y"
    }
    body = {
    "contents": [
        {
            "parts": [
                {
                    "text": f"Based ONLY on the following document, please answer the question. If the answer cannot be found in the document, say so politely.\n\nDOCUMENT:\n{context}\n\nQUESTION: {question}"
                }
            ]
        }
    ]
    }
    
    try:
        response = requests.post(url, headers=headers, params=param, json=body)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)
        data = response.json()  # Parse the JSON response
        # print("Response Data:", data)
        return data
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None

def generate_answer(question, context):
    response = make_api_call(question, context)
    return response["candidates"][0]["content"]["parts"][0]["text"]

if __name__ == '__main__':
    print("Running on http://localhost:5001")
    app.run(host="0.0.0.0", port=5001, debug=True)
    