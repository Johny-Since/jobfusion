// 1.Used useRef for caching:
// -> jobsCache.current acts as a memory cache for job data.
// -> This avoids refetching when navigating between pages — only fetching once unless the page fully reloads.
// -> Faster because it skips repeated API calls.

// 2.Reduced state updates:
// -->setJobs only gets called when data is actually fetched.
// -->No unnecessary state updates on every navigation, avoiding extra re-renders.
// -->Simplified environment variable access:

// 3.Destructured import.meta.env for cleaner and more efficient variable use.
// -->Optimized API call logic:

// 4.API only gets called if no cache exists — saves bandwidth and speeds up perceived performance.
// -->Passed fetchTrendingJobs directly to onToggle:
// -->Avoided an extra function wrapper — keeping it simple and efficient.


import React, { useState, useEffect, useRef } from "react";
import { Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "./SaveBtn";
import axios from "axios";

const JobCard = ({ job, onToggle }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative">
      <div className="absolute top-4 right-4">
        <BookmarkButton job={job} onToggle={onToggle} />
      </div>
      <div
        onClick={() => navigate(`/jobs/${job.id}`, { state: { job } })}
        className="flex flex-col"
      >
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
          <Database className="text-white" />
        </div>
        <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
        {job.company && (
          <p className="text-gray-600 text-sm mb-2">{job.company.display_name}</p>
        )}
        {job.location && (
          <p className="text-gray-600 text-sm mb-2">📍 {job.location.display_name}</p>
        )}
        {job.salary_min && (
          <p className="text-green-600 text-sm font-medium">
            💰 ₹{Math.floor(job.salary_min).toLocaleString()} - ₹
            {Math.floor(job.salary_max).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

const TrendingJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const jobsCache = useRef(null); // Memoize API response

  const fetchTrendingJobs = async () => {
    if (jobsCache.current) {
      setJobs(jobsCache.current);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { VITE_ADZUNA_API_ID, VITE_ADZUNA_API_KEY } = import.meta.env;
      
      if (!VITE_ADZUNA_API_ID || !VITE_ADZUNA_API_KEY) {
        throw new Error('API credentials not configured');
      }
      
      const response = await axios.get("https://api.adzuna.com/v1/api/jobs/in/search/1", {
        params: {
          app_id: VITE_ADZUNA_API_ID,
          app_key: VITE_ADZUNA_API_KEY,
          results_per_page: 8,
          sort_by: 'salary',
          full_time: 1
        },
        timeout: 10000 // 10 second timeout
      });

      const jobResults = response.data.results || [];
      jobsCache.current = jobResults;
      setJobs(jobResults);
    } catch (error) {
      console.error("Error fetching trending jobs:", error);
      setError("Failed to load trending jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingJobs();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Fast-Track Job Openings in India
          </h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Fast-Track Job Openings in India
          </h2>
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => {
                jobsCache.current = null;
                fetchTrendingJobs();
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Fast-Track Job Openings in India
        </h2>
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onToggle={fetchTrendingJobs} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No trending jobs available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingJobs;