import React, { useState } from "react";
import { RxLightningBolt } from "react-icons/rx";
import FileUploader from "./FileUploader";
import { format } from "date-fns";
import UploadIllustration from "@/assets/undraw_files-uploading_qf8u.svg";

export default function Form() {
  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState("");
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
    setResults(null); // Clear previous results on new upload
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

  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return "📕";
      case "doc":
      case "docx":
        return "📄";
      case "ppt":
      case "pptx":
        return "📊";
      case "xls":
      case "xlsx":
        return "📈";
      case "txt":
        return "📝";
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️";
      default:
        return "📁";
    }
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

  if (!tasks.summarize && !tasks.explain) {
    alert("Please select at least one of Summarize or Explain tasks.");
    return;
  }

  if (tasks.explain && !prompt.trim()) {
    alert("Please enter a prompt/question to get an explanation.");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("file", files[0]); // only the first file

    // Summarize
    let summaryResult = null;
    if (tasks.summarize) {
      const response = await fetch("http://127.0.0.1:8000/summarize_pdf/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to summarize PDF");

      const data = await response.json();
      if (data.error) {
        alert("Error: " + data.error);
        setLoading(false);
        return;
      }
      summaryResult = data.summary;
    }

    // Explain
    let explanationResult = null;
    if (tasks.explain && prompt.trim()) {
      const explainResponse = await fetch("http://127.0.0.1:8000/explain_concept/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept: prompt }),
      });

      if (!explainResponse.ok) throw new Error("Failed to get explanation");

      const explainData = await explainResponse.json();
      if (explainData.error) {
        alert("Error: " + explainData.error);
        setLoading(false);
        return;
      }
      explanationResult = explainData.explanation;
    }

    setResults({
      summarize: summaryResult,
      explain: explanationResult,
    });
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
      label: "Voice Interaction",
      description: "Use voice commands to learn hands-free.",
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

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col md:flex-row gap-8 w-full flex-1 px-4 py-6">
        <div className="w-full md:w-2/3 flex flex-col rounded-3xl border border-border overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-600">
            <h2 className="text-2xl font-medium text-white">RAG Assistant</h2>
            <p className="text-white/80">
              Upload documents and ask questions to get intelligent insights
            </p>
          </div>

          <div className="flex-1 bg-white flex flex-col p-6 gap-6 overflow-auto">
            <div>
              <label className="block mb-2 font-semibold">Upload document</label>
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <img
                  src={UploadIllustration}
                  alt="Upload Illustration"
                  className="w-64 h-auto"
                />
                <FileUploader onFilesSelected={handleFilesSelected} />
              </div>
            </div>

            <div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Your question or prompt"
                className="border border-blue-600 rounded-lg w-full py-2 px-3 resize-none"
                rows={4}
              />
            </div>

            <div>
              <p className="mb-2 font-semibold">Select Tasks</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {taskCards.map((task) => (
                  <label
                    key={task.name}
                    className={`flex flex-col gap-3 p-6 rounded-2xl border bg-white shadow-md transform transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl ${
                      tasks[task.name]
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
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

            <div className="flex flex-wrap gap-4">
              <button
              type="button" // ✅ prevents accidental GET request/page reload
              onClick={handleSubmit}
              className="btn"
              disabled={loading}
            >

                {loading ? "Summarizing…" : "Submit"}
              </button>
              <button type="button" onClick={handleClear} className="btn ghost">
                Clear
              </button>
            </div>

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

        <div className="w-full md:w-1/3 space-y-6">
          <div className="rounded-3xl shadow border border-border bg-gradient-to-br from-cyan-500 to-blue-500 p-6 text-white transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <RxLightningBolt className="w-6 h-6" />
              <h3 className="text-2xl font-bold">Quick Tips</h3>
            </div>
            <ul className="list-inside list-disc space-y-2 mb-6 text-white/90">
              <li>Upload PDF, DOCX, or TXT files for best results</li>
              <li>Ask specific questions for more accurate answers</li>
              <li>Select multiple tasks to get comprehensive results</li>
            </ul>
            <a href="/tutorial">
              <button className="w-full rounded-lg bg-white py-2 text-blue-500 font-medium transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                View Tutorial
              </button>
            </a>
          </div>

          <div className="rounded-3xl shadow border border-border bg-white p-6 text-gray-800 transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <ul className="space-y-3 text-sm">
              {recentActivity.length === 0 ? (
                <p className="text-gray-500">No recent activity</p>
              ) : (
                recentActivity.slice(0, 5).map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      {getFileIcon(item.name)}
                    </div>
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
          </div>
        </div>
      </main>
    </div>
  );
}
