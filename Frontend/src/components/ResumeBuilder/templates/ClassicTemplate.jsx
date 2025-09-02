import React, { forwardRef } from 'react';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';

const ClassicTemplate = forwardRef(({ resumeData }, ref) => {
  const { personalInfo, summary, skills, experience, education, certifications, theme, layout } = resumeData;

  return (
    <div
      ref={ref}
      className="w-full max-w-4xl mx-auto bg-white"
      style={{
        fontFamily: theme.fontFamily,
        color: theme.textColor,
        backgroundColor: theme.backgroundColor,
        fontSize: theme.fontSize === 'small' ? '12px' : theme.fontSize === 'large' ? '16px' : '14px'
      }}
    >
      {/* Header */}
      <div className="text-center border-b-2 pb-6 mb-6" style={{ borderColor: theme.primaryColor }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.primaryColor }}>
          {personalInfo.fullName}
        </h1>
        <h2 className="text-xl text-gray-600 mb-4">{personalInfo.jobTitle}</h2>
        
        <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            <span>{personalInfo.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            <span>{personalInfo.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{personalInfo.location}</span>
          </div>
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {layout.sectionOrder.map((sectionKey) => {
          if (!layout.sectionVisibility[sectionKey]) return null;

          switch (sectionKey) {
            case 'summary':
              return (
                <section key={sectionKey}>
                  <h3 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: theme.primaryColor }}>
                    Professional Summary
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{summary}</p>
                </section>
              );

            case 'experience':
              return (
                <section key={sectionKey}>
                  <h3 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: theme.primaryColor }}>
                    Professional Experience
                  </h3>
                  {experience.map((exp) => (
                    <div key={exp.id} className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-gray-800">{exp.position}</h4>
                          <p className="font-semibold text-gray-600">{exp.company}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                          {exp.location && <p>{exp.location}</p>}
                        </div>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
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
                <section key={sectionKey}>
                  <h3 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: theme.primaryColor }}>
                    Education
                  </h3>
                  {education.map((edu) => (
                    <div key={edu.id} className="mb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.institution}</p>
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

            case 'skills':
              return (
                <section key={sectionKey}>
                  <h3 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: theme.primaryColor }}>
                    Skills
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-800">Technical Skills</h4>
                      <p className="text-gray-700">{skills.technical.join(' • ')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-800">Soft Skills</h4>
                      <p className="text-gray-700">{skills.soft.join(' • ')}</p>
                    </div>
                  </div>
                </section>
              );

            case 'projects':
              return (
                <section key={sectionKey}>
                  <h3 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: theme.primaryColor }}>
                    Projects
                  </h3>
                  {projects.map((project) => (
                    <div key={project.id} className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-800">{project.name}</h4>
                        {project.link && (
                          <a href={project.link} className="text-blue-600 text-sm hover:underline">
                            View Project
                          </a>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{project.description}</p>
                      <p className="text-gray-600 text-sm mb-2">
                        <strong>Technologies:</strong> {project.technologies.join(', ')}
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
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
                <section key={sectionKey}>
                  <h3 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: theme.primaryColor }}>
                    Certifications
                  </h3>
                  {certifications.map((cert) => (
                    <div key={cert.id} className="mb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                          <p className="text-gray-600">{cert.issuer}</p>
                          {cert.credentialId && (
                            <p className="text-gray-500 text-sm">Credential ID: {cert.credentialId}</p>
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

ClassicTemplate.displayName = 'ClassicTemplate';

export default ClassicTemplate;