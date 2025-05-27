import React, { useState, useEffect } from 'react';
import { fetchAboutData, getAboutImageUrl } from '../services/apiService';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useInView } from 'react-intersection-observer';

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

  // Fallback content if API data is incomplete
  const fallbackContent = {
    title: "About Yensi Solutions",
    subtitle: "Our story and vision",
    content: "Yensi Solutions is a cutting-edge technology company that specializes in web development and robotics solutions. Our mission is to bring your digital vision to life with innovative solutions that are as dynamic as your business needs.",
    team: [
      {
        name: "Aakash",
        role: "Founder & CEO",
        bio: "Tech visionary with expertise in web development and robotics."
      },
      {
        name: "Nitish",
        role: "CTO",
        bio: "Engineering leader with a focus on innovative solutions."
      },
      {
        name: "Rakesh",
        role: "Lead Developer",
        bio: "Full-stack developer with experience in complex systems."
      },
      {
        name: "chandu",
        role: "Senior Developer",
        bio: "Creative coder with a passion for building user-friendly applications."
      }
    ],
    imageUrl: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600",
  };

  // Use actual data if available, otherwise use fallback
  const content = aboutData?.blocks?.[0]?.content || fallbackContent.content;
  const title = aboutData?.title || fallbackContent.title;
  const team = fallbackContent.team; // Using fallback team data as example

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
            {title}
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {fallbackContent.subtitle}
          </motion.p>
        </div>
      </div>
      
      {/* Main Content */}
      <AboutSection content={content} imageUrl={fallbackContent.imageUrl} />
      
      {/* Team Section */}
      <TeamSection team={team} />
      
      {/* Values Section */}
      <ValuesSection />
    </div>
  );
};

interface AboutSectionProps {
  content: string;
  imageUrl: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ content, imageUrl }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={imageUrl} 
                alt="About Yensi Solutions" 
                className="w-full h-auto"
              />
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
}

interface TeamSectionProps {
  team: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            Our Team
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                {/* Placeholder avatar - in real implementation, use member's photo */}
                <img 
                  src={`https://i.pravatar.cc/150?img=${index + 1}`} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-1">
                {member.name}
              </h3>
              
              <p className="text-blue-500 text-center mb-4">
                {member.role}
              </p>
              
              <p className="text-gray-600 text-center">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ValuesSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const values = [
    {
      title: "Innovation",
      description: "We're constantly pushing boundaries and exploring new technologies to deliver cutting-edge solutions."
    },
    {
      title: "Excellence",
      description: "We strive for excellence in everything we do, from code quality to user experience."
    },
    {
      title: "Collaboration",
      description: "We believe in working closely with our clients to ensure we're delivering exactly what they need."
    },
    {
      title: "Integrity",
      description: "We're committed to transparency, honesty, and ethical business practices in all our dealings."
    }
  ];

  return (
    <section ref={ref} className="py-16 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            Our Values
          </motion.h2>
          
          <motion.p 
            className="text-xl text-blue-100 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-4">
                {value.title}
              </h3>
              
              <p className="text-blue-100">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;