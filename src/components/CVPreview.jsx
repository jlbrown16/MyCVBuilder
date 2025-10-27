import React, { forwardRef } from 'react';

const CVPreview = forwardRef(({ data }, ref) => {
  const { personal, summary, experience, education, skills } = data;
  const {
    name,
    title,
    email,
    phone,
    linkedin,
    showTitle,
    showLinkedin,
    address,
    showAddress,
    primaryColor,
  } = personal;

  const getTextColor = (shade) => `text-${primaryColor}-${shade}`;
  const getBorderColor = (shade) => `border-${primaryColor}-${shade}`;

  const SkillPill = ({ skill }) => (
    <span className={`inline-block bg-${primaryColor}-100 text-${primaryColor}-800 text-xs font-semibold px-3 py-1 rounded-full ring-1 ring-${primaryColor}-200 mr-2 mb-2`}>
      {skill.trim()}
    </span>
  );

  const ExperienceDescription = ({ description }) => {
    if (!description) {
      return <p className="text-xs text-gray-700">Key responsibilities and achievements.</p>;
    }

    const lines = description.split('\n').filter((line) => line.trim().length > 0);

    if (lines.length === 0) {
      return null;
    }

    return (
      <ul className="list-disc list-outside ml-5 text-xs text-gray-700">
        {lines.map((line, index) => (
          <li key={index} className="mb-0.5">
            {line.trim().startsWith('•') || line.trim().startsWith('-')
              ? line.trim().substring(1).trim()
              : line.trim()}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div ref={ref} className="bg-white p-6 md:p-10 shadow-xl min-h-[80vh] w-full cv-document">
      <header className={`border-b-4 ${getBorderColor(600)} pb-2 mb-6`}>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-1">{name || 'Your Name'}</h1>
        {showTitle && (
          <p className={`text-xl font-semibold ${getTextColor(600)} mb-2`}>
            {title || 'Your Professional Title'}
          </p>
        )}
        <div className="cv-contact-bar flex flex-wrap items-center text-sm text-gray-600 gap-x-6 gap-y-2">
          <span className="flex items-center space-x-2">
            <i className={`fa-solid fa-square-phone ${getTextColor(600)} text-lg min-w-[20px] text-center`}></i>
            <span className="break-all">{phone}</span>
          </span>
          {showAddress && address && (
            <span className="flex items-center space-x-2">
              <i className={`fa-solid fa-location-dot ${getTextColor(600)} text-lg min-w-[20px] text-center`}></i>
              <span className="break-words">{address}</span>
            </span>
          )}
          <span className="flex items-center space-x-2">
            <i className={`fa-solid fa-square-envelope ${getTextColor(600)} text-lg min-w-[20px] text-center`}></i>
            <span className="break-all">{email}</span>
          </span>
          {showLinkedin && linkedin && (
            <span className="flex items-center space-x-2">
              <i className={`fa-brands fa-square-linkedin ${getTextColor(600)} text-lg min-w-[20px] text-center`}></i>
              <span className="break-all">{linkedin}</span>
            </span>
          )}
        </div>
      </header>

      <section className="mb-6">
        <h2 className={`text-lg font-bold uppercase ${getTextColor(600)} border-b border-gray-300 mb-2 pb-1`}>
          Professional Summary
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm">
          {summary || 'A brief summary of your career and professional goals.'}
        </p>
      </section>

      <section className="mb-6">
        <h2 className={`text-lg font-bold uppercase ${getTextColor(600)} border-b border-gray-300 mb-3 pb-1`}>
          Work Experience
        </h2>
        {experience.filter((e) => e.title || e.company).map((exp, index) => (
          <div key={exp.id} className={`mb-4 ${index > 0 ? 'mt-4' : ''}`}>
            <div className="flex justify-between items-start">
              <h3 className="text-md font-bold text-gray-900">{exp.title || 'Job Title'}</h3>
              <span className="text-sm text-gray-500 font-medium">{exp.duration || '2020 - Present'}</span>
            </div>
            <p className={`text-sm ${getTextColor(600)} font-medium italic mb-1`}>
              {exp.company || 'Company Name'}
            </p>
            <ExperienceDescription description={exp.description} />
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className={`text-lg font-bold uppercase ${getTextColor(600)} border-b border-gray-300 mb-3 pb-1`}>
          Education
        </h2>
        {education.filter((e) => e.degree || e.institution).map((edu) => (
          <div key={edu.id} className="mb-2">
            <div className="flex justify-between items-start">
              <h3 className="text-md font-bold text-gray-900">{edu.degree || 'Degree/Major'}</h3>
              <span className="text-sm text-gray-500 font-medium">{edu.duration || '2016 - 2020'}</span>
            </div>
            <p className={`text-sm ${getTextColor(600)} font-medium italic`}>
              {edu.institution || 'University Name'}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2 className={`text-lg font-bold uppercase ${getTextColor(600)} border-b border-gray-300 mb-3 pb-1`}>
          Skills & Technologies
        </h2>
        <div className="flex flex-wrap gap-1">
          {skills
            .split(',')
            .filter((skill) => skill.trim().length > 0)
            .map((skill, index) => (
              <SkillPill key={index} skill={skill} />
            ))}
        </div>
      </section>
    </div>
  );
});

export default CVPreview;
