import React, { useEffect, useState } from 'react';
import { fetchFooterData } from '../services/service';

const Footer: React.FC = () => {
  const [text, setText] = useState<string>('Loading footer...');

  useEffect(() => {
    const loadFooter = async () => {
      const data = await fetchFooterData();
      if (data?.text) {
        setText(data.text);
      }
    };

    loadFooter();
  }, []);

  return (
    <footer className="bg-gray-200 dark:bg-gray-700 py-4 mt-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 dark:text-gray-300">{text}</p>
      </div>
    </footer>
  );
};

export default Footer;

