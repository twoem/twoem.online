import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  UserIcon,
  AcademicCapIcon,
  ComputerDesktopIcon,
  PrinterIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CameraIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const PublicWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPublicDownloads();
  }, []);

  const fetchPublicDownloads = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/downloads`);
      setDownloads(response.data);
    } catch (error) {
      console.error('Error fetching downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (downloadId, filename) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/downloads/${downloadId}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  const services = [
    {
      title: "eCitizen Services",
      icon: DocumentTextIcon,
      items: [
        "Logbook Transfer",
        "Vehicle Inspection", 
        "Smart DL Application",
        "Handbook DL Renewal",
        "PSV Badge Applications"
      ],
      image: "https://images.unsplash.com/photo-2517445312882-bc9910bb3e3c?w=400&h=300&fit=crop"
    },
    {
      title: "ITAX Services", 
      icon: ComputerDesktopIcon,
      items: [
        "Tax Compliance Certificate",
        "Individual Tax Return",
        "Advanced Tax",
        "Company Returns", 
        "Group KRA PIN Application",
        "KRA PIN Retrieval",
        "Turnover Tax Return"
      ],
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"
    },
    {
      title: "Digital Printing",
      icon: PrinterIcon, 
      items: [
        "Business Cards",
        "Award Certificates",
        "Brochures",
        "Funeral Programs",
        "Handouts",
        "Flyers",
        "Maps", 
        "Posters",
        "Letterheads",
        "Calendars"
      ],
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop"
    },
    {
      title: "Cyber Services",
      icon: GlobeAltIcon,
      items: [
        "Printing",
        "Lamination", 
        "Photocopy",
        "Internet Browsing",
        "Typesetting",
        "Instant Passport Photos",
        "HELB Applications",
        "TSC Online Applications"
      ],
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop"
    },
    {
      title: "Other Services",
      icon: CameraIcon,
      items: [
        "High-Speed Internet",
        "Online Services", 
        "Scanning & Photocopy",
        "Design & Layout",
        "Instant Passport Photos"
      ],
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-black bg-opacity-70 backdrop-blur-md z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/twoem.jpg" 
                alt="TWOEM Logo" 
                className="h-10 w-10 rounded-full"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center';
                }}
              />
              <span className="text-white font-bold text-xl">TWOEM</span>
            </div>
            
            {/* Desktop Menu */}
            <ul className="hidden md:flex space-x-8">
              <li><a href="#home" className="text-white hover:text-blue-300 transition-colors">Home</a></li>
              <li><a href="#services" className="text-white hover:text-blue-300 transition-colors">Services</a></li>
              <li><a href="#downloads" className="text-white hover:text-blue-300 transition-colors">Downloads</a></li>
              <li><a href="#gallery" className="text-white hover:text-blue-300 transition-colors">Gallery</a></li>
              <li><a href="#contact" className="text-white hover:text-blue-300 transition-colors">Contact</a></li>
              <li><a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Login</a></li>
            </ul>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <ul className="space-y-4">
                <li><a href="#home" className="block text-white hover:text-blue-300">Home</a></li>
                <li><a href="#services" className="block text-white hover:text-blue-300">Services</a></li>
                <li><a href="#downloads" className="block text-white hover:text-blue-300">Downloads</a></li>
                <li><a href="#gallery" className="block text-white hover:text-blue-300">Gallery</a></li>
                <li><a href="#contact" className="block text-white hover:text-blue-300">Contact</a></li>
                <li><a href="/login" className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center">Login</a></li>
              </ul>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">TWOEM</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your trusted Cyber Café in Kagwe Town—high-speed internet, printing, lamination, 
            and all your digital needs under one roof.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#services" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              Explore Services
            </a>
            <a 
              href="#contact" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center mb-4">
                      <service.icon className="h-8 w-8 text-blue-400 mr-3" />
                      <h3 className="text-xl font-bold text-white">{service.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {service.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-300 flex items-center">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Our Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
                alt: "Modern Cyber Café",
                title: "Modern Workspace"
              },
              {
                src: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop", 
                alt: "Digital Printing",
                title: "Digital Printing Services"
              },
              {
                src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
                alt: "Online Services", 
                title: "Global Online Services"
              }
            ].map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl">
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white text-lg font-semibold">{image.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Contact Us</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-white">
                <MapPinIcon className="h-6 w-6 text-blue-400" />
                <span>Plaza Building, Kagwe Town (opposite Total Petrol Station)</span>
              </div>
              <div className="flex items-center space-x-4 text-white">
                <PhoneIcon className="h-6 w-6 text-blue-400" />
                <span>0707 330 204 / 0769 720 002</span>
              </div>
              <div className="flex items-center space-x-4 text-white">
                <EnvelopeIcon className="h-6 w-6 text-blue-400" />
                <span>twoemcyber@gmail.com</span>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <a 
                  href="https://wa.me/0707330204" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  WhatsApp Us
                </a>
                <a 
                  href="mailto:twoemcyber@gmail.com"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Email Us
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <form className="bg-black bg-opacity-40 p-6 rounded-xl backdrop-blur-sm">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  required
                />
                <textarea
                  rows="4"
                  placeholder="Your Message"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black bg-opacity-80 py-8">
        <div className="container mx-auto px-4 text-center text-gray-300">
          <p>&copy; 2025 TWOEM Online Productions. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ in Kagwe Town</p>
        </div>
      </footer>

      {/* Floating Login Button */}
      <a 
        href="/login"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-110 z-50"
        title="Login to Portal"
      >
        <UserIcon className="h-6 w-6" />
      </a>
    </div>
  );
};

export default PublicWebsite;