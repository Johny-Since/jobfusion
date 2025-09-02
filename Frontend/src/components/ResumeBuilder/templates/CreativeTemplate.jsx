import React, { forwardRef } from 'react';
import { Phone, Mail, MapPin, Globe, Star } from 'lucide-react';

const CreativeTemplate = forwardRef(({ resumeData }, ref) => {
  const { personalInfo, summary, skills, experience, education, projects, certifications, theme, layout } = resumeData;

  return (
    <div
      ref={ref}
      className="w-full max-w-4xl mx-auto bg-white shadow-lg overflow-hidden"
      style={{
        fontFamily: theme.fontFamily,
        color: theme.textColor,
        backgroundColor: theme.backgroundColor
      }}
    >
      {/* Creative Header with Geometric Shapes */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.accentColor})`
          }}
        />
        <div className="relative p-8">
          <div className="flex items-center gap-8">
            <div className="relative">
              {personalInfo.profileImage ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={personalInfo.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-bold"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {personalInfo.fullName.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              {/* Decorative elements */}
              <div 
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                style={{ backgroundColor: theme.accentColor }}
              />
              <div 
                className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2" style={{ color: theme.primaryColor }}>
                {personalInfo.fullName}
              </h1>
              <h2 className="text-2xl text-gray-600 mb-4">{personalInfo.jobTitle}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accentColor }}>
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span>{personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accentColor }}>
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span>{personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accentColor }}>
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span>{personalInfo.location}</span>
                </div>
                {personalInfo.website && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accentColor }}>
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <span>{personalInfo.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Creative Layout */}
      <div className="p-8">
        {layout.sectionOrder.map((sectionKey, index) => {
          if (!layout.sectionVisibility[sectionKey]) return null;

          const isEven = index % 2 === 0;

          switch (sectionKey) {
            case 'summary':
              return (
                <section key={sectionKey} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-3 h-8 rounded-full"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <h3 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                      About Me
                    </h3>
                  </div>
                  <div 
                    className="p-6 rounded-lg"
                    style={{ backgroundColor: theme.secondaryColor }}
                  >
                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                  </div>
                </section>
              );

            case 'skills':
              return (
                <section key={sectionKey} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-3 h-8 rounded-full"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <h3 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                      Skills & Expertise
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-800">Technical Skills</h4>
                      <div className="space-y-2">
                        {skills.technical.map((skill, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4"
                                  style={{ 
                                    color: i < 4 ? theme.accentColor : '#e5e7eb',
                                    fill: i < 4 ? theme.accentColor : '#e5e7eb'
                                  }}
                                />
                              ))}
                            </div>
                            <span className="text-gray-700">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-800">Soft Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {skills.soft.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: theme.accentColor }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              );

            case 'experience':
              return (
                <section key={sectionKey} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-3 h-8 rounded-full"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <h3 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                      Work Experience
                    </h3>
                  </div>
                  
                  <div className="space-y-6">
                    {experience.map((exp, idx) => (
                      <div key={exp.id} className="relative">
                        {/* Timeline dot */}
                        <div 
                          className="absolute left-0 top-2 w-4 h-4 rounded-full border-4 border-white shadow-md"
                          style={{ backgroundColor: theme.accentColor }}
                        />
                        
                        <div className="ml-8 p-4 rounded-lg" style={{ backgroundColor: isEven ? theme.secondaryColor : 'transparent' }}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-lg font-bold text-gray-800">{exp.position}</h4>
                              <p className="font-semibold" style={{ color: theme.primaryColor }}>{exp.company}</p>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                              <p className="font-medium">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                              {exp.location && <p>{exp.location}</p>}
                            </div>
                          </div>
                          <ul className="space-y-2 text-gray-700">
                            {exp.achievements.map((achievement, achIdx) => (
                              <li key={achIdx} className="flex items-start gap-2">
                                <div 
                                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                                  style={{ backgroundColor: theme.accentColor }}
                                />
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'education':
              return (
                <section key={sectionKey} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-3 h-8 rounded-full"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <h3 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                      Education
                    </h3>
                  </div>
                  
                  {education.map((edu) => (
                    <div 
                      key={edu.id} 
                      className="p-4 rounded-lg mb-4"
                      style={{ backgroundColor: theme.secondaryColor }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                          <p className="text-gray-600 font-medium">{edu.institution}</p>
                          {edu.gpa && <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>}
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{edu.startDate} - {edu.endDate}</p>
                          {edu.location && <p>{edu.location}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              );

            case 'projects':
              return (
                <section key={sectionKey} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-3 h-8 rounded-full"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <h3 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                      Featured Projects
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                      <div 
                        key={project.id} 
                        className="p-6 rounded-lg border-l-4"
                        style={{ 
                          backgroundColor: theme.secondaryColor,
                          borderLeftColor: theme.accentColor
                        }}
                      >
                        <h4 className="font-bold text-gray-800 mb-2">{project.name}</h4>
                        <p className="text-gray-700 mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 rounded text-xs font-medium text-white"
                              style={{ backgroundColor: theme.accentColor }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        {project.link && (
                          <a 
                            href={project.link} 
                            className="text-sm font-medium hover:underline"
                            style={{ color: theme.primaryColor }}
                          >
                            View Project →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'certifications':
              return (
                <section key={sectionKey} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-3 h-8 rounded-full"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <h3 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                      Certifications & Awards
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certifications.map((cert) => (
                      <div 
                        key={cert.id} 
                        className="p-4 rounded-lg border border-gray-200"
                        style={{ backgroundColor: theme.secondaryColor }}
                      >
                        <h4 className="font-bold text-gray-800">{cert.name}</h4>
                        <p className="text-gray-600">{cert.issuer}</p>
                        <p className="text-gray-500 text-sm">{cert.date}</p>
                        {cert.credentialId && (
                          <p className="text-gray-500 text-xs mt-1">ID: {cert.credentialId}</p>
                        )}
                      </div>
                    ))}
                  </div>
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

CreativeTemplate.displayName = 'CreativeTemplate';

export default CreativeTemplate;