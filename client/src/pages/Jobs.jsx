import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { MapPin, Search, X, Filter, Upload, CheckCircle, Lock } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Footer from "../components/ui/Footer";

const generateMockJobs = () => {
  const roles = ["Frontend Dev", "Backend Engineer", "Full Stack", "UI/UX Designer", "Product Manager", "Data Scientist", "DevOps", "QA Tester", "Mobile Dev", "Cloud Architect"];
  const companies = ["Google", "Amazon", "Microsoft", "Netflix", "Spotify", "Tesla", "Meta", "Apple", "Adobe", "Salesforce", "Oracle", "IBM", "Intel", "Cisco", "Airbnb"];
  const locations = ["Remote", "New York", "London", "Bangalore", "San Francisco", "Berlin", "Toronto", "Singapore", "Austin", "Seattle", "Mumbai", "Sydney"];
  const types = ["Full-time", "Contract", "Part-time", "Freelance", "Internship"];

  return Array.from({ length: 1250 }, (_, i) => ({
    id: `mock_${i}`,
    title: i % 3 === 0 ? `Senior ${roles[i % roles.length]}` : roles[i % roles.length],
    company: companies[i % companies.length],
    location: locations[i % locations.length],
    type: types[i % types.length],
    salary: i % 5 === 0 ? "Not Disclosed" : `$${80 + (i % 50)}k - $${120 + (i % 60)}k`,
    description: "Join our team to build scalable solutions using modern tech stacks. Great benefits and culture.",
    url: "#",
    isLocal: false,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
  }));
};


