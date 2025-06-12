import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFooterData } from '../../services/apiService';
import { FooterData, FooterLink } from '../../types/footer';
import { getLucideIcon } from '../../utils/getLucideIcon'; 

const Footer: React.FC = () => {
  const [footerData, setFooterData] = useState<FooterData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchFooterData();
      console.log(data)
      if (data) {
        setFooterData(data);
      }
    };

    loadData();
  }, []);

  if (!footerData) return null;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-xl font-bold mb-4 block">
              {footerData.text}
            </Link>




          </div>


        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {footerData.text}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
