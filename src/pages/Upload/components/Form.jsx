import React, { useState } from "react";

// FileUploader component
function FileUploader({ onFilesSelected }) {
  const handleFileChange = (e) => {
    const files = e.target.files;
    onFilesSelected(files);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-blue-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-blue-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-blue-400">PDF, DOCX, TXT, PPT, XLS files</p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
          />
        </label>
      </div>
    </div>
  );
}

export default function Form() {
  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [quizCount, setQuizCount] = useState("5"); // Default to 5 questions
  const [tasks, setTasks] = useState({
    summarize: false,
    explain: false,
    quiz: false,
    voice: false,
    podcast: false,
    visualize: false,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleFilesSelected = (selectedFiles) => {
    setResults(null); // Clear previous results on new upload
    const fileArray = Array.isArray(selectedFiles)
      ? selectedFiles
      : Array.from(selectedFiles || []);
    setFiles(fileArray);
  };

  const handleTaskChange = (e) => {
    const { name, checked } = e.target;
    setTasks((prev) => ({ ...prev, [name]: checked }));
  };

  const handleClear = () => {
    setFiles([]);
    setPrompt("");

    setTasks({
      summarize: false,
      explain: false,
      quiz: false,
      voice: false,
      podcast: false,
      visualize: false,
    });
    setResults(null);
  };

const handleSubmit = async () => {
  if (!files.length) {
    alert("Please upload at least one document.");
    return;
  }

  if (!tasks.summarize && !tasks.explain && !tasks.quiz) {
    alert("Please select at least one task.");
    return;
  }

  if (tasks.explain && !prompt.trim()) {
    alert("Please enter a prompt for explanation.");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("file", files[0]);

    // 1. Upload + Summarize to get session_id
    const uploadRes = await fetch("http://127.0.0.1:8000/summarize_pdf/", {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) throw new Error("Failed to upload and summarize PDF");
    const uploadData = await uploadRes.json();

    if (uploadData.error) {
      alert("Error: " + uploadData.error);
      setLoading(false);
      return;
    }

    const session_id = uploadData.session_id;
    const resultsObj = {};

    // 2. Add summary to results
    if (tasks.summarize) {
      resultsObj.summarize = uploadData.summary;
    }

    setLoading(true);

    try {

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }

    setResults(resultsObj);
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const taskCards = [
    {
      name: "summarize",
      label: "Summarize",
      description: "Create a concise summary of your document.",
    },
    {
      name: "explain",
      label: "Explain",
      description: "Clarify complex ideas in plain language.",
    },
    {
      name: "quiz",
      label: "Generate Quiz",
      description: "Generate a custom quiz from your document.",
    },
    {
      name: "voice",
      label: "Relevant Case Study",
      description: "Innovation applied in real scenarios",
    },
    {
      name: "podcast",
      label: "Podcast Generation",
      description: "Turn study material into audio podcasts.",
    },
    {
      name: "visualize",
      label: "Visualize Data",
      description: "Convert content into easy-to-understand visuals.",
    },
  ];

  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf": return "📕";
      case "doc":
      case "docx": return "📄";
      case "ppt":
      case "pptx": return "📊";
      case "xls":
      case "xlsx": return "📈";
      case "txt": return "📝";
      case "jpg":
      case "jpeg":
      case "png": return "🖼️";
      default: return "📁";
    }
  };

  return (

              Upload documents and ask questions to get intelligent insights
            </p>
          </div>


            {/* Upload */}
            <div>
              <label className="block mb-3 font-semibold text-center text-gray-700">Upload Documents</label>
              <FileUploader onFilesSelected={handleFilesSelected} />
              
              {/* Show uploaded files */}
              {files.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</p>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <span>{getFileIcon(file.name)}</span>
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Prompt */}
            <div>
              <label className="block mb-3 font-semibold text-gray-700">Your Question or Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask a specific question about your documents or provide instructions for the tasks..."
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg w-full py-3 px-4 resize-none transition-colors"
                rows={4}
              />
            </div>

            {/* Quiz Count Input - only show when quiz is selected */}
            {tasks.quiz && (
              <div>
                <label className="block mb-3 font-semibold text-gray-700">Number of Quiz Questions</label>
                <input
                  type="number"
                  value={quizCount}
                  onChange={(e) => setQuizCount(e.target.value)}
                  min="1"
                  max="20"
                  className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg py-2 px-3 w-24"
                />
              </div>
            )}

            {/* Task Selection */}
            <div>
              <p className="mb-4 font-semibold text-gray-700">Select Tasks</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {taskCards.map((task) => (
                  <label
                    key={task.name}
                    className={`flex flex-col gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg ${
                      tasks[task.name] 
                        ? "border-blue-500 bg-blue-50 shadow-md" 
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={task.name}
                        checked={tasks[task.name]}
                        onChange={handleTaskChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <h4 className="font-semibold text-gray-900">{task.label}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center flex-wrap gap-4 mt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Submit"
                )}
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors hover:shadow-md"
              >
                Clear
              </button>
            </div>

            {/* Results */}
            {results && (
              <div className="mt-8 space-y-6 border-t pt-6">
                <h2 className="text-2xl font-bold text-gray-900">Results</h2>
                
                {results.summarize && (
                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
                    <p className="text-gray-700">{results.summarize}</p>
                  </div>
                )}
                
                {results.explain && (
                  <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2">Explanation</h3>
                    <p className="text-gray-700">{results.explain}</p>
                  </div>
                )}
                
                {results.quiz && (

                      ))}
                    </ol>
                  </div>
                )}
                
                {results.voice && (
                  <div className="bg-orange-50 p-5 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-orange-900 mb-2">Case Study</h3>
                    <p className="text-gray-700">{results.voice}</p>
                  </div>
                )}
                
                {results.podcast && (
                  <div className="bg-pink-50 p-5 rounded-lg border border-pink-200">
                    <h3 className="font-semibold text-pink-900 mb-2">Podcast Generation</h3>
                    <p className="text-gray-700">{results.podcast}</p>
                  </div>
                )}
                
                {results.visualize && (
                  <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200">
                    <h3 className="font-semibold text-indigo-900 mb-2">Data Visualization</h3>
                    <p className="text-gray-700">{results.visualize}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}