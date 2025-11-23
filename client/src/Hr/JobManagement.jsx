import React, { useState, useEffect } from "react";
import api from "../../services/api"; // ✅ FIXED: Import central API
import { Plus, Users, Trash2, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const JobManagement = () => {
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchJobs = async () => {
    try {
      // ✅ FIXED: Using api instance
      const res = await api.get("/jobs");
      setJobs(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) { console.error(err); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

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
      hrEmail: form.hrEmail.value, 
      status: "Active"
    };

    try {
      // ✅ FIXED: Using api instance
      await api.post("/jobs", payload);
      setShowModal(false);
      fetchJobs(); 
    } catch (err) { alert("Failed to create job."); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this job?")) return;
    try {
      // ✅ FIXED: Using api instance
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter((j) => j._id !== id && j.id !== id));
    } catch (err) { alert("Failed to delete."); }
  };

  const filteredJobs = jobs.filter((job) => (job.title || "").toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="text-3xl font-bold text-gray-800">Job Management</h1><p className="text-gray-500">Manage job postings and track applicants.</p></div>
        <button onClick={() => { setSelectedJob(null); setShowModal(true); }} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg shadow hover:bg-indigo-700"><Plus size={20} /> Create Job</button>
      </div>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden border">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>{["Job Title", "Company", "Location", "Type", "Salary", "Actions"].map((h, i) => (<th key={i} className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{h}</th>))}</tr>
          </thead>
          <tbody>
            {filteredJobs.map((job, idx) => (
                <tr key={job._id || idx} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{job.title}</td>
                  <td className="px-6 py-4 text-gray-600">{job.company}</td>
                  <td className="px-6 py-4 text-gray-600">{job.location}</td>
                  <td className="px-6 py-4"><span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">{job.type}</span></td>
                  <td className="px-6 py-4 text-gray-600">{job.salary || "N/A"}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => navigate("/hr-dashboard/applications")} className="text-indigo-600 p-2 hover:bg-indigo-50 rounded" title="View Applicants"><Users size={18}/></button>
                    <button onClick={() => handleDelete(job._id || job.id)} className="text-red-600 p-2 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500"><X size={20}/></button>
              <h2 className="text-xl font-bold mb-4">Create Job Posting</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Job Title</label><input name="title" required className="w-full border rounded p-2" placeholder="e.g. React Dev" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Company</label><input name="company" required className="w-full border rounded p-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Location</label><input name="location" required className="w-full border rounded p-2" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div><label className="block text-sm font-medium mb-1">Type</label><select name="type" className="w-full border rounded p-2"><option>Full-time</option><option>Part-time</option><option>Contract</option></select></div>
                   <div><label className="block text-sm font-medium mb-1">Salary</label><input name="salary" className="w-full border rounded p-2" placeholder="$50k - $80k" /></div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-1"><Mail size={14}/> Contact Email (Visible to Candidates)</label>
                    <input name="hrEmail" type="email" className="w-full border rounded p-2" placeholder="hr@company.com" required />
                </div>
                <div><label className="block text-sm font-medium mb-1">Description</label><textarea name="description" required rows="3" className="w-full border rounded p-2"></textarea></div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Post Job</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobManagement;