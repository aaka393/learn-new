import React, { useState, useEffect } from 'react';
import { fetchContactData } from '../services/service';
import { ContactData } from '../types/contact';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  }>({
    submitted: false,
    success: false,
    message: '',
  });

  useEffect(() => {
    const loadContactData = async () => {
      try {
        const data = await fetchContactData();
        setContactData(data);
        document.title = 'Contact | Yensi Solution';
      } catch (error) {
        console.error('Failed to load contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContactData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formState.name || !formState.email || !formState.message) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Please fill out all required fields.',
      });
      return;
    }
    
    // Simulate form submission
    setFormStatus({
      submitted: true,
      success: true,
      message: 'Your message has been sent! We will get back to you soon.',
    });
    
    // Reset form
    setFormState({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!contactData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Contact information not available.</p>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20">
      <header className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{contactData.title}</h1>
          {contactData.description && (
            <div className="text-xl text-gray-600 max-w-3xl mx-auto">
              {contactData.description[0].children[0].text}
            </div>
          )}
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-medium text-lg mb-1">Address</h3>
                  <p className="text-gray-600">{contactData.address}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-medium text-lg mb-1">Email</h3>
                  <a 
                    href={`mailto:${contactData.email}`} 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {contactData.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-medium text-lg mb-1">Phone</h3>
                  <a 
                    href={`tel:${contactData.phone}`} 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {contactData.phone}
                  </a>
                </div>
              </div>
            </div>
            
            {/* Map */}
            <div className="mt-12 h-80 rounded-xl overflow-hidden shadow-md">
              {contactData.google_map_embed && (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: contactData.google_map_embed[0].children[0].text 
                  }} 
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            
            {formStatus.submitted && (
              <div className={`mb-6 p-4 rounded-lg ${formStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {formStatus.message}
              </div>
            )}
            
            {contactData.form_enabled && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  Send Message
                  <Send className="ml-2 h-5 w-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;