import React from "react";

interface OurPatternProps {
  imageSize?: string; // Tailwind size class (e.g., 'w-16', 'w-24')
}

const OurPattern: React.FC<OurPatternProps> = ({
  imageSize = "w-48", // Increased default size
}) => {
  // List of logos
  const logos = [
    { src: "/assets/edu.png", border: "border-yellow-300" }, 
    { src: "/assets/40.png", border: "border-yellow-300" },
    { src: "/assets/teacher.png", border: "border-sky-300" },   
    { src: "/assets/oromia.png", border: "border-sky-300" },
    { src: "/assets/bulti.png", border: "border-yellow-300" },
    { src: "/assets/bulti.png", border: "border-yellow-300" },
    { src: "/assets/bulti.png", border: "border-yellow-300" },
    { src: "/assets/bulti.png", border: "border-yellow-300" },
    { src: "/assets/bulti.png", border: "border-yellow-300" },
    { src: "/assets/bulti.png", border: "border-yellow-300" },
    { src: "/assets/bulti.png", border: "border-yellow-300" }
  ];

  // Duplicate logos for seamless marquee
  const marqueeLogos = [...logos, ...logos];

  return (
    <div className="w-full h-64 bg-gradient-to-r from-yellow-100 to-sky-100 relative overflow-hidden">
      {/* Header */}
      <div className="w-full bg-white text-blue text-center py-3">
        <h1 className="text-2xl font-bold">Our Partners</h1>
      </div>

      {/* Marquee container */}
      <div className="w-full h-52 flex speed-10 items-center overflow-hidden relative">
        {/* Animated row */}
        <div
          className="
            flex items-center space-x-15
            animate-[marquee_10s_linear_infinite]
            whitespace-nowrap
          "
        >
          {marqueeLogos.map((logo, index) => (
            <img
              key={index}
              src={logo.src}
              alt={`Logo ${index}`}
              className={`h-40 object-contain rounded-lg shadow-md border-2 ${logo.border}`}
            />
          ))}
        </div>
      </div>

      {/* Inline Tailwind keyframes */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </div>
  );
};

export default OurPattern;
