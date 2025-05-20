import React, { useEffect, useState } from "react";
import { AiOutlineCheckCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { MdClear } from "react-icons/md";
import "./file-uploader.css";

export default function FileUploader({ onFilesSelected, width, height }) {
  const [file, setFile] = useState(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      setFile(newFiles[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setFile(newFiles[0]);
    }
  };

  useEffect(() => {
    onFilesSelected(file);
  }, [file, onFilesSelected]);

  return (
    <section className="drag-drop" style={{ width: width, height: height }}>
      <div
        className={`document-uploader ${
          file ? "upload-box active" : "upload-box"
        }`}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <>
          <label htmlFor="browse" className="upload-info">
            <AiOutlineCloudUpload className="text-4xl text-blue-700/75"/>
            <div>
              <p>Drag and drop your files or click here to browse</p>
            </div>
          <input
            type="file"
            hidden
            id="browse"
            onChange={handleFileChange}
            accept=".png, .jpg, .jpeg .pdf,.docx,.pptx,.txt,.xlsx"
            multiple
          />
          </label>
        </>
        {file && (
          <div className="file-list">
            <div className="file-list__container">
              <div className="file-item">
                <div className="file-info">
                  <p>{file.name}</p>
                  {/* <p>{file.type}</p> */}
                </div>
                <div className="file-actions">
                  <MdClear onClick={handleRemoveFile} />
                </div>
              </div>
            </div>
          </div>
        )}
        {file && (
          <div className="success-file">
            <AiOutlineCheckCircle
              style={{ color: "#6DC24B", marginRight: 1 }}
            />
            <p>{1} file(s) selected</p>
          </div>
        )}
      </div>
    </section>
  );
}
