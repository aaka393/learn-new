import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface AboutBlock {
  __component: string;
  id: number;
  title?: string;
  body?: string;
  url?: string;
  formats?: {
    medium?: { url: string };
    small?: { url: string };
  };
}

interface AboutData {
  title: string;
  blocks: AboutBlock[];
}

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await axios.get('http://localhost:1337/api/about?populate=*');
        const raw = res.data.data;
        setAboutData({
          title: raw.title,
          blocks: raw.blocks || [],
        });
      } catch (err) {
        setError('Failed to load About content.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!aboutData) return null;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">{aboutData.title}</h1>

      {aboutData.blocks.map((block, index) => {
  const key = `${block.__component}-${block.id}-${index}`;
  switch (block.__component) {
    case 'shared.quote':
      return (
        <div
          key={key}
          className="bg-blue-100 dark:bg-blue-900 p-4 rounded-xl shadow mb-6 border-l-4 border-blue-500"
        >
          <p className="italic text-gray-800 dark:text-gray-200">"{block.body}"</p>
          <p className="text-right font-semibold text-blue-700 dark:text-blue-300 mt-2">– {block.title}</p>
        </div>
      );

    case 'shared.rich-text':
      return (
        <div key={key} className="prose dark:prose-invert max-w-none mb-6">
          <ReactMarkdown>{block.body || ''}</ReactMarkdown>
        </div>
      );

    case 'shared.media':
      const imageUrl =
        block.formats?.medium?.url ||
        block.formats?.small?.url ||
        block.url;
      return (
        <div key={key} className="mb-6">
          {imageUrl && (
            <img
              src={`http://localhost:1337${imageUrl}`}
              alt="About Media"
              className="rounded-xl shadow-md w-full object-cover"
            />
          )}
        </div>
      );

    default:
      return null;
  }
})}

    </main>
  );
};

export default About;
