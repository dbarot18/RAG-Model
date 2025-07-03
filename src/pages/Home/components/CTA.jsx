import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot } from "react-icons/fa";
import { Link } from "react-router";
import mainVideo from "../../../assets/mainpage.mp4";

const examples = [
  {
    prompt: "Explain quantum computing in simple terms.",
    response:
      "Quantum computing uses principles of quantum mechanics to solve problems faster than traditional computers. It uses 'qubits' that can represent multiple states simultaneously, allowing complex calculations in parallel.",
  },
  {
    prompt: "Summarize today’s news in one paragraph.",
    response:
      "Today's headlines focus on advancements in AI governance, fluctuating economic indicators, and climate action initiatives. Meanwhile, tech giants are embedding language models into everyday tools for smarter workflows.",
  },
  {
    prompt: "How does a RAG model work?",
    response:
      "RAG combines document retrieval with generative models. It first fetches relevant documents and then generates a contextual response by combining the query with those documents.",
  },
];

export default function CTA() {
  const fullText =
    "Unlock your potential with AI-powered learning tools that adapt to your unique needs and learning style.";
  const [typedText, setTypedText] = useState("");
  const [index, setIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");

  useEffect(() => {
    const typingInterval = setInterval(() => {
      setTypedText((prev) => prev + fullText.charAt(index));
      setIndex((prevIndex) => {
        const next = prevIndex + 1;
        if (next === fullText.length) {
          setTimeout(() => {
            setTypedText("");
            setIndex(0);
          }, 2000);
        }
        return next;
      });
    }, 50);

    return () => clearInterval(typingInterval);
  }, [index]);

  useEffect(() => {
    if (selectedIndex !== null) {
      setShowResponse(false);
      setTypedAnswer("");
      const delay = setTimeout(() => {
        setShowResponse(true);
        let index = 0;
        const interval = setInterval(() => {
          setTypedAnswer((prev) =>
            prev + examples[selectedIndex].response.charAt(index)
          );
          index++;
          if (index === examples[selectedIndex].response.length) {
            clearInterval(interval);
          }
        }, 15);
      }, 600);
      return () => clearTimeout(delay);
    }
  }, [selectedIndex]);

  const handlePromptClick = (index) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  return (
    <div className="relative isolate px-6 pt-20 pb-32 lg:px-8">
      Background Video
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-20 bg-video-blur"
        src={mainVideo}
      />
      <div className="absolute inset-x-0 top-0 z-10 overflow-hidden leading-none rotate-180">
        <svg
          className="w-full h-[200px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 C300,100 900,0 1200,100 L1200,120 L0,120 Z"
            fill="#a5b4fc"
            opacity="0.3"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="M0,0 C300,100 900,0 1200,100 L1200,120 L0,120 Z; M0,0 C200,80 1000,30 1200,90 L1200,120 L0,120 Z; M0,0 C300,100 900,0 1200,100 L1200,120 L0,120 Z"
            />
          </path>
          <path
            d="M0,0 C400,80 800,30 1200,90 L1200,120 L0,120 Z"
            fill="#7dd3fc"
            opacity="0.5"
          >
            <animate
              attributeName="d"
              dur="12s"
              repeatCount="indefinite"
              values="M0,0 C400,80 800,30 1200,90 L1200,120 L0,120 Z; M0,0 C300,100 900,10 1200,100 L1200,120 L0,120 Z; M0,0 C400,80 800,30 1200,90 L1200,120 L0,120 Z"
            />
          </path>
          <path
            d="M0,0 C500,90 700,20 1200,100 L1200,120 L0,120 Z"
            fill="#38bdf8"
            opacity="0.7"
          >
            <animate
              attributeName="d"
              dur="14s"
              repeatCount="indefinite"
              values="M0,0 C500,90 700,20 1200,100 L1200,120 L0,120 Z; M0,0 C300,70 900,30 1200,80 L1200,120 L0,120 Z; M0,0 C500,90 700,20 1200,100 L1200,120 L0,120 Z"
            />
          </path>
        </svg>
      </div>
      <div className="relative isolate px-6 pt-0 pb-32 lg:px-8">
        {/* <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 blur-3xl opacity-30"
          style={{
            background: "linear-gradient(270deg, #38bdf8, #6366f1, #0ea5e9)",
            backgroundSize: "600% 600%",
            animation: "gradientShift 15s ease infinite",
          }}
        /> */}
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-48 text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            Transform Your Learning Experience
          </h1>
          <p className="mt-8 text-lg font-medium text-white sm:text-xl/8 leading-relaxed" style={{ minHeight: "4.5rem", whiteSpace: "normal", overflow: "hidden" }}>
            {typedText}
            <span className="animate-pulse">|</span>
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link className="btn" to="upload">Get started</Link>
            <Link className="btn link font-semibold text-sm/6">Learn More <span aria-hidden="true">→</span></Link>
          </div>

         <div className="absolute bottom-12 inset-x-0 px-6 md:px-12 lg:px-28">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 text-center">⚡ Try Prompt Examples</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {examples.map((example, index) => (
                <motion.div
                  key={index}
                  className="cursor-pointer bg-[#8294dc] px-10 h-17 flex justify-center py-3 rounded-xl shadow-lg text-white hover:scale-[1.02] transition-transform duration-300 w-full"
                  onClick={() => handlePromptClick(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="text-sm font-medium mb-1 whitespace-pre-wrap w-full">{example.prompt}</h3>
                  <AnimatePresence>
                    {selectedIndex === index && showResponse && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-3 bg-white text-gray-800 p-3 rounded-md shadow-inner flex gap-2 items-start"
                      >
                        <FaRobot className="text-indigo-500 mt-1" />
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{typedAnswer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 -z-10 overflow-hidden leading-none">
        <svg
          className="w-full h-[150px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,0 C300,100 900,0 1200,100 L1200,120 L0,120 Z" fill="#6366f1" opacity="0.3">
            <animate attributeName="d" dur="10s" repeatCount="indefinite" values="M0,0 C300,100 900,0 1200,100 L1200,120 L0,120 Z; M0,0 C200,80 1000,30 1200,90 L1200,120 L0,120 Z; M0,0 C300,100 900,0 1200,100 L1200,120 L0,120 Z" />
          </path>
          <path d="M0,0 C400,80 800,30 1200,90 L1200,120 L0,120 Z" fill="#38bdf8" opacity="0.5">
            <animate attributeName="d" dur="12s" repeatCount="indefinite" values="M0,0 C400,80 800,30 1200,90 L1200,120 L0,120 Z; M0,0 C300,100 900,10 1200,100 L1200,120 L0,120 Z; M0,0 C400,80 800,30 1200,90 L1200,120 L0,120 Z" />
          </path>
          <path d="M0,0 C500,90 700,20 1200,100 L1200,120 L0,120 Z" fill="#0ea5e9" opacity="0.7">
            <animate attributeName="d" dur="14s" repeatCount="indefinite" values="M0,0 C500,90 700,20 1200,100 L1200,120 L0,120 Z; M0,0 C300,70 900,30 1200,80 L1200,120 L0,120 Z; M0,0 C500,90 700,20 1200,100 L1200,120 L0,120 Z" />
          </path>
        </svg>
      </div>
    </div>
  );
}
