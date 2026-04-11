import React, { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
    alert("Message sent!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 
    bg-gradient-to-br from-[#020617] via-[#020617] to-black relative overflow-hidden">

      {/* 🔥 Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#3b82f6,transparent_40%)] opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#9333ea,transparent_40%)] opacity-20" />

      {/* 💎 Card */}
      <div className="relative w-full max-w-md p-8 rounded-3xl 
      bg-white/5 backdrop-blur-xl border border-white/10 
      shadow-[0_20px_80px_rgba(0,0,0,0.7)]">

        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Contact Us
        </h2>

        <p className="text-center text-gray-400 mb-6 text-sm">
          We’d love to hear from you. Send us a message and we’ll get back to you as soon as possible!
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-white/10 text-white 
              placeholder-gray-400 border border-white/10 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              transition-all duration-300"
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-white/10 text-white 
              placeholder-gray-400 border border-white/10 
              focus:outline-none focus:ring-2 focus:ring-purple-500 
              transition-all duration-300"
            />
          </div>

          {/* Message */}
          <div>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              required
              className="w-full p-3 rounded-xl bg-white/10 text-white 
              placeholder-gray-400 border border-white/10 
              focus:outline-none focus:ring-2 focus:ring-yellow-400 
              transition-all duration-300 resize-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold 
            bg-gradient-to-r from-blue-500 to-purple-600 
            hover:from-blue-600 hover:to-purple-700 
            text-white transition-all duration-300 
            shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
          >
            Send Message ✉️
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;