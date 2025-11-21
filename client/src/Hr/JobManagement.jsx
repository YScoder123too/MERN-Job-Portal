import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Eye, Pencil, Trash2, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const JobManagement = () => {
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getAuthConfig = () => {
    let token = localStorage.getItem("token");
    if (!token) {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) token = JSON.parse(userInfo).token;
    }
    return {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    };
  };

  // --- GET CURRENT USER ID ---
  const getCurrentUserId = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
        try {
            return JSON.parse(userInfo).id;
        } catch (e) { return null; }
    }
    return null;
  };

  // --- FETCH JOBS (STRICT FILTERING ENABLED) ---
  const fetchJobs = async () => {
    try {
      const myId = getCurrentUserId();
      const res = await axios.get(`${BACKEND_URL}/api/jobs`, getAuthConfig());
      const allJobs = Array.isArray(res.data) ? res.data : res.data.data || [];
      
      // FILTER: Only show jobs where postedBy matches MY ID
      const myJobs = allJobs.filter(job => {
          // Handle case where postedBy might be an object (if populated) or a string
          const posterId = (job.postedBy && typeof job.postedBy === 'object') ? job.postedBy._id : job.postedBy;
          return posterId === myId;
      });
      
      setJobs(myJobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const payload = {
      title: form.title.value,
      company: form.company.value,
      location: form.location.value,
      type: form.type.value,
      salary: form.salary.value,
      description: form.description.value,
      department: form.department.value || "Engineering", 
      status: "Active"
    };

    try {
      if (modalType === "create") {
        await axios.post(`${BACKEND_URL}/api/jobs`, payload, getAuthConfig());
      }
      setShowModal(false);
      fetchJobs(); 
    } catch (err) {
      console.error("Error saving job:", err);
      alert(`Error: ${err.response?.data?.message || "Failed to create job."}`);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/jobs/${id}`, getAuthConfig());
      setJobs(jobs.filter((j) => j._id !== id && j.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete.");
    }
  };

  const filteredJobs = jobs.filter((job) =>
    (job.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Job Management</h1>
          <p className="text-gray-500">
            Manage your job postings and track applicants.
          </p>
        </div>
        <button
          onClick={() => {
            setModalType("create");
            setSelectedJob(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white px-6 py-2.5 rounded-lg shadow-md transition"
        >
          <Plus className="w-5 h-5" />
          Create Job Posting
        </button>
      </div>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden border">
        <table className="min-w-full border-collapse">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200 sticky top-0 shadow-sm">
            <tr>
              {["Job Title", "Company", "Location", "Type", "Salary", "Actions"].map((header, idx) => (
                <th key={idx} className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan="6" className="text-center py-6">Loading jobs...</td></tr>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job, idx) => (
                <motion.tr
                  key={job._id || job.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`hover:bg-indigo-50 transition ${idx % 2 === 0 ? "bg-gray-50/30" : "bg-white"}`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{job.title}</td>
                  <td className="px-6 py-4 text-gray-600">{job.company}</td>
                  <td className="px-6 py-4 text-gray-600">{job.location}</td>
                  <td className="px-6 py-4 text-gray-600"><span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">{job.type}</span></td>
                  <td className="px-6 py-4 text-gray-600">{job.salary || "N/A"}</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <button onClick={() => handleDelete(job._id || job.id)} className="text-red-600 hover:bg-red-100 p-2 rounded-full"><Trash2 size={18}/></button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr><td colSpan="6" className="text-center py-6 text-gray-500">No jobs found. Create one!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500"><X className="w-5 h-5" /></button>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Job Posting</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Job Title</label><input name="title" required className="w-full border rounded p-2" placeholder="e.g. React Dev" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Company</label><input name="company" required className="w-full border rounded p-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Location</label><input name="location" required className="w-full border rounded p-2" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div><label className="block text-sm font-medium mb-1">Department</label><input name="department" className="w-full border rounded p-2" /></div>
                   <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select name="type" className="w-full border rounded p-2">
                      <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
                    </select>
                  </div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Salary</label><input name="salary" className="w-full border rounded p-2" placeholder="$50k - $80k" /></div>
                <div><label className="block text-sm font-medium mb-1">Description</label><textarea name="description" required rows="3" className="w-full border rounded p-2"></textarea></div>
                
                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Create Job</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobManagement;