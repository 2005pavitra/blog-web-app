import React from 'react'

function About() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            About Our Blog Platform
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A minimalist, editorial space for readers to discover insights and for writers to share their stories with the world.
          </p>
        </div>
        
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-12">
          
          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Welcome to Our Community</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Our platform is designed to provide a seamless experience for both readers and content creators. 
              Whether you're here to discover insightful articles or share your knowledge with the world, 
              we've created a space that fosters creativity and meaningful discussions without the clutter.
            </p>
          </section>

          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Our Mission</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              We believe in the power of sharing knowledge and experiences. Our mission is to create a platform 
              where ideas can flourish, where diverse perspectives can be shared, and where learning never stops. 
              We're committed to maintaining a respectful and inclusive environment for all our users.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Readers Card */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:border-amber-200 transition-colors group">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 mb-4 group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">For Readers</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start"><span className="mr-2">📚</span> Browse diverse blog categories</li>
                  <li className="flex items-start"><span className="mr-2">✨</span> Read high-quality curated content</li>
                  <li className="flex items-start"><span className="mr-2">🔍</span> Easy navigation and search</li>
                  <li className="flex items-start"><span className="mr-2">📱</span> Fully responsive beautiful design</li>
                </ul>
              </div>

              {/* Admins Card */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors group">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">For Writers</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start"><span className="mr-2">✍️</span> Create and publish rich stories</li>
                  <li className="flex items-start"><span className="mr-2">✏️</span> Edit existing content seamlessly</li>
                  <li className="flex items-start"><span className="mr-2">🗂️</span> Manage blog categories</li>
                  <li className="flex items-start"><span className="mr-2">🖼️</span> Upload beautiful cover images</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center hover:shadow-md transition-shadow">
                <div className="w-10 h-10 mx-auto bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">Frontend</h4>
                <p className="text-slate-500 font-medium text-sm">React 18 & Vite<br/>Tailwind CSS 3</p>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center hover:shadow-md transition-shadow">
                <div className="w-10 h-10 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">Backend</h4>
                <p className="text-slate-500 font-medium text-sm">Node.js<br/>Express.js</p>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center hover:shadow-md transition-shadow">
                <div className="w-10 h-10 mx-auto bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">Database</h4>
                <p className="text-slate-500 font-medium text-sm">MongoDB<br/>Mongoose</p>
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100 pt-8 mt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Get Started</h2>
            <p className="text-slate-600 text-lg mb-6">
              Ready to join our community? Register for an account to start exploring blogs, 
              or if you're interested in creating content, contact us about becoming an admin. 
              We're excited to have you!
            </p>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default About