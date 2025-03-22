// src/components/DocumentSummary.jsx
import React from 'react';
import PropTypes from 'prop-types';

const DocumentSummary = ({ summary }) => {
  return (
    <div className="doc-main">
      <h2 className="doc-head">Document Summary</h2>
      <div className="doc-summary">
        <p>{summary}</p>
      </div>
    </div>
  );
};

DocumentSummary.propTypes = {
  summary: PropTypes.string.isRequired
};

export default DocumentSummary;