import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResumeBuilder from '../components/ResumeBuilder/ResumeBuilder';
import Template05 from '../assets/Screenshot (67).png';

export default function MainSection() {
  const [currentTip, setCurrentTip] = useState(0);
  const [showBuilder, setShowBuilder] = useState(false);

  const resumeTips = [
    {
      title: "Keep It Concise & Relevant",
      text: "Limit your resume to one or two pages (unless you have extensive experience). Focus on relevant skills and experiences related to the job you're applying for.",
    },
    {
      title: "Use a Professional Format & Layout",
      text: "Use a clean, easy-to-read font (e.g., Arial, Calibri, Times New Roman). Maintain consistent spacing, margins, and bullet points for clarity. Stick to reverse chronological order (most recent experiences first).",
    },
    {
      title: "Craft a Strong Summary Statement",
      text: "A 3-4 line professional summary at the top should highlight your key skills, experience, and career goals. Example: 'Results-driven marketing specialist with 5+ years of experience in digital campaigns, content creation, and brand strategy. Proven ability to increase engagement by 40%.'",
    },
    {
      title: "Use Strong Action Words",
      text: "Start bullet points with power words like 'Managed,' 'Designed,' 'Developed,' 'Increased,' 'Led,' 'Achieved,' etc. Example: 'Optimized website performance, reducing load time by 30% and improving user experience.'",
    },
    {
      title: "Quantify Your Achievements",
      text: "Numbers make an impact. Use metrics to showcase your accomplishments. Example: 'Increased sales by 25% in six months through targeted email campaigns.'",
    },
    {
      title: "Tailor Your Resume for Each Job",
      text: "Customize your resume by matching keywords from the job description. Highlight skills and experience that align with the role you're applying for.",
    },
    {
      title: "Highlight Key Skills & Certifications",
      text: "Include a dedicated 'Skills' section with technical and soft skills relevant to the job. Mention industry-specific tools (e.g., Python, Photoshop, Google Analytics).",
    },
    {
      title: "Optimize for ATS",
      text: "Many companies use ATS software to filter resumes before human review. Use keywords from the job posting to increase your chances of passing ATS.",
    },
    {
      title: "Keep It Error-Free",
      text: "Double-check grammar, spelling, and formatting. Use Grammarly or ask a friend to proofread your resume.",
    },
    {
      title: "Include Strong Contact Information",
      text: "Clearly mention your name, phone number, professional email, LinkedIn profile, and portfolio (if applicable).",
    },
  ];

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % resumeTips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + resumeTips.length) % resumeTips.length);
  };

  const testimonials = [
    {
      text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      author: "Austin Distel",
      position: "Product Designer, Google",
    },
  ];

  const templates = [
    { 
      id: 1, 
      image: '/Re_Temp_001.png',
      path: "/resume/template01",
    },
    { 
      id: 2, 
      image: '/Temp - 02.png',
      path: "/resume/template02",
    },
    { 
      id: 3, 
      image: '/Temp - 03.png',
      path: "/resume/template03",
    },
    { 
      id: 4, 
      image: "https://www.resumebuilder.com/wp-content/uploads/2023/12/Homepage-7-New-2.png",
      path: "/resume/template04",
    },
    {
      id: 5, 
      image: Template05,
      path: "/resume/template05",
    },
    {
      id: 6,
      image: "https://www.resumebuilder.com/wp-content/uploads/2023/12/Homepage-7-New-2.png",
      path: "/resume/template06",
    }
  ];

  // Function to handle scrolling to templates section
  const scrollToTemplates = () => {
    setShowBuilder(true);
  };

  if (showBuilder) {
    return <ResumeBuilder />;
  }

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="bg-black-50 py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
              Stand out with a professionally designed resume
            </h1>
            <p className="text-gray-600 text-lg">
              By employing the best practices and innovative tech, Resume Builder boosts
              your chances of landing a better job - completely for free.
            </p>
            <button 
              onClick={scrollToTemplates}
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              Start Building Resume
            </button>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -right-4 top-0 z-10">
              <div className="bg-green-50 p-2 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black text-white p-6 rounded-lg">
                <h3 className="font-bold mb-4">FEATURE</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Personal Details</li>
                  <li>• Experience</li>
                  <li>• Education</li>
                  <li>• Skills</li>
                  <li>• Languages</li>
                  <li>• Certificates</li>
                  <li>• Summary</li>
                </ul>
              </div>
              <img
                src="https://www.resumebuilder.com/wp-content/uploads/2024/07/Parallax-1.png"
                alt="Resume builder interface"
                className="rounded-lg object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-black-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Tips For Making A Resume</h2>
          <div className="relative bg-white rounded-xl shadow-lg p-8 md:p-12">
            <button 
              onClick={prevTip}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              aria-label="Previous tip"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="text-center px-8 md:px-12 min-h-[200px] flex flex-col justify-center">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    Tip {currentTip + 1} of {resumeTips.length}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  {resumeTips[currentTip].title}
                </h3>
                <p className="text-gray-600 md:text-lg">
                  {resumeTips[currentTip].text}
                </p>
              </div>
            </div>

            <button 
              onClick={nextTip}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              aria-label="Next tip"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="mt-8 flex justify-center gap-2">
              {resumeTips.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTip(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentTip === index ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
                  }`}
                  aria-label={`Go to tip ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section 
        id="resume-templates"
        className="py-16 px-4 md:px-8 lg:px-16"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Resume Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
                onClick={() => setShowBuilder(true)}
              >
                  <img
                    src={template.image}
                    alt={`Resume template ${template.id}`}
                    className="w-full h-auto"
                    loading="lazy"
                    onError={(e) => console.error(`Failed to load image: ${template.image}`, e)}
                  />
                  <div className="p-4 text-center">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Use This Template
                    </button>
                  </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => setShowBuilder(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start with Advanced Builder
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}