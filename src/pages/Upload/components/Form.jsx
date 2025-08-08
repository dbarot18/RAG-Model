import React, { useState } from "react";
import { RxLightningBolt } from "react-icons/rx";
import FileUploader from "./FileUploader";
import { format } from "date-fns";

export default function Form() {
  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [quizCount, setQuizCount] = useState(""); // NEW: input for quiz questions
  const [tasks, setTasks] = useState({
    summarize: false,
    explain: false,
    quiz: false,
    voice: false,
    podcast: false,
    visualize: false,
  });
  const [results, setResults] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilesSelected = (selectedFiles) => {
    const fileArray = Array.isArray(selectedFiles)
      ? selectedFiles
      : Array.from(selectedFiles || []);
    setFiles(fileArray);
    const updatedActivity = fileArray.map((file) => ({
      name: file.name,
      action: "Uploaded",
      timestamp: new Date().toISOString(),
    }));
    setRecentActivity((prev) => [...updatedActivity, ...prev]);
  };

  const handleTaskChange = (e) => {
    const { name, checked } = e.target;
    setTasks((prev) => ({ ...prev, [name]: checked }));
  };

  const handleClear = () => {
    setFiles([]);
    setPrompt("");
    setQuizCount(""); // clear quiz input
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
    if (!Object.values(tasks).some(Boolean)) {
      alert("Please select at least one task.");
      return;
    }

    setLoading(true); // show loader

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const docRes = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      const doc = await docRes.json();

      const selectedTasks = Object.keys(tasks).filter((k) => tasks[k]);

      const taskRes = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: doc.id,
          prompt,
          tasks: selectedTasks,
          quizCount: quizCount || null,
        }),
      });
      const data = await taskRes.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // hide loader
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
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col md:flex-row items-center justify-center gap-8 w-full flex-1 px-4 py-6">
        {/* Left Panel */}
        <div className="w-full md:w-2/3 flex flex-col rounded-3xl border border-border overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-600">
            <h2 className="text-2xl font-medium text-white">RAG Assistant</h2>
            <p className="text-white/80">
              Upload documents and ask questions to get intelligent insights
            </p>
          </div>

          <div className="flex-1 bg-white flex flex-col p-6 gap-6 overflow-auto">
            {/* Upload */}
            <div className="">
              <label className="block mb-2 font-semibold flex justify-center">Upload document</label>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                <FileUploader onFilesSelected={handleFilesSelected} />
              </div>
            </div>

            {/* Prompt */}
            <div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Your question or prompt"
                className="border border-blue-600 rounded-lg w-full py-2 px-3 resize-none"
                rows={4}
              />
            </div>

            {/* Task Selection */}
            <div>
              <p className="mb-2 font-semibold">Select Tasks</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {taskCards.map((task) => (
                  <label
                    key={task.name}
                    className={`flex flex-col gap-3 p-6 rounded-2xl border bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl ${
                      tasks[task.name] ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={task.name}
                        checked={tasks[task.name]}
                        onChange={handleTaskChange}
                        className="w-5 h-5 text-blue-600"
                      />
                      <h4 className="font-semibold">{task.label}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center flex-wrap gap-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="btn"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex justify-center items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >12
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
                  </div>
                ) : (
                  "Submit"
                )}
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="btn ghost"
                disabled={loading}
              >
                Clear
              </button>
            </div>

            {/* Results */}
            {results && (
              <div className="mt-4 space-y-4">
                {results.summarize && (
                  <div>
                    <h3 className="font-semibold">Summary</h3>
                    <p>{results.summarize}</p>
                  </div>
                )}
                {results.explain && (
                  <div>
                    <h3 className="font-semibold">Explanation</h3>
                    <p>{results.explain}</p>
                  </div>
                )}
                {results.quiz && (
                  <div>
                    <h3 className="font-semibold">Quiz Questions</h3>
                    <ul className="list-disc pl-5">
                      {results.quiz.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar
        <div className="w-full md:w-1/3 space-y-6">
          {/* <div className="rounded-3xl shadow border border-border bg-gradient-to-br from-cyan-500 to-blue-500 p-6 text-white hover:-translate-y-1 hover:shadow-lg transition-transform">
            <div className="flex items-center gap-3 mb-4">
              <RxLightningBolt className="w-6 h-6" />
              <h3 className="text-2xl font-bold">Quick Tips</h3>
            </div>
            <ul className="list-disc space-y-2 text-white/90 mb-6">
              <li>Upload PDF, DOCX, or TXT files</li>
              <li>Ask specific questions</li>
              <li>Select multiple tasks</li>
            </ul>
            <a href="/tutorial">
              <button className="w-full bg-white text-blue-500 rounded-lg py-2 hover:shadow-lg transition-transform">
                View Tutorial
              </button>
            </a>
          </div> */}

          {/* Recent Activity
          <div className="rounded-3xl shadow border border-border bg-white p-6 text-gray-800 hover:-translate-y-1 hover:shadow-lg transition-transform">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <ul className="space-y-3 text-sm">
              {recentActivity.length === 0 ? (
                <p className="text-gray-500">No recent activity</p>
              ) : (
                recentActivity.slice(0, 5).map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">{getFileIcon(item.name)}</div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-gray-500">
                        {item.action} at {format(new Date(item.timestamp), "hh:mm a")}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div> */}
        {/* </div> */}
      </main>
    </div>
  );
}
