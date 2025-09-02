import React, { forwardRef } from 'react';

const MinimalTemplate = forwardRef(({ resumeData }, ref) => {
  const { personalInfo, summary, skills, experience, education, projects, certifications, theme, layout } = resumeData;

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
      {/* Minimal Header */}
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-4xl font-light mb-2" style={{ color: theme.primaryColor }}>
          {personalInfo.fullName}
        </h1>
        <h2 className="text-xl text-gray-600 mb-4 font-light">{personalInfo.jobTitle}</h2>
        
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <span>{personalInfo.email}</span>
          <span>{personalInfo.phone}</span>
          <span>{personalInfo.location}</span>
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {layout.sectionOrder.map((sectionKey) => {
          if (!layout.sectionVisibility[sectionKey]) return null;

          switch (sectionKey) {
            case 'summary':
              return (
                <section key={sectionKey}>
                  <h3 className="text-lg font-medium mb-3 pb-1 border-b border-gray-200" style={{ color: theme.primaryColor }}>
                    Summary
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{summary}</p>
                </section>
              );

            case 'experience':
              return (
                <section key={sectionKey}>
                  <h3 className="text-lg font-medium mb-3 pb-1 border-b border-gray-200" style={{ color: theme.primaryColor }}>
                    Experience
                  </h3>
                  {experience.map((exp) => (
                    <div key={exp.id} className="mb-6">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-medium text-gray-800">{exp.position}</h4>
                        <span className="text-sm text-gray-500">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{exp.company}</p>
                      <ul className="space-y-1 text-gray-700">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-sm leading-relaxed">
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              );

            case 'education':
              return (
                <section key={sectionKey}>
                  <h3 className="text-lg font-medium mb-3 pb-1 border-b border-gray-200" style={{ color: theme.primaryColor }}>
                    Education
                  </h3>
                  {education.map((edu) => (
                    <div key={edu.id} className="mb-4">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <h4 className="font-medium text-gray-800">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.institution}</p>
                          {edu.gpa && <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>}
                        </div>
                        <span className="text-sm text-gray-500">
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </section>
              );

            case 'skills':
              return (
                <section key={sectionKey}>
                  <h3 className="text-lg font-medium mb-3 pb-1 border-b border-gray-200" style={{ color: theme.primaryColor }}>
                    Skills
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2 text-gray-800">Technical</h4>
                      <p className="text-gray-700 text-sm">{skills.technical.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-gray-800">Soft Skills</h4>
                      <p className="text-gray-700 text-sm">{skills.soft.join(', ')}</p>
                    </div>
                  </div>
                </section>
              );

            case 'projects':
              return (
                <section key={sectionKey}>
                  <h3 className="text-lg font-medium mb-3 pb-1 border-b border-gray-200" style={{ color: theme.primaryColor }}>
                    Projects
                  </h3>
                  {projects.map((project) => (
                    <div key={project.id} className="mb-4">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-medium text-gray-800">{project.name}</h4>
                        {project.link && (
                          <a href={project.link} className="text-sm hover:underline" style={{ color: theme.primaryColor }}>
                            View
                          </a>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                      <p className="text-gray-500 text-xs">{project.technologies.join(', ')}</p>
                    </div>
                  ))}
                </section>
              );

            case 'certifications':
              return (
                <section key={sectionKey}>
                  <h3 className="text-lg font-medium mb-3 pb-1 border-b border-gray-200" style={{ color: theme.primaryColor }}>
                    Certifications
                  </h3>
                  {certifications.map((cert) => (
                    <div key={cert.id} className="mb-3">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <h4 className="font-medium text-gray-800">{cert.name}</h4>
                          <p className="text-gray-600 text-sm">{cert.issuer}</p>
                        </div>
                        <span className="text-sm text-gray-500">{cert.date}</span>
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

MinimalTemplate.displayName = 'MinimalTemplate';

export default MinimalTemplate;