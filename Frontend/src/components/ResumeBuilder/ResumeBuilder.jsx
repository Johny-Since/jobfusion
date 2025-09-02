import React, { useState, useRef, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Download,
  Plus,
  Trash2,
  Move,
  Eye,
  EyeOff,
  Save,
  Upload,
  Palette,
  Type,
  Layout,
  Settings,
  Undo,
  Redo,
  Copy,
  FileText
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import template components
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

const ResumeBuilder = () => {
  const resumeRef = useRef(null);
  const [activeTab, setActiveTab] = useState('content');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [previewMode, setPreviewMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [resumeData, setResumeData] = useState({
    // Personal Information
    personalInfo: {
      fullName: 'John Doe',
      jobTitle: 'Software Developer',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'johndoe.dev',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      profileImage: null
    },
    
    // Professional Summary
    summary: 'Experienced software developer with 5+ years of expertise in full-stack development...',
    
    // Skills
    skills: {
      technical: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
      soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration']
    },
    
    // Experience
    experience: [
      {
        id: '1',
        company: 'Tech Corp',
        position: 'Senior Software Developer',
        location: 'San Francisco, CA',
        startDate: '2020-01',
        endDate: 'Present',
        current: true,
        achievements: [
          'Led development of microservices architecture serving 1M+ users',
          'Improved application performance by 40% through optimization',
          'Mentored 5 junior developers and conducted code reviews'
        ]
      }
    ],
    
    // Education
    education: [
      {
        id: '1',
        institution: 'University of California',
        degree: 'Bachelor of Science in Computer Science',
        location: 'Berkeley, CA',
        startDate: '2016',
        endDate: '2020',
        gpa: '3.8/4.0'
      }
    ],
    
    // Projects
    projects: [
      {
        id: '1',
        name: 'E-commerce Platform',
        description: 'Full-stack e-commerce solution with React and Node.js',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        link: 'github.com/johndoe/ecommerce',
        highlights: [
          'Implemented secure payment processing',
          'Built responsive design for mobile and desktop'
        ]
      }
    ],
    
    // Certifications
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        date: '2023',
        credentialId: 'AWS-123456'
      }
    ],
    
    // Languages
    languages: [
      { name: 'English', proficiency: 'Native' },
      { name: 'Spanish', proficiency: 'Conversational' }
    ],
    
    // Theme and Styling
    theme: {
      primaryColor: '#2563eb',
      secondaryColor: '#f1f5f9',
      accentColor: '#3b82f6',
      textColor: '#1f2937',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      fontSize: 'medium',
      borderRadius: '8px',
      spacing: 'normal'
    },
    
    // Layout Configuration
    layout: {
      template: 'modern',
      columns: 1,
      sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
      sectionVisibility: {
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        languages: false
      }
    }
  });

  // Template configurations
  const templates = [
    { id: 'modern', name: 'Modern', component: ModernTemplate, preview: '/templates/modern-preview.png' },
    { id: 'classic', name: 'Classic', component: ClassicTemplate, preview: '/templates/classic-preview.png' },
    { id: 'creative', name: 'Creative', component: CreativeTemplate, preview: '/templates/creative-preview.png' },
    { id: 'minimal', name: 'Minimal', component: MinimalTemplate, preview: '/templates/minimal-preview.png' }
  ];

  // History management for undo/redo
  const saveToHistory = useCallback((newData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newData)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setResumeData(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setResumeData(history[historyIndex + 1]);
    }
  };

  // Update functions
  const updateResumeData = (path, value) => {
    const newData = { ...resumeData };
    const keys = path.split('.');
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setResumeData(newData);
    saveToHistory(newData);
  };

  const addArrayItem = (arrayPath, defaultItem) => {
    const newData = { ...resumeData };
    const keys = arrayPath.split('.');
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    const array = current[keys[keys.length - 1]];
    array.push({ ...defaultItem, id: Date.now().toString() });
    
    setResumeData(newData);
    saveToHistory(newData);
    toast.success('Item added successfully!');
  };

  const removeArrayItem = (arrayPath, index) => {
    const newData = { ...resumeData };
    const keys = arrayPath.split('.');
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    const array = current[keys[keys.length - 1]];
    if (array.length > 1) {
      array.splice(index, 1);
      setResumeData(newData);
      saveToHistory(newData);
      toast.success('Item removed successfully!');
    }
  };

  // Drag and drop handler
  const handleDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    const newData = { ...resumeData };
    
    if (type === 'section') {
      const newOrder = Array.from(resumeData.layout.sectionOrder);
      const [removed] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, removed);
      newData.layout.sectionOrder = newOrder;
    } else {
      // Handle reordering within arrays (experience, education, etc.)
      const arrayPath = type;
      const keys = arrayPath.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const array = current[keys[keys.length - 1]];
      const [reorderedItem] = array.splice(source.index, 1);
      array.splice(destination.index, 0, reorderedItem);
    }
    
    setResumeData(newData);
    saveToHistory(newData);
  };

  // PDF Generation
  const generatePDF = async () => {
    try {
      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: resumeData.theme.backgroundColor
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
      pdf.save(`${resumeData.personalInfo.fullName.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`);
      
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  // Save resume data to localStorage
  const saveResume = () => {
    try {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
      toast.success('Resume saved successfully!');
    } catch (error) {
      toast.error('Failed to save resume.');
    }
  };

  // Load resume data from localStorage
  const loadResume = () => {
    try {
      const saved = localStorage.getItem('resumeData');
      if (saved) {
        const loadedData = JSON.parse(saved);
        setResumeData(loadedData);
        saveToHistory(loadedData);
        toast.success('Resume loaded successfully!');
      }
    } catch (error) {
      toast.error('Failed to load resume.');
    }
  };

  // Get current template component
  const getCurrentTemplate = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    return template ? template.component : ModernTemplate;
  };

  const TemplateComponent = getCurrentTemplate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                title="Undo"
              >
                <Undo className="w-5 h-5" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                title="Redo"
              >
                <Redo className="w-5 h-5" />
              </button>
              <button
                onClick={saveResume}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={loadResume}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <Upload className="w-4 h-4" />
                Load
              </button>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={generatePDF}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          {!previewMode && (
            <div className="flex border-b border-gray-200 mt-4">
              <button
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === 'content' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="w-4 h-4" />
                Content
              </button>
              <button
                onClick={() => setActiveTab('design')}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === 'design' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Palette className="w-4 h-4" />
                Design
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === 'templates' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Layout className="w-4 h-4" />
                Templates
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === 'settings' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {previewMode ? (
          // Full Preview Mode
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
              <TemplateComponent resumeData={resumeData} ref={resumeRef} />
            </div>
          </div>
        ) : (
          // Editor Mode
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor Panel */}
            <div className="lg:col-span-1 space-y-6">
              {activeTab === 'content' && (
                <ContentEditor 
                  resumeData={resumeData} 
                  updateResumeData={updateResumeData}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                  handleDragEnd={handleDragEnd}
                />
              )}
              
              {activeTab === 'design' && (
                <DesignEditor 
                  resumeData={resumeData} 
                  updateResumeData={updateResumeData}
                />
              )}
              
              {activeTab === 'templates' && (
                <TemplateSelector 
                  templates={templates}
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                  updateResumeData={updateResumeData}
                />
              )}
              
              {activeTab === 'settings' && (
                <SettingsPanel 
                  resumeData={resumeData} 
                  updateResumeData={updateResumeData}
                />
              )}
            </div>
            
            {/* Live Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewMode(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Full Preview
                    </button>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="transform scale-75 origin-top-left" style={{ width: '133.33%' }}>
                    <TemplateComponent resumeData={resumeData} ref={resumeRef} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

// Content Editor Component
const ContentEditor = ({ resumeData, updateResumeData, addArrayItem, removeArrayItem, handleDragEnd }) => {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={resumeData.personalInfo.fullName}
            onChange={(e) => updateResumeData('personalInfo.fullName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Job Title"
            value={resumeData.personalInfo.jobTitle}
            onChange={(e) => updateResumeData('personalInfo.jobTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={resumeData.personalInfo.email}
            onChange={(e) => updateResumeData('personalInfo.email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={resumeData.personalInfo.phone}
            onChange={(e) => updateResumeData('personalInfo.phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Location"
            value={resumeData.personalInfo.location}
            onChange={(e) => updateResumeData('personalInfo.location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Professional Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Professional Summary</h3>
        <textarea
          placeholder="Write a compelling professional summary..."
          value={resumeData.summary}
          onChange={(e) => updateResumeData('summary', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Experience Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Work Experience</h3>
          <button
            onClick={() => addArrayItem('experience', {
              company: '',
              position: '',
              location: '',
              startDate: '',
              endDate: '',
              current: false,
              achievements: ['']
            })}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="experience" type="experience">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <Draggable key={exp.id} draggableId={exp.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div {...provided.dragHandleProps} className="cursor-move">
                            <Move className="w-4 h-4 text-gray-400" />
                          </div>
                          <button
                            onClick={() => removeArrayItem('experience', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                          <input
                            type="text"
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => updateResumeData(`experience.${index}.company`, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Position"
                            value={exp.position}
                            onChange={(e) => updateResumeData(`experience.${index}.position`, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="month"
                              placeholder="Start Date"
                              value={exp.startDate}
                              onChange={(e) => updateResumeData(`experience.${index}.startDate`, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="month"
                              placeholder="End Date"
                              value={exp.endDate}
                              onChange={(e) => updateResumeData(`experience.${index}.endDate`, e.target.value)}
                              disabled={exp.current}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                          </div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => updateResumeData(`experience.${index}.current`, e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-sm text-gray-600">Currently working here</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

// Design Editor Component
const DesignEditor = ({ resumeData, updateResumeData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Colors</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
            <input
              type="color"
              value={resumeData.theme.primaryColor}
              onChange={(e) => updateResumeData('theme.primaryColor', e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
            <input
              type="color"
              value={resumeData.theme.accentColor}
              onChange={(e) => updateResumeData('theme.accentColor', e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Typography</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
            <select
              value={resumeData.theme.fontFamily}
              onChange={(e) => updateResumeData('theme.fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="Inter, sans-serif">Inter</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Open Sans, sans-serif">Open Sans</option>
              <option value="Lato, sans-serif">Lato</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <select
              value={resumeData.theme.fontSize}
              onChange={(e) => updateResumeData('theme.fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Template Selector Component
const TemplateSelector = ({ templates, selectedTemplate, setSelectedTemplate, updateResumeData }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Choose Template</h3>
      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => {
              setSelectedTemplate(template.id);
              updateResumeData('layout.template', template.id);
            }}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedTemplate === template.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="aspect-[3/4] bg-gray-100 rounded-md mb-3 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Preview</span>
            </div>
            <h4 className="font-medium text-center">{template.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

// Settings Panel Component
const SettingsPanel = ({ resumeData, updateResumeData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Section Visibility</h3>
        <div className="space-y-3">
          {Object.entries(resumeData.layout.sectionVisibility).map(([section, visible]) => (
            <label key={section} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => updateResumeData(`layout.sectionVisibility.${section}`, e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700 capitalize">
                {section.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;