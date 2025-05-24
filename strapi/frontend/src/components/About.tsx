import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { fetchAboutData } from '../services/service';
import { baseUrl } from '../constants/appConstants';

interface AboutBlock {
  __component: string;
  id: number;
  title?: string;
  body?: string;
  url?: string;
  media?: {
    url?: string;
  }
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
    const loadAboutData = async () => {
      try {
        const fetchedAboutData = await fetchAboutData();
        setAboutData(fetchedAboutData);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to load About content.');
        setLoading(false);
      }
    };

    loadAboutData();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!aboutData) return null;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-10 text-center">
        {aboutData?.title}
      </h1>

      {aboutData?.blocks.map((block: AboutBlock, index: number) => {
        const key = `${block.__component}-${block.id}-${index}`;

        switch (block.__component) {
          case 'shared.quote':
            return (
              <div
                key={key}
                className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-800 p-6 rounded-xl shadow-md mb-8"
              >
                <p className="text-xl italic text-gray-800 dark:text-gray-100">"{block.body}"</p>
                <p className="text-right text-blue-800 dark:text-blue-300 font-semibold mt-4">
                  – {block.title}
                </p>
              </div>
            );

          case 'shared.rich-text':
            return (
              <div
                key={key}
                className="prose dark:prose-invert max-w-none mb-8 prose-h1:text-3xl prose-h2:text-2xl prose-p:text-lg"
              >
                <ReactMarkdown>{block.body || ''}</ReactMarkdown>
              </div>
            );

          case 'shared.media':
            const imageUrl = (`${baseUrl}${block?.media?.url}`);
            return (
              <div key={key} className="mb-8">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="About Media"
                    className="rounded-xl shadow-lg w-full object-cover"
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
