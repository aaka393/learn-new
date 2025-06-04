import React, { useState, useEffect } from 'react';
import { fetchAboutData } from '../services/apiService';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useInView } from 'react-intersection-observer';
import { baseUrl } from '../constants/appConstants';

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const data = await fetchAboutData();
        setAboutData(data);
      } catch (err) {
        console.error('Failed to load about data:', err);
        setError('Failed to load about content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !aboutData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error || 'About content not found'}</p>
        </div>
      </div>
    );
  }

  const section = aboutData.blocks.find((b: any) => b.__component === 'about.section');
  const team = aboutData;
  const values = aboutData.blocks.find((b: any) => b.__component === 'about.values');

  return (
    <div className="pt-16 pb-24">
      {/* Header */}
      <div className="bg-gray-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {aboutData.title}
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {aboutData.subtitle}
          </motion.p>
        </div>
      </div>

      {section && (
        <AboutSection
          content={section.content}
          imageUrl={baseUrl + section.image?.url}
        />
      )}

      {team && (
        <>
          <TeamSection
            team={team.team.map((member: any) => {
              return {
                name: member.name,
                role: member.role,
                bio: member.bio,
                photo: member.photo?.url
                  ? baseUrl + member.photo.url
                  : undefined,
              };
            })}
          />
        </>
      )}

      {values && <ValuesSection values={values.values} />}
    </div>
  );
};


const AboutSection = ({ content, imageUrl }: { content: any[]; imageUrl: string }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const parsedContent = content
    .map((block) =>
      block.children.map((child: any) => child.text).join(' ')
    )
    .join('\n\n');

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{parsedContent}</ReactMarkdown>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={imageUrl} alt="About" className="w-full h-auto" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo?: string;
}

interface TeamSectionProps {
  team: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  console.log("team", team);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Our Team
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Meet the talented people behind Yensi Solutions
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-24 h-24 bg-gray-200 rounded mx-auto mb-4 overflow-hidden">
                <img
                  src={member.photo || `https://i.pravatar.cc/150?img=${index + 1}`}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-1">
                {member.name}
              </h3>
              <p className="text-blue-500 text-center mb-4">{member.role}</p>
              <p className="text-gray-600 text-center">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface ValueItem {
  title: string;
  description: string;
}

const ValuesSection: React.FC<{ values: ValueItem[] }> = ({ values }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-16 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Our Values
          </motion.h2>
          <motion.p
            className="text-xl text-blue-100 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            The principles that guide everything we do
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="bg-blue-700 p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
              <p className="text-blue-100">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
