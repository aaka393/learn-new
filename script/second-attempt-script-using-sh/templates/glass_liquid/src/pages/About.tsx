import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchAboutData } from '../services/apiService';
import ReactMarkdown from 'react-markdown';
import { useInView } from 'react-intersection-observer';
import { baseUrl } from '../constants/appConstants';
import MotionDiv from '../components/ui/MotionDiv';
import HoverImage from '../components/ui/HoverImage';
import { Users, Target, Lightbulb, Heart } from 'lucide-react';

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
      <div className="flex justify-center items-center min-h-screen animated-bg">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (error || !aboutData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animated-bg min-h-screen">
     
      </div>
    );
  }

  const section = aboutData.blocks.find((b: any) => b.__component === 'about.section');
  const team = aboutData;
  const values = aboutData.blocks.find((b: any) => b.__component === 'about.values');

  return (
    <div className="pt-16 pb-24 animated-bg">
      {/* Header */}
      <div className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <MotionDiv delay={0.1}>
            <h1 className="text-6xl md:text-7xl font-black mb-6 gradient-text">
              {aboutData.title}
            </h1>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {aboutData.subtitle}
            </p>
          </MotionDiv>
        </div>
      </div>

      {section && (
        <AboutSection
          content={section.content}
          imageUrl={baseUrl + section.image?.url}
        />
      )}

      {team && (
        <TeamSection
          team={team.team.map((member: any) => ({
            name: member.name,
            role: member.role,
            bio: member.bio,
            photo: member.photo?.url
              ? baseUrl + member.photo.url
              : undefined,
          }))}
        />
      )}

      {values && <ValuesSection values={values.values} />}
    </div>
  );
};

const AboutSection = ({ content, imageUrl }: { content: any[]; imageUrl: string }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  console.log(content)



  return (
    <section ref={ref} className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <MotionDiv direction="left" delay={0.2}>
            <div className="prose-dark max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                      {children}
                    </p>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-3xl font-bold gradient-text mb-6">
                      {children}
                    </h2>
                  ),
                }}
              >
       
              </ReactMarkdown>
            </div>
          </MotionDiv>
          
          <MotionDiv direction="right" delay={0.4}>
            <div className="relative">
              <motion.div
                className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"
                animate={inView ? { scale: [0.8, 1.1, 1] } : { scale: 0.8 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <HoverImage
                src={imageUrl}
                alt="About"
                className="relative glass-card rounded-3xl overflow-hidden"
              />
            </div>
          </MotionDiv>
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

const TeamSection: React.FC<{ team: TeamMember[] }> = ({ team }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 relative">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <MotionDiv delay={0.1}>
            <div className="flex items-center justify-center mb-6">
              <Users className="text-blue-400 mr-3" size={32} />
              <h2 className="text-5xl md:text-6xl font-black gradient-text">
                Our Team
              </h2>
            </div>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Meet the talented people behind Yensi Solutions
            </p>
          </MotionDiv>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              className="group glass-card p-8 rounded-3xl hover-lift card-hover"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full">
                <HoverImage
                  src={member.photo || `https://i.pravatar.cc/150?img=${index + 1}`}
                  alt={member.name}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 ring-4 ring-blue-500/20 rounded-full group-hover:ring-blue-500/40 transition-all duration-300" />
              </div>
              
              <h3 className="text-xl font-bold text-center text-white mb-2 group-hover:gradient-text transition-all duration-300">
                {member.name}
              </h3>
              <p className="text-blue-400 text-center mb-4 font-medium">{member.role}</p>
              <p className="text-slate-400 text-center leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                {member.bio}
              </p>
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

  const valueIcons = [Target, Lightbulb, Heart, Users];

  return (
    <section ref={ref} className="py-24 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <MotionDiv delay={0.1}>
            <h2 className="text-5xl md:text-6xl font-black mb-6 gradient-text">
              Our Values
            </h2>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              The principles that guide everything we do
            </p>
          </MotionDiv>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const IconComponent = valueIcons[index % valueIcons.length];
            return (
              <motion.div
                key={index}
                className="glass-card p-8 rounded-3xl border border-white/10 hover-lift card-hover group"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-blue-400 mb-6 group-hover:text-blue-300 transition-colors">
                  <IconComponent size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:gradient-text transition-all duration-300">
                  {value.title}
                </h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;