import React, { useEffect, useState } from "react";
import { storage } from "../appwriteConfig";
import { Document, Page, pdfjs } from "react-pdf"; // Import from react-pdf
import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // Import styles for annotations
import "react-pdf/dist/esm/Page/TextLayer.css"; // Import styles for text layer
// Set workerSrc for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const MyResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedResumeId, setSelectedResumeId] = useState(null); // Store selected resume ID for download

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const result = await storage.listFiles("665336a70035953512fd");
        const filesWithCVNumbers = result.files.map((file, index) => ({
          ...file,
          name: `CV ${index + 1} - ${file.name}`, // Append CV number to the name
        }));
        setResumes(filesWithCVNumbers);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching resumes", error);
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const openModal = (bucketId, fileId) => {
    try {
      const result = storage.getFileView(bucketId, fileId);
      setSelectedResume(result.href);
      setSelectedResumeId(fileId); // Store the file ID for downloading
      setError(null);
      setPageNumber(1); // Reset to the first page when opening a new PDF
    } catch (error) {
      console.error("Error fetching resume preview", error);
      setError("Error fetching resume preview. Please try again later.");
    }
  };

  const closeModal = () => {
    setSelectedResume(null);
    setSelectedResumeId(null);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDownload = async () => {
    if (selectedResumeId) {
      try {
        const result = await storage.getFileDownload(
          "665336a70035953512fd",
          selectedResumeId
        );
        window.open(result.href, "_blank"); // Open the download link in a new tab
      } catch (error) {
        console.error("Error downloading the file", error);
        setError("Error downloading the file. Please try again later.");
      }
    }
  };

  return (
    <div className='page-container'>
      <header className='header'>
        <h1 className='title'>My Resumes</h1>
      </header>
      <div className='container'>
        <div className='resumes'>
          {isLoading ? (
            <p className='loading-text'>Loading...</p>
          ) : resumes.length === 0 ? (
            <p className='no-resumes-text'>No resumes found.</p>
          ) : (
            resumes.map((resume, index) => (
              <div
                key={index}
                className='resume'
                onClick={() => openModal(resume.bucketId, resume.$id)}
              >
                <div className='resume-content'>
                  <h2 className='resume-name'>{resume.name}</h2>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {selectedResume && (
        <div className='modal-overlay'>
          <div className='modal'>
            <div className='modal-content'>
              <button onClick={closeModal} className='close-button'>
                ×
              </button>
              {error ? (
                <p className='error-message'>{error}</p>
              ) : (
                <div className='pdf-container'>
                  <Document
                    file={selectedResume}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={pageNumber} />
                  </Document>
                  {numPages && (
                    <div className='pagination'>
                      <button
                        disabled={pageNumber <= 1}
                        onClick={() => setPageNumber(pageNumber - 1)}
                      >
                        Previous
                      </button>
                      <span>
                        Page {pageNumber} of {numPages}
                      </span>
                      <button
                        disabled={pageNumber >= numPages}
                        onClick={() => setPageNumber(pageNumber + 1)}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button onClick={handleDownload} className='download-button'>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
      <footer className='footer'>
        <p>&copy; 2024 Cvify-me</p>
      </footer>
      <style jsx>{`
        .page-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: rgb(237, 231, 234);
          color: #333;
          font-family: Arial, sans-serif;
        }
        .header {
          padding: 20px;
          text-align: center;
          background: #333;
          color: #fff;
        }
        .footer {
          margin-top: auto;
          padding: 20px;
          text-align: center;
          background: #333;
          color: #fff;
        }
        .container {
          flex: 1;
          padding: 0 20px;
        }
        .title {
          font-size: 32px;
          margin-bottom: 20px;
        }
        .loading-text,
        .no-resumes-text {
          text-align: center;
          font-size: 18px;
          margin-top: 50px;
        }
        .resumes {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .resume {
          position: relative;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        .resume:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .resume-content {
          padding: 20px;
        }
        .resume-name {
          font-size: 20px;
          margin-bottom: 10px;
          color: #333;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal {
          background-color: white;
          width: 90%;
          max-width: 1000px; /* Adjust the maximum width to make the modal larger */
          height: 90%; /* Adjust the height to make the modal larger */
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow-y: auto; /* Add scroll for overflow content */
        }
        .modal-content {
          text-align: center;
          position: relative;
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }
        .error-message {
          color: red;
        }
        .pdf-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pagination {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-top: 20px;
        }
        .pagination button {
          padding: 10px 20px;
          background-color: #333;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .pagination button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .pagination span {
          font-size: 16px;
        }
        .download-button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #333;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .download-button:hover {
          background-color: #555;
        }
      `}</style>
    </div>
  );
};

export default MyResumes;