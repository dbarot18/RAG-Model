import Footer from "@/layout/Footer";
import { Link } from "react-router";
import Form from "./components/Form";

export default function Upload() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <Link to="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="src\assets\ASU-Logo.png"
              className="h-8 w-auto transform transition-transform duration-200 hover:-translate-y-1"
              />
            </Link>
          </div>
        </nav>
      </header>
      {/* Container */}
      <div className="container px-8 md:px-16 lg:px-32 mt-44 mb-24">
        <div className="h-screen"><Form /></div>
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