const ApplyModal = ({ job, onClose, onSubmit }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(job, coverLetter, resumeFile);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">Apply for {job.title}</h2>
        <p className="text-sm text-gray-500 mb-6">{job.company}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition relative cursor-pointer">
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />

              <div className="flex flex-col items-center gap-2">
                {resumeFile ? (
                  <>
                    <CheckCircle className="text-green-500 w-8 h-8" />
                    <span className="text-sm font-medium text-gray-800">{resumeFile.name}</span>
                  </>
                ) : (
                  <>
                    <Upload className="text-gray-400 w-8 h-8" />
                    <span className="text-sm text-gray-500">Click to upload PDF</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
            <textarea
              required
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Why are you a good fit?"
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none resize-none"
            />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition">
            {isSubmitting ? "Sending..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function Jobs() {
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const navigate = useNavigate();
  const locationHook = useLocation();

  const [rawJobs, setRawJobs] = useState([]);
  const [displayJobs, setDisplayJobs] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const [applyingJob, setApplyingJob] = useState(null);
  const [applied, setApplied] = useState({});
  const [isGuest, setIsGuest] = useState(true);

  const [showJobSuggestions, setShowJobSuggestions] = useState(false);
  const [showLocSuggestions, setShowLocSuggestions] = useState(false);
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [locSuggestions, setLocSuggestions] = useState([]);

  const [activeFilter, setActiveFilter] = useState(null);
  const [filters, setFilters] = useState({
    jobType: [],
    remote: [],
    datePosted: []
  });

  const filterOptions = {
    jobType: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
    remote: ["Remote", "Onsite", "Hybrid"],
    datePosted: ["Last 24 hours", "Last 7 days", "Last 30 days"]
  };

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` }, withCredentials: true } : null;
  };

  const normalizeJobData = (job) => ({
    id: String(job._id || job.id),
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    description: job.description,
    salary: job.salary || "Not Disclosed",
    createdAt: job.createdAt,
    url: job.url || "#",
    isLocal: !!job._id
  });

  // Load jobs 
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsGuest(!token);

    const load = async () => {
      let jobs = [];

      try {
        const res = await axios.get(`${BACKEND_URL}/api/jobs`, { withCredentials: true });
        const arr = Array.isArray(res.data) ? res.data : res.data.data || [];
        jobs = arr.map(normalizeJobData);
      } catch (e) {}

      jobs = [...jobs, ...generateMockJobs()];
      setRawJobs(jobs);

      if (token) {
        try {
          const res = await axios.get(`${BACKEND_URL}/api/applications/my`, getAuthConfig());
          const map = {};
          res.data.forEach((a) => (map[a.job?._id] = true));
          setApplied(map);
        } catch (e) {}
      }
    };

    load();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    setSearchQuery(params.get("keyword") || "");
    setLocationQuery(params.get("location") || "");
  }, [locationHook.search]);

  // FILTER ENGINE (from second code)
  const filteredJobs = useMemo(() => {
    return rawJobs.filter((job) => {
      const matchesSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        !locationQuery || job.location.toLowerCase().includes(locationQuery.toLowerCase());

      const matchesType =
        filters.jobType.length === 0 ||
        filters.jobType.some((t) => job.type.toLowerCase().includes(t.toLowerCase()));

      let matchesRemote = true;
      if (filters.remote.length > 0) {
        const isRemote = job.location.toLowerCase().includes("remote");
        const isHybrid = job.location.toLowerCase().includes("hybrid");

        matchesRemote = filters.remote.some((f) => {
          if (f === "Remote") return isRemote;
          if (f === "Onsite") return !isRemote && !isHybrid;
          if (f === "Hybrid") return isHybrid;
        });
      }

      let matchesDate = true;
      if (filters.datePosted.length > 0) {
        const jobDate = new Date(job.createdAt);
        const now = new Date();
        const diff = (now - jobDate) / 36e5;

        matchesDate = filters.datePosted.some((f) => {
          if (f === "Last 24 hours") return diff <= 24;
          if (f === "Last 7 days") return diff <= 168;
          if (f === "Last 30 days") return diff <= 720;
        });
      }

      return matchesSearch && matchesLocation && matchesType && matchesRemote && matchesDate;
    });
  }, [rawJobs, searchQuery, locationQuery, filters]);

  
  useEffect(() => {
    const limit = isGuest ? 9 : filteredJobs.length;
    setDisplayJobs(filteredJobs.slice(0, limit));
  }, [filteredJobs, isGuest]);

  
  useEffect(() => {
    if (searchQuery.length > 1) {
      const set1 = [...new Set(rawJobs.map((j) => j.title))];
      setJobSuggestions(set1.filter((t) => t.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6));
    } else setJobSuggestions([]);
  }, [searchQuery]);

  useEffect(() => {
    if (locationQuery.length > 1) {
      const set2 = [...new Set(rawJobs.map((j) => j.location))];
      setLocSuggestions(set2.filter((l) => l.toLowerCase().includes(locationQuery.toLowerCase())).slice(0, 6));
    } else setLocSuggestions([]);
  }, [locationQuery]);

  const handleApplyClick = (job) => {
    if (isGuest) return navigate("/login");
    if (job.url?.startsWith("http")) return window.open(job.url, "_blank");
    setApplyingJob(job);
  };

  const handleModalSubmit = async (job, coverLetter, resumeFile) => {
    let resumeFilename = "";

    try {
      if (resumeFile) {
        const fd = new FormData();
        fd.append("resume", resumeFile);

        const upload = await axios.post(`${BACKEND_URL}/api/jobs/upload-resume`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        resumeFilename = upload.data.filePath.split(/[/\\]/).pop();
      }

      if (job.isLocal) {
        await axios.post(
          `${BACKEND_URL}/api/applications`,
          { jobId: job.id, coverLetter, resume: resumeFilename },
          getAuthConfig()
        );
      }

      alert("Success! Application sent to HR.");
      setApplied((p) => ({ ...p, [job.id]: true }));
      setApplyingJob(null);
    } catch (e) {
      alert("Application sent (text only).");
      setApplyingJob(null);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
      };
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {applyingJob && <ApplyModal job={applyingJob} onClose={() => setApplyingJob(null)} onSubmit={handleModalSubmit} />}

      {/* HERO SECTION (OPTION B) */}
      <div className="relative bg-gradient-to-br from-indigo-700 to-blue-600 py-20 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 drop-shadow-md">
          Find Your Dream Job
        </h2>

        {/* Search Box */}
        <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-2xl p-2 max-w-4xl mx-auto relative">
          {/* JOB INPUT */}
          <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200 relative">
            <Search className="text-gray-400 w-5 h-5 mr-3" />
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowJobSuggestions(true)}
              onBlur={() => setTimeout(() => setShowJobSuggestions(false), 200)}
              className="w-full outline-none p-2 text-gray-700"
            />

            {/* Job suggestions */}
            {showJobSuggestions && jobSuggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white shadow-xl border rounded-b-xl z-50 text-left">
                {jobSuggestions.map((s, i) => (
                  <li key={i} className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm" onClick={() => setSearchQuery(s)}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* LOCATION INPUT */}
          <div className="flex-1 flex items-center px-4 py-3 relative">
            <MapPin className="text-gray-400 w-5 h-5 mr-3" />
            <input
              type="text"
              placeholder="City, state, or remote"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onFocus={() => setShowLocSuggestions(true)}
              onBlur={() => setTimeout(() => setShowLocSuggestions(false), 200)}
              className="w-full outline-none p-2 text-gray-700"
            />

            {showLocSuggestions && locSuggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white shadow-xl border rounded-b-xl z-50 text-left">
                {locSuggestions.map((s, i) => (
                  <li key={i} className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm" onClick={() => setLocationQuery(s)}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-bold py-3 px-8 rounded-lg transition">
            Search
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border-b px-6 py-3 shadow-sm sticky top-[72px] z-40">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3">
          {Object.keys(filterOptions).map((key) => (
            <div key={key} className="relative">
              <button
                onClick={() => setActiveFilter(activeFilter === key ? null : key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition flex items-center gap-2 ${
                  activeFilter === key ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {key.replace(/([A-Z])/g, " $1")}
                <Filter size={14} />
              </button>

              {activeFilter === key && (
                <div className="absolute top-full mt-2 w-56 bg-white rounded-xl shadow-xl border p-3 z-50">
                  {filterOptions[key].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters[key].includes(opt)}
                        onChange={() => handleFilterChange(key, opt)}
                        className="rounded text-indigo-600"
                      />
                      <span className="text-sm text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* JOB LIST */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {isGuest ? `Showing Top 9 Jobs (${rawJobs.length} available)` : `${filteredJobs.length} Jobs Found`}
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayJobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-lg transition flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{job.title}</h4>
                  <p className="text-indigo-600 text-sm font-medium">{job.company}</p>
                </div>
                <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded font-semibold">
                  {job.type}
                </span>
              </div>

              <div className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                <MapPin size={14} /> {job.location}
              </div>

              <div className="text-gray-600 text-sm mb-4 line-clamp-2">
                {job.description.slice(0, 100)}...
              </div>

              <div className="mt-auto pt-4 border-t flex justify-between items-center">
                <p className="font-bold text-gray-700 text-sm">{job.salary}</p>

                <button
                  onClick={() => handleApplyClick(job)}
                  disabled={applied[job.id]}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                    applied[job.id] ? "bg-green-100 text-green-700" : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {applied[job.id] ? "Applied ✅" : "Apply Now"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* GUEST BLOCK */}
        {isGuest && (
          <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 text-center text-white shadow-2xl">
            <Lock size={48} className="mx-auto mb-4 text-yellow-300" />
            <h2 className="text-3xl font-extrabold mb-4">Want to see 1,200+ more jobs?</h2>

            <p className="text-indigo-100 mb-8 text-lg max-w-2xl mx-auto">
              Create a free account to unlock the full database, resume builder, and skill quizzes.
            </p>

            <Link
              to="/register"
              className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-gray-100"
            >
              Create Free Account
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
