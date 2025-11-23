import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative">
      <div className="flex flex-col md:flex-row">
        {/* Left half of the image */}
        <div className="w-full md:w-1/2">
          <img
            src="/assets/banner.jpg" // Placeholder; replace with actual image path in public/assets or src/assets
            alt="Person studying on laptop"
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
        {/* Right half of the image */}
        <div className="w-full md:w-1/2">
          <img
            src="/assets/rvu-logo.png" // Placeholder; replace with actual image path
            alt="Person studying on laptop"
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
      </div>
      <div className="bg-white py-8 px-4 text-center">
        <h1 className="text-blue-700 text-2xl md:text-3xl font-bold">Ethiopia Digital Exam Platform</h1>
        <p className="text-gray-600 text-sm md:text-base mt-2">
          Have a look About Exam Platform...
        </p>
        <p className="text-gray-700 mt-4 max-w-3xl mx-auto text-sm md:text-base">
          Welcome to Ethiopia Digital Exam Platform. Leading Online Examination Platform in Ethiopia. Our Online Examination Platform Includes in detailed Exam Reports which will help the Students to Improve their preparation for the exams. You can write exams in 3 different styles like Practice Exams, Mock Exams and Live Exams so that you will get more practice for your exams. Leading Online Examination Platform in Ethiopia.
        </p>
        <button className="mt-6 bg-cyan-500 text-white px-6 py-2 rounded text-sm md:text-base">
          Read more &gt;
        </button>
      </div>
    </section>
  );
};

export default Hero;