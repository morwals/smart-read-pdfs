// src/App.jsx
import React, { useState } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import DocumentSummary from './components/DocumentSummary';
import QuestionAnswering from './components/QuestionAnswering';
import { uploadDocument } from './services/api';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [documentData, setDocumentData] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    // Check file type
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.txt')) {
      setError('Only PDF and TXT files are supported.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await uploadDocument(file);
      setDocumentData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetDocument = () => {
    setDocumentData(null);
    setFile(null);
    setError(null);
  };

  return (
    <div className="main-div">
      <h1 className="main-h1">Document Analysis Tool</h1>
      
      {!documentData ? (
        <FileUploader 
          file={file}
          setFile={setFile}
          loading={loading}
          error={error}
          handleUpload={handleUpload}
        />
      ) : (
        <div className="summary-div">
          <DocumentSummary summary={documentData.summary} />
          <QuestionAnswering documentText={documentData.full_text} />
          <button
            onClick={resetDocument}
            className="reset-btn"
          >
            Upload New Document
          </button>
        </div>
      )}
    </div>
  );
}

export default App;