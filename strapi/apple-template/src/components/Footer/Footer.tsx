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

            <div className="text-gray-400 mb-4 max-w-md space-y-2">
              {footerData.description.map((block, i) =>
                block.type === 'paragraph' ? (
                  <p key={i}>
                    {block.children.map((child, j) => (
                      <span key={j}>{child.text}</span>
                    ))}
                  </p>
                ) : null
              )}
            </div>

            <div className="flex space-x-4">
              {footerData.social_links.map((social) => {
                const iconElement = getLucideIcon(social.platform); // ✅ Use util here
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                  >
                    {iconElement}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Columns */}
          {footerData.footer_columns.map((col) => (
            <div key={col.id}>
              <h3 className="text-sm font-semibold text-gray-100 tracking-wider uppercase mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.footer_links.map((link: FooterLink) => (
                  <li key={link.id}>
                    {link.url ? (
                      <Link
                        to={link.url}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <span className="text-gray-500">{link.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
