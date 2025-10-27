import React, { useState, useCallback, useRef, useEffect } from 'react';
import InputField from './components/InputField.jsx';
import TextAreaField from './components/TextAreaField.jsx';
import Toggle from './components/Toggle.jsx';
import ArrayItemEditor from './components/ArrayItemEditor.jsx';
import CVPreview from './components/CVPreview.jsx';

export const colorMap = {
  Indigo: 'indigo',
  Blue: 'blue',
  Green: 'green',
  Red: 'red',
  Grey: 'gray',
};

const createEmptyPersonal = () => ({
  name: '',
  title: '',
  email: '',
  phone: '',
  linkedin: '',
  address: '',
  showAddress: true,
  showTitle: true,
  showLinkedin: true,
  primaryColor: 'indigo',
});

const createEmptyData = () => ({
  personal: createEmptyPersonal(),
  summary: '',
  experience: [],
  education: [],
  skills: '',
});

const createEmptyExperience = (id) => ({
  id,
  title: '',
  company: '',
  duration: '',
  description: '',
});

const createEmptyEducation = (id) => ({
  id,
  institution: '',
  degree: '',
  duration: '',
});

export const initialCVData = {
  personal: {
    name: 'David Johnson',
    title: 'Qualified Plumber & Heating Engineer',
    email: 'david.johnson.plumbing@example.com',
    phone: '07890 123456',
    linkedin: 'linkedin.com/in/davidjohnsonplumbing',
    address: 'Guiseley, Leeds LS20 1BG',
    showAddress: true,
    showTitle: true,
    showLinkedin: true,
    primaryColor: 'indigo',
  },
  summary:
    'Highly skilled and reliable Level 3 Qualified Plumber with 8 years of experience in domestic and light commercial settings. Proficient in boiler installation, fault finding, and complete bathroom refurbishments. Committed to delivering high-quality workmanship and excellent customer service.',
  experience: [
    {
      id: 1,
      title: 'Self-Employed Plumbing Contractor',
      company: 'D. Johnson Plumbing & Heating',
      duration: '2020 - Present',
      description:
        '• Managed all aspects of a busy independent business, including quoting, scheduling, and billing.\n• Specialised in complete domestic bathroom installations, fitting WCs, baths, showers, and associated pipework.\n• Successfully completed 150+ repair jobs per year, including leaking taps, burst pipes, and drain blockages.',
    },
    {
      id: 2,
      title: 'Apprentice Plumber',
      company: 'A&B Heating Services',
      duration: '2016 - 2020',
      description:
        '• Assisted lead engineers with boiler services and radiator replacements.\n• Gained practical experience in hot and cold water systems installation and maintenance.',
    },
  ],
  education: [
    {
      id: 1,
      institution: 'Leeds College of Building',
      degree: 'NVQ Level 3 Plumbing and Heating',
      duration: '2014 - 2016',
    },
    {
      id: 2,
      institution: 'Guiseley High School',
      degree: 'GCSEs (9 subjects including Maths & English)',
      duration: '2009 - 2014',
    },
  ],
  skills:
    'NVQ Level 3 Plumbing, Boiler Service & Repair, Bathroom Fitting, Leak Diagnostics, Pipework Installation (Copper/Plastic), Customer Service, Health & Safety',
};

export const LOCAL_STORAGE_KEY = 'cvBuilderData_v1';

const loadCVData = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return initialCVData;
  }

  try {
    const storedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return {
        ...initialCVData,
        ...parsedData,
        personal: { ...initialCVData.personal, ...parsedData.personal },
      };
    }
  } catch (error) {
    console.error('Error loading from localStorage, using initial data.', error);
  }

  return initialCVData;
};

const saveCVData = (data) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage.', error);
  }
};

