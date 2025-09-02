// Avoided unnecessary API calls : I used useRef

// Optimized state management --> The companiesCache.current check ensures the API call only happens once.

// Reduced state updates --> The setCompanies function only gets called when data is actually fetched.


import React, { useState, useEffect, useRef } from 'react';

const CompanyCard = ({ canonical_name, count, description, average_salary }) => {
  const jobType = (average_salary !== undefined && average_salary !== null && average_salary > 15000)
    ? "Full Time"
    : "Part Time";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {canonical_name ? canonical_name.charAt(0).toUpperCase() : 'C'}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          jobType === "Full Time" 
            ? "bg-green-100 text-green-700" 
            : "bg-orange-100 text-orange-600"
        }`}>
          {jobType}
        </span>
      </div>
      <h3 className="font-semibold text-lg mb-2">
        {canonical_name || "Unknown Company"}
      </h3>
      <p className="text-gray-600">
        {description || `Leading ${canonical_name || "this company"} in the industry.`}
      </p>
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Vacancies:</span> {count || "N/A"}
          </p>
          {average_salary && (
            <p className="text-green-600 text-sm font-medium">
              ₹{Math.floor(average_salary).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const TopCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const companiesCache = useRef(null);

  const fetchTopCompanies = async () => {
    if (companiesCache.current) {
      setCompanies(companiesCache.current);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const ADZUNA_API_ID = import.meta.env.VITE_ADZUNA_API_ID;
      const ADZUNA_API_KEY = import.meta.env.VITE_ADZUNA_API_KEY;

      if (!ADZUNA_API_ID || !ADZUNA_API_KEY) {
        throw new Error('API credentials not configured');
      }

      const response = await fetch(
        `https://api.adzuna.com/v1/api/jobs/in/top_companies?app_id=${ADZUNA_API_ID}&app_key=${ADZUNA_API_KEY}&content-type=application/json`,
        {
          signal: AbortSignal.timeout(10000) // 10 second timeout
        }
      );
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();

      if (data && data.leaderboard) {
        const customizedCompanies = data.leaderboard.map((company) => ({
          ...company,
          description: company.description || `Leading company in the ${company.canonical_name?.toLowerCase()} sector with innovative solutions and growth opportunities.`
        })).slice(0, 9); // Limit to 9 companies for better layout
        
        companiesCache.current = customizedCompanies;
        setCompanies(customizedCompanies);
      } else {
        throw new Error("No company data available");
      }
    } catch (error) {
      console.error('Error fetching top companies:', error);
      setError("Failed to load top companies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopCompanies();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Top Companies</h2>
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
          <h2 className="text-3xl font-bold text-center mb-12">Top Companies</h2>
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => {
                companiesCache.current = null;
                fetchTopCompanies();
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
        <h2 className="text-3xl font-bold text-center mb-12">Top Companies</h2>
        {companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            companies.map((company, index) => (
              <CompanyCard key={index} {...company} />
            ))
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No companies available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopCompanies;