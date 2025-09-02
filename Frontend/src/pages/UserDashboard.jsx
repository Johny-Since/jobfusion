import { useState, useEffect } from "react";
import { Database, User, Briefcase, MapPin, Calendar, DollarSign, ExternalLink } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "../components/SaveBtn";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../components/Loader";

const JobCard = ({ job, onToggle }) => {
  const navigate = useNavigate();

  if (!job || !job.id) {
    return null;
  }

  // Safely extract job data with fallbacks
  const jobData = {
    id: job.id,
    title: job.title || job.jobTitle || 'Job Title Not Available',
    company: job.company?.display_name || job.companyName || 'Company Not Available',
    location: job.location?.display_name || job.location || 'Location Not Available',
    salary: job.salary || 'Salary Not Disclosed',
    description: job.description || 'No description available',
    redirect_url: job.redirect_url || '#'
  };

  const handleJobClick = () => {
    navigate(`/jobs/${job.id}`, { 
      state: { 
        job: {
          ...jobData,
          company: { display_name: jobData.company },
          location: { display_name: jobData.location }
        }
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 relative group">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <BookmarkButton job={jobData} onToggle={onToggle} />
      </div>
      
      <div onClick={handleJobClick} className="cursor-pointer">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <Briefcase className="text-white h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">
              {jobData.title}
            </h3>
            <p className="text-blue-600 font-medium text-sm mb-2">
              {jobData.company}
            </p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{jobData.location}</span>
          </div>
          
          {jobData.salary && jobData.salary !== 'Salary Not Disclosed' && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-green-600 font-medium">
                {typeof jobData.salary === 'number' 
                  ? `₹${jobData.salary.toLocaleString()}` 
                  : jobData.salary
                }
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Recently Posted
          </span>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            View Details
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const storedEmail = localStorage.getItem("userEmail");
      const token = localStorage.getItem("token");
      
      if (!storedEmail || !token) {
        toast.error("Please log in to access your dashboard");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/profile/${storedEmail}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setUserData(response.data.data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/login");
      } else {
        setError("Error fetching user data. Please try again.");
        toast.error("Failed to load user profile");
      }
    }
  };

  const fetchSavedJobs = async () => {
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");
    
    if (!email || !token) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/savedjobs/saved/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const jobs = response.data.data || [];
        
        // Transform saved jobs data to ensure consistency
        const transformedJobs = jobs.map(item => {
          const jobData = item.jobData || {};
          return {
            id: jobData.id || item._id,
            title: jobData.jobTitle || jobData.title || 'Job Title Not Available',
            company: jobData.companyName || jobData.company?.display_name || 'Company Not Available',
            location: jobData.location?.display_name || jobData.location || 'Location Not Available',
            salary: jobData.salary || 'Salary Not Disclosed',
            description: jobData.description || 'No description available',
            redirect_url: jobData.redirect_url || '#',
            createdAt: item.createdAt || new Date().toISOString()
          };
        }).filter(job => job.id); // Filter out jobs without valid IDs

        setSavedJobs(transformedJobs);
      }
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/login");
      } else {
        toast.error("Failed to fetch saved jobs");
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUserData(), fetchSavedJobs()]);
    setRefreshing(false);
    toast.success("Dashboard refreshed!");
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      await Promise.all([fetchUserData(), fetchSavedJobs()]);
      setLoading(false);
    };

    initializeDashboard();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with User Profile */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white rounded-full p-1 shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <User size={36} className="text-blue-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userData?.username || "User"}</h2>
                <p className="text-blue-100 text-sm">{userData?.email || "email@example.com"}</p>
                <p className="text-blue-200 text-xs mt-1">
                  Experience Level: {userData?.experienceLevel || "Not specified"}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{savedJobs.length}</h3>
                <p className="text-gray-600 text-sm">Saved Jobs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">0</h3>
                <p className="text-gray-600 text-sm">Applications</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {userData?.experienceLevel || "N/A"}
                </h3>
                <p className="text-gray-600 text-sm">Experience Level</p>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Jobs Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">Your Saved Jobs</h1>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/companies")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Find More Jobs
                </button>
                <button
                  onClick={() => navigate("/resume")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Build Resume
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {savedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedJobs.map((job) => (
                  <JobCard key={job.id} job={job} onToggle={fetchSavedJobs} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Saved Jobs Yet</h3>
                <p className="text-gray-500 mb-6">Start exploring jobs and save the ones you're interested in!</p>
                <button
                  onClick={() => navigate("/companies")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Explore Jobs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default UserDashboard;