const App = () => {
  const [cvData, setCvData] = useState(() => loadCVData());
  const [isSaving, setIsSaving] = useState(false);
  const previewRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const primaryColorPrefix = cvData.personal.primaryColor;

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const validateField = (name, value) => {
    if (name === 'name' && value.trim() === '') {
      return 'Name is required.';
    }

    if (name === 'email' && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      return 'Must be a valid email address.';
    }

    return null;
  };

  const handleSave = useCallback((dataToSave) => {
    setIsSaving(true);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      saveCVData(dataToSave);
      setIsSaving(false);
    }, 500);
  }, []);

  const handleReset = () => {
    const shouldReset =
      typeof window === 'undefined' || typeof window.confirm !== 'function'
        ? true
        : window.confirm('Are you sure you want to reset all data to the example plumber CV? This action cannot be undone.');

    if (!shouldReset) {
      return;
    }

    const initialDataCopy = JSON.parse(JSON.stringify(initialCVData));
    setCvData(initialDataCopy);
    handleSave(initialDataCopy);
  };

  const handleClear = () => {
    const shouldClear =
      typeof window === 'undefined' || typeof window.confirm !== 'function'
        ? true
        : window.confirm('Are you sure you want to CLEAR all data? This will leave all fields blank.');

    if (!shouldClear) {
      return;
    }

    const emptyData = createEmptyData();
    setCvData(emptyData);
    handleSave(emptyData);
  };

  const handlePersonalChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;

    setCvData((previous) => {
      const newData = {
        ...previous,
        personal: { ...previous.personal, [name]: newValue },
      };
      handleSave(newData);
      return newData;
    });
  };

  const handleColorChange = (colorKey) => {
    setCvData((previous) => {
      const newData = {
        ...previous,
        personal: { ...previous.personal, primaryColor: colorKey },
      };
      handleSave(newData);
      return newData;
    });
  };

  const handleSummaryAndSkillsChange = (event) => {
    const { name, value } = event.target;
    setCvData((previous) => {
      const newData = { ...previous, [name]: value };
      handleSave(newData);
      return newData;
    });
  };

  const handleArrayChange = useCallback(
    (section, id, name, value) => {
      setCvData((previous) => {
        const updatedArray = previous[section].map((item) =>
          item.id === id ? { ...item, [name]: value } : item,
        );
        const newData = { ...previous, [section]: updatedArray };
        handleSave(newData);
        return newData;
      });
    },
    [handleSave],
  );

  const handleAddSection = (section, emptyCreator) => {
    const newId = Date.now() + Math.random();
    const newSection = emptyCreator(newId);

    setCvData((previous) => {
      const newData = {
        ...previous,
        [section]: [...previous[section], newSection],
      };
      handleSave(newData);
      return newData;
    });
  };

  const handleRemoveSection = (section, id) => {
    setCvData((previous) => {
      const updatedArray = previous[section].filter((item) => item.id !== id);
      const newData = { ...previous, [section]: updatedArray };
      handleSave(newData);
      return newData;
    });
  };

  const handleDownloadPDF = () => {
    if (!previewRef.current || typeof window === 'undefined') {
      return;
    }

    if (typeof window.html2pdf === 'undefined') {
      console.error('html2pdf library failed to load.');
      return;
    }

    const element = previewRef.current;
    const name = cvData.personal?.name?.trim() || 'cv';
    const safeName = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const filename = `${safeName || 'cv'}-resume.pdf`;
    const removeClass = () => element.classList.remove('pdf-export-active');

    element.classList.add('pdf-export-active');

    const options = {
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'avoid-all'] },
    };

    try {
      const worker = window.html2pdf().set(options).from(element).save();

      if (worker && typeof worker.then === 'function') {
        worker
          .then(() => {
            removeClass();
          })
          .catch((error) => {
            console.error('Failed to export PDF', error);
            removeClass();
          });
      } else {
        removeClass();
      }
    } catch (error) {
      console.error('Failed to export PDF', error);
      removeClass();
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined' && typeof window.print === 'function') {
      window.print();
    }
  };

  const handleMove = (section, id, direction) => {
    setCvData((previous) => {
      const items = [...previous[section]];
      const index = items.findIndex((item) => item.id === id);

      if (index === -1) {
        return previous;
      }

      const newIndex = direction === 'up' ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= items.length) {
        return previous;
      }

      [items[index], items[newIndex]] = [items[newIndex], items[index]];
      const newData = { ...previous, [section]: items };
      handleSave(newData);
      return newData;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 no-print">CV Builder</h1>
        <p className="text-sm text-gray-600 mb-6 no-print">Create your personal CV for free!</p>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="lg:col-span-1 no-print bg-white p-6 md:p-8 rounded-xl shadow-lg mb-8 lg:mb-0 input-form-scroll">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Edit Your Details</h2>
              <div className="relative flex space-x-2">
                <button
                  onClick={handleClear}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out text-sm"
                  aria-label="Clear All Data"
                >
                  Clear All
                </button>
                <button
                  onClick={handleReset}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out text-sm"
                  aria-label="Reset Data"
                >
                  Reset to Example
                </button>
              </div>
            </div>

            <div className="mb-8 border-b pb-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Colour Scheme</h3>
              <div className="flex space-x-3">
                {Object.entries(colorMap).map(([name, prefix]) => (
                  <button
                    key={prefix}
                    onClick={() => handleColorChange(prefix)}
                    className={`w-8 h-8 rounded-full transition duration-150 ease-in-out shadow-md bg-${prefix}-600 ${
                      primaryColorPrefix === prefix ? `ring-4 ring-offset-2 ring-${prefix}-600` : 'hover:opacity-80'
                    }`}
                    title={`Use ${name} theme`}
                    aria-pressed={primaryColorPrefix === prefix}
                    type="button"
                  ></button>
                ))}
              </div>
            </div>

            <div className="mb-8 border-b pb-4">
              <h3 className={`text-xl font-semibold text-${primaryColorPrefix}-600 mb-4`}>Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Full Name *"
                  name="name"
                  value={cvData.personal.name}
                  onChange={handlePersonalChange}
                  placeholder="David Johnson"
                  colorPrefix={primaryColorPrefix}
                  isInvalid={validateField('name', cvData.personal.name) !== null}
                  validationMessage={validateField('name', cvData.personal.name)}
                />
                <InputField
                  label="Email *"
                  name="email"
                  type="email"
                  value={cvData.personal.email}
                  onChange={handlePersonalChange}
                  placeholder="your.email@example.com"
                  colorPrefix={primaryColorPrefix}
                  isInvalid={validateField('email', cvData.personal.email) !== null}
                  validationMessage={validateField('email', cvData.personal.email)}
                />
                <InputField
                  label="Phone Number"
                  name="phone"
                  value={cvData.personal.phone}
                  onChange={handlePersonalChange}
                  placeholder="07890 123456"
                  colorPrefix={primaryColorPrefix}
                />
                <div className="hidden md:block"></div>
                <div className="col-span-1 md:col-span-2">
                  <Toggle
                    label="Show Professional Title"
                    name="showTitle"
                    checked={cvData.personal.showTitle}
                    onChange={handlePersonalChange}
                    colorPrefix={primaryColorPrefix}
                  />
                  {cvData.personal.showTitle && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Professional Title"
                        name="title"
                        value={cvData.personal.title}
                        onChange={handlePersonalChange}
                        placeholder="Qualified Plumber"
                        colorPrefix={primaryColorPrefix}
                      />
                    </div>
                  )}
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Toggle
                    label="Show LinkedIn URL"
                    name="showLinkedin"
                    checked={cvData.personal.showLinkedin}
                    onChange={handlePersonalChange}
                    colorPrefix={primaryColorPrefix}
                  />
                  {cvData.personal.showLinkedin && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="LinkedIn URL"
                        name="linkedin"
                        value={cvData.personal.linkedin}
                        onChange={handlePersonalChange}
                        placeholder="linkedin.com/in/yourname"
                        colorPrefix={primaryColorPrefix}
                      />
                    </div>
                  )}
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Toggle
                    label="Show Full Address"
                    name="showAddress"
                    checked={cvData.personal.showAddress}
                    onChange={handlePersonalChange}
                    colorPrefix={primaryColorPrefix}
                  />
                  {cvData.personal.showAddress && (
                    <InputField
                      label="Address (City, Postcode)"
                      name="address"
                      value={cvData.personal.address}
                      onChange={handlePersonalChange}
                      placeholder="Guiseley, Leeds LS20 1BG"
                      colorPrefix={primaryColorPrefix}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8 border-b pb-4">
              <h3 className={`text-xl font-semibold text-${primaryColorPrefix}-600 mb-4`}>
                Professional Summary
              </h3>
              <TextAreaField
                label="Summary"
                name="summary"
                value={cvData.summary}
                onChange={handleSummaryAndSkillsChange}
                rows={4}
                placeholder="Write a compelling, short paragraph about your career goals and achievements."
                colorPrefix={primaryColorPrefix}
              />
            </div>

            <div className="mb-8 border-b pb-4">
              <h3 className={`text-xl font-semibold text-${primaryColorPrefix}-600 mb-4`}>
                Work Experience
              </h3>
              {cvData.experience.map((exp, index) => (
                <ArrayItemEditor
                  key={exp.id}
                  section="experience"
                  item={exp}
                  index={index}
                  total={cvData.experience.length}
                  handleMove={handleMove}
                  handleRemoveSection={handleRemoveSection}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      name="title"
                      label="Job Title"
                      value={exp.title}
                      onChange={(event) =>
                        handleArrayChange('experience', exp.id, event.target.name, event.target.value)
                      }
                      placeholder="e.g., Plumbing Contractor"
                      colorPrefix={primaryColorPrefix}
                    />
                    <InputField
                      name="company"
                      label="Company"
                      value={exp.company}
                      onChange={(event) =>
                        handleArrayChange('experience', exp.id, event.target.name, event.target.value)
                      }
                      placeholder="e.g., D. Johnson Plumbing & Heating"
                      colorPrefix={primaryColorPrefix}
                    />
                    <InputField
                      name="duration"
                      label="Duration"
                      value={exp.duration}
                      onChange={(event) =>
                        handleArrayChange('experience', exp.id, event.target.name, event.target.value)
                      }
                      placeholder="e.g., 2020 - Present"
                      colorPrefix={primaryColorPrefix}
                    />
                    <div className="col-span-1 md:col-span-2">
                      <TextAreaField
                        label="Description (One bullet point per line)"
                        name="description"
                        value={exp.description}
                        onChange={(event) =>
                          handleArrayChange('experience', exp.id, event.target.name, event.target.value)
                        }
                        rows={4}
                        placeholder={
                          'Enter one bullet point per line. Example:\n• Managed all aspects of the business\n• Specialised in bathroom fitting'
                        }
                        colorPrefix={primaryColorPrefix}
                      />
                    </div>
                  </div>
                </ArrayItemEditor>
              ))}
              <button
                onClick={() => handleAddSection('experience', createEmptyExperience)}
                className={`w-full bg-${primaryColorPrefix}-100 text-${primaryColorPrefix}-700 font-semibold py-2 rounded-lg hover:bg-${primaryColorPrefix}-200 transition duration-150 ease-in-out mt-2`}
                type="button"
              >
                + Add Experience
              </button>
            </div>

            <div className="mb-8 border-b pb-4">
              <h3 className={`text-xl font-semibold text-${primaryColorPrefix}-600 mb-4`}>
                Education
              </h3>
              {cvData.education.map((edu, index) => (
                <ArrayItemEditor
                  key={edu.id}
                  section="education"
                  item={edu}
                  index={index}
                  total={cvData.education.length}
                  handleMove={handleMove}
                  handleRemoveSection={handleRemoveSection}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Degree/Qualification"
                      name="degree"
                      value={edu.degree}
                      onChange={(event) =>
                        handleArrayChange('education', edu.id, event.target.name, event.target.value)
                      }
                      placeholder="e.g., NVQ Level 3 Plumbing"
                      colorPrefix={primaryColorPrefix}
                    />
                    <InputField
                      label="Institution"
                      name="institution"
                      value={edu.institution}
                      onChange={(event) =>
                        handleArrayChange('education', edu.id, event.target.name, event.target.value)
                      }
                      placeholder="e.g., Leeds College of Building"
                      colorPrefix={primaryColorPrefix}
                    />
                    <InputField
                      label="Duration"
                      name="duration"
                      value={edu.duration}
                      onChange={(event) =>
                        handleArrayChange('education', edu.id, event.target.name, event.target.value)
                      }
                      placeholder="e.g., 2014 - 2016"
                      colorPrefix={primaryColorPrefix}
                    />
                  </div>
                </ArrayItemEditor>
              ))}
              <button
                onClick={() => handleAddSection('education', createEmptyEducation)}
                className={`w-full bg-${primaryColorPrefix}-100 text-${primaryColorPrefix}-700 font-semibold py-2 rounded-lg hover:bg-${primaryColorPrefix}-200 transition duration-150 ease-in-out mt-2`}
                type="button"
              >
                + Add Education
              </button>
            </div>

            <div className="pb-4">
              <h3 className={`text-xl font-semibold text-${primaryColorPrefix}-600 mb-4`}>Skills</h3>
              <TextAreaField
                label="Technical Skills (Comma-separated list)"
                name="skills"
                value={cvData.skills}
                onChange={handleSummaryAndSkillsChange}
                rows={2}
                placeholder="e.g., NVQ Level 3 Plumbing, Boiler Service & Repair, Bathroom Fitting"
                colorPrefix={primaryColorPrefix}
              />
            </div>

            <div className="pt-6 border-t mt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className={`w-full sm:flex-1 bg-${primaryColorPrefix}-600 hover:bg-${primaryColorPrefix}-700 text-white font-bold py-3 rounded-lg shadow-xl transition duration-150 ease-in-out text-lg`}
                  aria-label="Download CV as PDF"
                  type="button"
                >
                  <i className="fa-solid fa-file-arrow-down mr-2"></i>
                  Download PDF
                </button>
                <button
                  onClick={handlePrint}
                  className={`w-full sm:flex-1 bg-white text-${primaryColorPrefix}-600 border border-${primaryColorPrefix}-600 hover:bg-${primaryColorPrefix}-50 font-bold py-3 rounded-lg shadow-md transition duration-150 ease-in-out text-lg`}
                  aria-label="Print CV"
                  type="button"
                >
                  <i className="fa-solid fa-print mr-2"></i>
                  Print
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 cv-preview-container">
            <div className="flex justify-between items-center mb-4 no-print">
              <h2 className="text-2xl font-bold text-gray-800 lg:block hidden">Live Preview</h2>
              {isSaving && (
                <span className={`text-sm font-medium flex items-center text-${primaryColorPrefix}-600 animate-pulse`}>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Updating...
                </span>
              )}
            </div>
            <div className="sticky top-8">
              <CVPreview data={cvData} ref={previewRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

export { createEmptyData, createEmptyEducation, createEmptyExperience };
