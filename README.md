# Document Analysis Application

This full-stack application allows users to upload text documents (PDF or TXT), extract content, generate AI summaries, and ask questions about the document content.

## Application Flow

### Overview

The application follows a client-server architecture with:
- A React frontend for user interactions
- A Flask backend for processing documents and interfacing with AI
- The Gemini API for generating summaries and answering questions

## Technical Architecture

### Frontend (React)

The frontend is built with React and organized into modular components:

- **App Component**: The main container that manages global state and routing
- **FileUploader**: Handles document selection and upload
- **DocumentSummary**: Displays AI-generated summary of the document
- **QuestionAnswering**: Manages question input and displays answers
- **API Service**: Centralizes API calls to the backend

### Backend (Flask)

The backend server provides two main API endpoints:

- **/api/upload**: Processes document uploads, validates files, and generates summaries
- **/api/question**: Processes questions about the document and returns AI-generated answers

### External Services

- **Anthropic Claude API**: Provides AI capabilities for document summarization and question answering

## Database Architecture

**Current Implementation: Stateless Architecture**

The current application does not use a database. It operates with a completely stateless architecture:

- **Temporary File Processing**: When a file is uploaded, it's temporarily stored on the server, processed, and then deleted after text extraction.
- **In-memory State Management**: All data (document content, summaries, Q&A history) is stored in the React application's state.
- **Session-based**: All user data exists only for the duration of the current session. Refreshing the page or closing the browser will lose all data.
- **No Persistence**: The application doesn't maintain any record of previous uploads or questions once the session ends.

**Benefits of the Current Approach**:
- Simplicity in deployment and maintenance
- No database configuration required
- Privacy-focused (data isn't stored)
- Lower server resource requirements

## Limitations and Future Improvements

- Currently limited to PDF and TXT files
- 3-page limit for documents
- No persistent storage of documents or Q&A history
- No user authentication or multi-user support

Future improvements could include:
- Support for more document formats (DOCX, HTML, etc.)
- Database integration for document and history persistence
- User accounts and saved document history
- More advanced document analysis features
- Collaborative document analysis capabilities