import React from 'react';
import { motion } from 'framer-motion';

const Faculties: React.FC = () => {
  const faculties = [
    {
      name: 'Science & Technology',
      description: 'Physics, Chemistry, Biology, and ICT for modern learners.',
      img: '/assets/faculty-science.png',
      color: 'from-cyan-400 to-blue-500',
    }, 
    {
      name: 'Arts & Humanities',
      description: 'Literature, History, Languages, and Social Sciences.',
      img: '/assets/faculty-arts.png',
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Business & Economics',
      description: 'Business administration, Economics, Accounting, and Entrepreneurship.',
      img: '/assets/faculty-business.png',
      color: 'from-yellow-400 to-orange-500',
    }, 
    {
      name: 'Health Sciences',
      description: 'Nursing, Public Health, and Biomedical Sciences.',
      img: '/assets/faculty-health.png',
      color: 'from-red-400 to-pink-500',
    }, 
    {
      name: 'Agriculture & Environmental Studies',
      description: 'Agricultural tech, environmental science, and sustainability.',
      img: '/assets/faculty-agriculture.png',
      color: 'from-green-500 to-lime-500',
    },
    {
      name: 'Technology & Innovation',
      description: 'Computer science, AI, and digital innovation courses.',
      img: '/assets/faculty-tech.png',
      color: 'from-cyan-500 to-teal-500',
    },
  ];

  return (
    <section className="py-8 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-2xl md:text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Faculties
        </motion.h2>
        <motion.p
          className="text-sm md:text-base mb-10 text-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Explore faculties providing top-quality education for Universities and High Schools across Ethiopia.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {faculties.map((faculty, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-r ${faculty.color} rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.img
                src={faculty.img}
                alt={faculty.name}
                className="w-full h-24 object-cover" // <-- Smaller image height
                animate={{ y: [0, -8, 0] }}  // subtle floating effect
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="p-3 bg-white">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{faculty.name}</h3>
                <p className="text-gray-600 text-xs">{faculty.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faculties;
