import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchFooterData } from '../../services/apiService';
import { FooterData, FooterLink } from '../../types/footer';
import { getLucideIcon } from '../../utils/getLucideIcon';
import AnimatedLink from '../ui/AnimatedLink';
import MotionDiv from '../ui/MotionDiv';
import { Sparkles } from 'lucide-react';
import { footer } from 'framer-motion/client';

const Footer: React.FC = () => {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  console.log("footer", footerData)

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
    <footer className="relative bg-slate-900/80 backdrop-blur-lg text-white border-t border-white/10">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/20 to-purple-900/30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info */}
          <MotionDiv className="lg:col-span-2" delay={0.1}>
            <div className="flex items-center space-x-2 mb-6">
              <motion.div
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles size={16} className="text-white" />
              </motion.div>
              <AnimatedLink
                to="/"
                className="text-2xl font-bold gradient-text"
                variant="glow"
              >
                {footerData.text}
              </AnimatedLink>
            </div>
{/* 
            <div className="text-slate-400 mb-8 max-w-md space-y-3">
              {footerData.description.map((block, i) =>
                block.type === 'paragraph' ? (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="leading-relaxed"
                  >
                    {block.children.map((child, j) => (
                      <span key={j}>{child.text}</span>
                    ))}
                  </motion.p>
                ) : null
              )}
            </div> */}

            <div className="flex space-x-4">
              {footerData.social_links.map((social, index) => {
                const iconElement = getLucideIcon(social.platform);
                return (
                  <motion.a
                    key={social.id}
                    href={social.url}
                    className="glass p-3 rounded-xl text-slate-400 hover:text-white transition-all duration-300 group"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="group-hover:glow-blue transition-all duration-300">
                      {iconElement}
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </MotionDiv>

          {/* Footer Columns */}
          {footerData.footer_columns.map((col, colIndex) => (
            <MotionDiv key={col.id} delay={0.2 + colIndex * 0.1}>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6 relative">
                {col.title}
                <motion.div
                  className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: 32 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              </h3>
              <ul className="space-y-3">
                {col.footer_links.map((link: FooterLink, linkIndex) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: linkIndex * 0.05 }}
                    viewport={{ once: true }}
                  >
                    {link.url ? (
                      <AnimatedLink
                        to={link.url}
                        className="text-slate-400 hover:text-white transition-colors relative group"
                        variant="underline"
                      >
                        {link.name}
                        <motion.div
                          className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"
                        />
                      </AnimatedLink>
                    ) : (
                      <span className="text-slate-500">{link.name}</span>
                    )}
                  </motion.li>
                ))}
              </ul>
            </MotionDiv>
          ))}
        </div>

        <motion.div
          className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} {footerData.text}. All rights reserved.
          </p>

          <motion.div
            className="mt-4 md:mt-0 text-sm text-slate-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            Crafted with ❤️ using modern web technologies
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
