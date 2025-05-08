import React, { useEffect, useState } from 'react';

interface Post {
  id: number;
  title: {
    rendered: string;
  };
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://192.168.0.105:8001/wp-json/wp/v2/posts");
        if (!response.ok) {
          throw new Error("HTTP error! status: " + response.status);
        }
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title.rendered}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;