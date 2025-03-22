// src/components/FileUploader.jsx
import React from 'react';
import PropTypes from 'prop-types';

const FileUploader = ({ file, setFile, loading, error, handleUpload }) => {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div className="form-main">
      <h2 className="form-h2">Upload Document</h2>
      <div className="form-div2">
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
          className="block w-full p-2 border border-gray-300 rounded mb-2"
        />
        <p>
          Supported formats: PDF, TXT (max 3 pages)
        </p>
      </div>
      
      <button
        onClick={handleUpload}
        disabled={loading}
        className="form-btn"
      >
        {loading ? 'Processing...' : 'Upload and Analyze'}
      </button>
      
      {error && <p className="form-err">{error}</p>}
    </div>
  );
};

FileUploader.propTypes = {
  file: PropTypes.object,
  setFile: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  handleUpload: PropTypes.func.isRequired
};

export default FileUploader;