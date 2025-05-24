import { useEffect, useState } from 'react';
import { fetchContactData } from '../services/service';
import { ContactData } from '../types/contact';
import { parseRichText } from '../utils/richTextParser';

export const ContactPage = () => {
  const [contact, setContact] = useState<ContactData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchContactData();
      console.log(data)
      setContact(data);
    };
    loadData();
  }, []);

  if (!contact) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-6">{contact.title}</h1>
      <div
        className="text-lg text-gray-700 mb-6"
        dangerouslySetInnerHTML={{ __html: parseRichText(contact.description) }}
      />
      <div className="bg-white shadow p-6 rounded-lg mb-6">
        <p><strong>Address:</strong> {contact.address}</p>
        <p><strong>Email:</strong> <a href={`mailto:${contact.email}`} className="text-blue-600 underline">{contact.email}</a></p>
        <p><strong>Phone:</strong> <a href={`tel:${contact.phone}`} className="text-blue-600 underline">{contact.phone}</a></p>
      </div>
      <div
        className="h-[400px] rounded overflow-hidden shadow"
        dangerouslySetInnerHTML={{ __html: parseRichText(contact.google_map_embed) }}
      />
      {contact.form_enabled && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Contact Form</h2>
          {/* Replace with your actual form or component */}
          <form className="grid gap-4">
            <input className="border p-2 rounded text-black" placeholder="Your Name" />
            <input className="border p-2 rounded text-black" placeholder="Your Email" />
            <textarea className="border p-2 rounded text-black" placeholder="Your Message" rows={5} />
            <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">Send Message</button>
          </form>
        </div>
      )}
    </div>
  );
};
