const SavedJob = require("../models/savedJobModel");
const User = require("../models/User");
const logger = require('../utils/logger');

// Save a Job
const saveJob = async (req, res) => {
  try {
    const { email, jobData } = req.body;
    
    logger.info('Save job request received', { email, jobId: jobData?.id });
    
    if (!email || !jobData) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and job data are required" 
      });
    }

    // Validate job data structure
    if (!jobData.id) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }

    // Check if job already exists
    const existingJob = await SavedJob.findOne({ 
      email, 
      'jobData.id': jobData.id 
    });

    if (existingJob) {
      return res.status(400).json({ 
        success: false, 
        message: "Job already saved" 
      });
    }

    // Ensure jobData has all required fields with defaults
    const sanitizedJobData = {
      id: jobData.id,
      jobTitle: jobData.jobTitle || jobData.title || 'Job Title Not Available',
      companyName: jobData.companyName || jobData.company?.display_name || 'Company Not Available',
      location: jobData.location?.display_name || jobData.location || 'Location Not Available',
      salary: jobData.salary || 'Salary Not Disclosed',
      description: jobData.description || 'No description available',
      redirect_url: jobData.redirect_url || '#'
    };

    // Create new saved job
    const newJob = new SavedJob({ 
      email, 
      jobData: sanitizedJobData
    });
    
    await newJob.save();
    
    logger.info('Job saved successfully', { email, jobId: sanitizedJobData.id });

    res.status(201).json({ 
      success: true, 
      message: "Job saved successfully",
      data: newJob
    });

  } catch (error) {
    logger.error('Error in saveJob:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error saving job", 
      error: error.message 
    });
  }
};

// Get Saved Jobs
const getSavedJobs = async (req, res) => {
  try {
    const { email } = req.params;
    
    logger.info('Get saved jobs request', { email, userId: req.user?.id });

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Verify user from token matches requested email
    if (!req.user || req.user.email !== email) {
      logger.warn('Auth mismatch', { tokenEmail: req.user?.email, requestedEmail: email });
      return res.status(403).json({
        success: false,
        message: "Not authorized to access these saved jobs"
      });
    }

    const savedJobs = await SavedJob.find({ email })
      .sort({ createdAt: -1 });
    
    logger.info('Saved jobs retrieved', { email, count: savedJobs.length });
    
    if (!savedJobs || savedJobs.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No saved jobs found"
      });
    }
    
    // Ensure all saved jobs have proper structure
    const sanitizedJobs = savedJobs.map(job => ({
      ...job.toObject(),
      jobData: {
        id: job.jobData.id,
        jobTitle: job.jobData.jobTitle || job.jobData.title || 'Job Title Not Available',
        companyName: job.jobData.companyName || job.jobData.company?.display_name || 'Company Not Available',
        location: job.jobData.location?.display_name || job.jobData.location || 'Location Not Available',
        salary: job.jobData.salary || 'Salary Not Disclosed',
        description: job.jobData.description || 'No description available',
        redirect_url: job.jobData.redirect_url || '#',
        ...job.jobData
      }
    }));
    
    res.status(200).json({
      success: true,
      data: sanitizedJobs,
      message: "Saved jobs retrieved successfully"
    });

  } catch (error) {
    logger.error('Error in getSavedJobs:', error);
    res.status(500).json({
      success: false,
      message: "Error retrieving saved jobs",
      error: error.message
    });
  }
};

// Unsave a Job
const unsaveJob = async (req, res) => {
  try {
    const { email, jobId } = req.body;
    
    logger.info('Unsave job request', { email, jobId });

    if (!email || !jobId) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and job ID are required" 
      });
    }

    // Verify user authorization
    if (!req.user || req.user.email !== email) {
      logger.warn('Unauthorized unsave attempt', { tokenEmail: req.user?.email, requestedEmail: email });
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify these saved jobs"
      });
    }

    const result = await SavedJob.findOneAndDelete({ 
      email, 
      'jobData.id': jobId 
    });

    if (!result) {
      logger.warn('Job not found for unsave', { email, jobId });
      return res.status(404).json({ 
        success: false, 
        message: "Job not found in saved list" 
      });
    }
    
    logger.info('Job unsaved successfully', { email, jobId });

    res.status(200).json({ 
      success: true, 
      message: "Job removed successfully" 
    });

  } catch (error) {
    logger.error('Error in unsaveJob:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error removing job", 
      error: error.message 
    });
  }
};

module.exports = { saveJob, getSavedJobs, unsaveJob };