import React from 'react';

const ExamPackages: React.FC = () => {
  return (
    <section className="bg-gray-100 py-8 px-4">
      <h2 className="text-orange-500 text-2xl md:text-3xl font-bold text-center">Our Exam Packages</h2>
      <p className="text-gray-600 text-sm md:text-base text-center mt-2">Digitalexamplatform Website to write Exams...</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 mx-auto bg-cyan-500 rounded-full flex items-center justify-center mb-4">
            <img src="/assets/bank-icon.png" alt="Bank" className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold">Bank Exams</h3>
          <p className="text-gray-600 text-sm mt-2">SBI PO | SBI Clerk | IBPS PO | IBPS Clerk</p>
          <button className="mt-4 bg-cyan-500 text-white px-4 py-2 rounded text-sm">View Packages &gt;</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 mx-auto bg-cyan-500 rounded-full flex items-center justify-center mb-4">
            <img src="/assets/group-icon.png" alt="Group" className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold">Group Exams</h3>
          <p className="text-gray-600 text-sm mt-2">Group I Exams | Group II Exams | Group III Exams | Group IV Exams</p>
          <button className="mt-4 bg-cyan-500 text-white px-4 py-2 rounded text-sm">View Packages &gt;</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 mx-auto bg-cyan-500 rounded-full flex items-center justify-center mb-4">
            <img src="/assets/railway-icon.png" alt="Railway" className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold">Railway Exams</h3>
          <p className="text-gray-600 text-sm mt-2">Railway NTPC | Railway Protection Force | Ticket Collector | Track man</p>
          <button className="mt-4 bg-cyan-500 text-white px-4 py-2 rounded text-sm">View Packages &gt;</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 mx-auto bg-cyan-500 rounded-full flex items-center justify-center mb-4">
            <img src="/assets/upsc-icon.png" alt="UPSC" className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold">UPSC Civil Services</h3>
          <p className="text-gray-600 text-sm mt-2">Indian Administrative Services | Indian Foreign Service | Indian Police Service</p>
          <button className="mt-4 bg-cyan-500 text-white px-4 py-2 rounded text-sm">View Packages &gt;</button>
        </div>
      </div>
    </section>
  );
};

export default ExamPackages;