import { Link } from "react-router";
import { useEffect, useState } from "react";

export default function CTA() {
  const fullText = "Unlock your potential with AI-powered learning tools that adapt to your unique needs and learning style.";
  const [typedText, setTypedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      setTypedText((prev) => prev + fullText.charAt(index));
      setIndex((prevIndex) => {
        const next = prevIndex + 1;
        if (next === fullText.length) {
          setTimeout(() => {
            setTypedText("");
            setIndex(0);
          }, 2000); // Wait 2s before restarting
        }
        return next;
      });
    }, 50);

    return () => clearInterval(typingInterval);
  }, [index]);


  return (
    <div className="relative isolate px-6 pt-20 pb-32 lg:px-8">
      <div className="relative isolate px-6 pt-0 pb-32 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 blur-3xl opacity-30"
          style={{
            background: 'linear-gradient(270deg, #38bdf8, #6366f1, #0ea5e9)',
            backgroundSize: '600% 600%',
            animation: 'gradientShift 15s ease infinite',
          }}>
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#69bff4] to-[#567cf8] opacity-35 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-48">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              Transform Your Learning Experience
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              {typedText}
              <span className="animate-pulse">|</span>
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link className="btn" to="upload">
                Get started
              </Link>
              <Link className="btn link font-semibold text-sm/6">
                Learn More <span aria-hidden="true">→</span>{" "}
              </Link>
            </div>
          </div>
        </div>
      </div>
    
    {/* ADD THIS BELOW — fade between CTA and Features */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-gray-50 pointer-events-none z-0" />
    </div>
  );
}
