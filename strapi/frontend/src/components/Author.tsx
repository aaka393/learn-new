import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AuthorData {
  id: number;
  name: string;
  email: string;
}

const Author: React.FC = () => {
  const [authorData, setAuthorData] = useState<AuthorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/articles?populate=author');
        // Extract author from the first article in the response
        console.log(response)
        const articles = response.data.data;
        if (articles && articles.length > 0 && articles[1].author) {
          setAuthorData(articles[1].author);
        } else {
          setError('No author data found.');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load author data. Please try again.');
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, []);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p>Loading author data...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p>Error: {error}</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">About the Author</h2>
        {authorData && (
          <>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{authorData.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Email: {authorData.email}
            </p>
          </>
        )}
      </section>
    </main>
  );
};

export default Author;
