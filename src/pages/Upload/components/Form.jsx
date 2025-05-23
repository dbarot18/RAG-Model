import React, { useState } from "react";
import { RxLightningBolt } from "react-icons/rx";
import FileUploader from "./FileUploader";
import { format } from 'date-fns';

export default function Form() {
  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [tasks, setTasks] = useState({
    summarize: false,
    explain: false,
    quiz: false,
  });
  const [results, setResults] = useState(null);

  const [recentActivity, setRecentActivity] = useState([]);
  const handleFilesSelected = (selectedFiles) => {
  // Ensure it's always an array
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
console.log(recentActivity);

  const handleTaskChange = (e) => {
    const { name, checked } = e.target;
    setTasks((prev) => ({ ...prev, [name]: checked }));
  };

  const handleClear = () => {
    setFiles([]);
    setPrompt("");
    setTasks({ summarize: false, explain: false, quiz: false });
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

    try {
      // Upload or register document
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const docRes = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      const doc = await docRes.json();

      // Trigger selected tasks
      const selected = Object.keys(tasks).filter((k) => tasks[k]);
      const taskRes = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: doc.id,
          prompt,
          tasks: selected,
        }),
      });
      const data = await taskRes.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  const taskCards = [
    {
      name: "summarize",
      label: "Summarize",
      description: "Capture the essence of your document in a crisp, engaging summary.",
    },
    {
      name: "explain",
      label: "Explain",
      description: "Uncover hidden details and clarify complex ideas from your content.",
    },
    {
      name: "quiz",
      label: "Generate Quiz",
      description: "Challenge yourself with a custom quiz based on your document.",
    },
  ];

  return (
    <div className="relative flex gap-8 w-full h-screen">
      {/* Main Form Panel */}
      <div className="w-2/3 flex flex-col rounded-3xl border border-border overflow-hidden">
        {/* Form Header */}
        <div className="p-8 bg-gradient-to-r from-blue-500 to-cyan-600">
          <h2 className="text-2xl font-medium text-white">RAG Assistant</h2>
          <p className="text-white/80">
            Upload documents and ask questions to get intelligent insights
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 bg-white flex flex-col p-8 gap-6 overflow-auto">
          {/* File Uploader */}
          <div>
            <label className="block mb-2 font-semibold">Upload document</label>
            <FileUploader onFilesSelected={handleFilesSelected} />
          </div>

          {/* Prompt Input */}
          <div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Your question or prompt"
              className="border border-blue-600 rounded-lg w-full py-2 px-3 resize-none"
              rows={4}
            />
          </div>

          {/* Task Selection Cards */}
          <div>
            <p className="mb-2 font-semibold">Select Tasks</p>
            <div className="grid grid-cols-3 gap-4">
              {taskCards.map((task) => (
                <label
                  key={task.name}
                  className={`flex flex-col gap-3 p-6 rounded-2xl border bg-white shadow-md transform transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl ${
    tasks[task.name] ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
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

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="btn ghost"
            >
              Clear
            </button>
          </div>

          {/* Results Preview */}
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

      <div className="max-w-sm w-full space-y-6">
  {/* Quick Tips Section */}
  <div className="rounded-3xl shadow border border-border bg-gradient-to-br from-cyan-500 to-blue-500 p-6 text-white self-start transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
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

  {/* Recent Activity Section */}
  <div className="rounded-3xl shadow border border-border bg-white p-6 text-gray-800 transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
    <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
    <ul className="space-y-3 text-sm">
      {recentActivity.length === 0 ? (
        <p className="text-gray-500">No recent activity</p>
      ) : (
        recentActivity.slice(0,5).map((item, index) => (
          <li key={index} className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-full">📄</div>
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-gray-500">{item.action} at {item.timestamp}</p>
            </div>
          </li>
        ))
      )}
    </ul>
  </div>

</div>


    </div>
  );
}