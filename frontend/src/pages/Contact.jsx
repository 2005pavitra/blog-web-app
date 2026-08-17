import React, { useState } from 'react'
import { useTheme } from '../context/ThemeProvider'

function Contact() {
  const { isDark } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would send the form data to a backend
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Contact Us
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Have questions, suggestions, or want to become a writer? We'd love to hear from you.
          </p>
        </div>
        
        <div className={`rounded-2xl shadow-sm border overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="grid md:grid-cols-5 gap-0">
            
            {/* Contact Information (Left Sidebar) */}
            <div className="bg-slate-900 text-white p-8 md:p-12 md:col-span-2 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">Get in Touch</h2>
                <p className="text-slate-300 mb-10 leading-relaxed text-sm">
                  Fill out the form and our team will get back to you within 24 hours. We're here to help with any inquiries.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="mt-1">
                      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-white">Email</h3>
                      <p className="text-slate-400 mt-1">contact@blogapp.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mt-1">
                      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-white">Phone</h3>
                      <p className="text-slate-400 mt-1">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mt-1">
                      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-white">Address</h3>
                      <p className="text-slate-400 mt-1 leading-relaxed">
                        123 Blog Street, Tech City<br/>
                        TC 12345
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-slate-800">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Business Hours</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex justify-between"><span>Mon - Fri</span> <span>9:00 AM - 6:00 PM</span></li>
                  <li className="flex justify-between"><span>Saturday</span> <span>10:00 AM - 4:00 PM</span></li>
                  <li className="flex justify-between text-slate-500"><span>Sunday</span> <span>Closed</span></li>
                </ul>
              </div>
            </div>
            
            {/* Contact Form (Right Side) */}
            <div className="p-8 md:p-12 md:col-span-3">
              <h2 className={`text-2xl font-bold mb-6 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Jane Doe"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="jane@example.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Write your message here..."
                    rows="6"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-y ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  ></textarea>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all flex justify-center items-center"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact