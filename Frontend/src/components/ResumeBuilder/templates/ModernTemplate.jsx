import React, { forwardRef } from 'react';
import { Phone, Mail, MapPin, Globe, Linkedin, Github } from 'lucide-react';

const ModernTemplate = forwardRef(({ resumeData }, ref) => {
  const { personalInfo, summary, skills, experience, education, projects, certifications, theme, layout } = resumeData;

  return (
    <div
      ref={ref}
      className="w-full max-w-4xl mx-auto bg-white shadow-lg"
      style={{
        fontFamily: theme.fontFamily,
        color: theme.textColor,
        backgroundColor: theme.backgroundColor
      }}
    >
      {/* Header */}
      <div
        className="p-8 text-white"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <div className="flex items-center gap-6">
          {personalInfo.profileImage && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30">
              <img 
                src={personalInfo.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName}</h1>
            <h2 className="text-xl opacity-90">{personalInfo.jobTitle}</h2>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{personalInfo.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{personalInfo.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{personalInfo.location}</span>
          </div>
          {personalInfo.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {layout.sectionOrder.map((sectionKey) => {
          if (!layout.sectionVisibility[sectionKey]) return null;

          switch (sectionKey) {
            case 'summary':
              return (
                <section key={sectionKey} className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 border-b-2 pb-2" style={{ borderColor: theme.accentColor }}>
                    Professional Summary
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{summary}</p>
                </section>
              );

            case 'experience':
              return (
                <section key={sectionKey} className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 border-b-2 pb-2" style={{ borderColor: theme.accentColor }}>
                    Work Experience
                  </h3>
                  {experience.map((exp, index) => (
                    <div key={exp.id} className="mb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold">{exp.position}</h4>
                          <p className="text-gray-600 font-medium">{exp.company}</p>
                          {exp.location && <p className="text-gray-500 text-sm">{exp.location}</p>}
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                        </div>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              );

            case 'education':
              return (
                <section key={sectionKey} className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 border-b-2 pb-2" style={{ borderColor: theme.accentColor }}>
                    Education
                  </h3>
                  {education.map((edu, index) => (
                    <div key={edu.id} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.institution}</p>
                          {edu.location && <p className="text-gray-500 text-sm">{edu.location}</p>}
                          {edu.gpa && <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>}
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{edu.startDate} - {edu.endDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              );

            case 'skills':
              return (
                <section key={sectionKey} className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 border-b-2 pb-2" style={{ borderColor: theme.accentColor }}>
                    Skills
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-800">Technical Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {skills.technical.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: theme.accentColor }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-800">Soft Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {skills.soft.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full text-sm font-medium border-2"
                            style={{ 
                              borderColor: theme.accentColor,
                              color: theme.accentColor
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              );

            case 'projects':
              return (
                <section key={sectionKey} className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 border-b-2 pb-2" style={{ borderColor: theme.accentColor }}>
                    Projects
                  </h3>
                  {projects.map((project, index) => (
                    <div key={project.id} className="mb-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold">{project.name}</h4>
                        {project.link && (
                          <a href={project.link} className="text-blue-600 hover:text-blue-700 text-sm">
                            View Project
                          </a>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                        {project.highlights.map((highlight, idx) => (
                          <li key={idx}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              );

            case 'certifications':
              return (
                <section key={sectionKey} className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 border-b-2 pb-2" style={{ borderColor: theme.accentColor }}>
                    Certifications
                  </h3>
                  {certifications.map((cert, index) => (
                    <div key={cert.id} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{cert.name}</h4>
                          <p className="text-gray-600">{cert.issuer}</p>
                          {cert.credentialId && (
                            <p className="text-gray-500 text-sm">ID: {cert.credentialId}</p>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{cert.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
});

ModernTemplate.displayName = 'ModernTemplate';

export default ModernTemplate;