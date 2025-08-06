import React, { useState } from "react";
import axios from "axios";
import { Mail, User, MessageCircle, Loader2 } from "lucide-react";
import api from "@/api";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ New

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Start loading
    setSuccess(null); // Clear previous status
    try {
      await api.post("/api/contact", form);
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setSuccess(false);
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 max-w-xl w-full border border-indigo-200">
        <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-6">
          Contact Us
        </h2>

        {success === true && (
          <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-center">
            ✅ Your message has been sent!
          </div>
        )}
        {success === false && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-center">
            ❌ Something went wrong. Please try again later.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500"
              size={20}
            />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500"
              size={20}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          {/* Message */}
          <div className="relative">
            <MessageCircle
              className="absolute left-3 top-3 text-indigo-500"
              size={20}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              required
              value={form.message}
              onChange={handleChange}
              className="w-full pl-10 pr-4 pt-3 pb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition min-h-[120px]"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 font-medium py-2 rounded-lg transition 
              ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } 
              text-white`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
