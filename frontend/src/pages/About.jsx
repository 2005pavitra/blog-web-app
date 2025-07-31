import React from 'react'

function About() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">About Our Blog Platform</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">Welcome to Our Blog Community</h2>
              <p className="text-gray-600 leading-relaxed">
                Our blog platform is designed to provide a seamless experience for both readers and content creators. 
                Whether you're here to discover insightful articles or share your knowledge with the world, 
                we've created a space that fosters creativity and meaningful discussions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                We believe in the power of sharing knowledge and experiences. Our mission is to create a platform 
                where ideas can flourish, where diverse perspectives can be shared, and where learning never stops. 
                We're committed to maintaining a respectful and inclusive environment for all our users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">For Readers</h3>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Browse diverse blog categories</li>
                    <li>• Read high-quality content</li>
                    <li>• Easy navigation and search</li>
                    <li>• Responsive design for all devices</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">For Admins</h3>
                  <ul className="text-green-700 space-y-1">
                    <li>• Create and publish blogs</li>
                    <li>• Edit existing content</li>
                    <li>• Manage blog categories</li>
                    <li>• Upload images and media</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">Technology Stack</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our platform is built with modern technologies to ensure reliability, security, and performance:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800">Frontend</h4>
                  <p className="text-gray-600">React.js, Tailwind CSS</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800">Backend</h4>
                  <p className="text-gray-600">Node.js, Express.js</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800">Database</h4>
                  <p className="text-gray-600">MongoDB</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">Get Started</h2>
              <p className="text-gray-600 leading-relaxed">
                Ready to join our community? Register for an account to start exploring blogs, 
                or if you're interested in creating content, contact us about becoming an admin. 
                We're excited to have you as part of our growing community!
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About