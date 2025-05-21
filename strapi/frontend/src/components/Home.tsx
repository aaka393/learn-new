import React from 'react';

const Home: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Welcome to the Strapi Blog</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This is the home page of our blog.
        </p>
      </section>
    </main>
  );
};

export default Home;
