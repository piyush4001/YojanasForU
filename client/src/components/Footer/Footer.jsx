import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"; // Icons

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + Description */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Scheme Portal</h1>
          <p className="text-sm">
            Your one-stop platform for accessing the latest and most relevant
            government schemes.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" aria-label="Facebook" className="hover:text-white">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/schemes" className="hover:underline">
                Schemes
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Resources</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Contact Us</h2>
          <p>
            Email:{" "}
            <a
              href="mailto:support@schemeportal.in"
              className="hover:underline"
            >
              support@schemeportal.in
            </a>
          </p>
          <p>Phone: +91-9826878292 +91-7489931006</p>
          <p>Location: Indore, India</p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
        © {new Date().getFullYear()} Scheme Portal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
