import React, { useState } from "react";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Upload, FileText } from "lucide-react";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [targetJob, setTargetJob] = useState("");
  const [industry, setIndustry] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };


  const getSimulationData = (jobTitle) => {
    const title = (jobTitle || "").toLowerCase();
    
    let keywords = ["Communication", "Teamwork", "Problem Solving"];
    let tips = [{ heading: "Formatting", detail: "Use a cleaner font like Roboto or Open Sans." }];
    let scoreBase = 70;

    if (title.match(/react|front|web/)) {
        keywords = ["React", "Redux", "Tailwind", "JavaScript", "DOM Manipulation"];
        tips.push({ heading: "Missing Skill", detail: "Consider adding 'TypeScript' to your skills section." });
        scoreBase = 82;
    } else if (title.match(/data|analy|python/)) {
        keywords = ["Python", "SQL", "Pandas", "Tableau", "Data Cleaning"];
        tips.push({ heading: "Impact", detail: "Add more metrics (e.g., 'Processed 1TB+ data')." });
        scoreBase = 78;
    } else if (title.match(/design|ui|ux/)) {
        keywords = ["Figma", "Wireframing", "User Research", "Prototyping"];
        tips.push({ heading: "Portfolio", detail: "Make sure your portfolio link is clickable and visible at the top." });
        scoreBase = 88;
    }

 
    const finalScore = scoreBase + Math.floor(Math.random() * 10);

    return {
      atsScore: Math.min(finalScore, 99), // Cap at 99
      keywords: keywords,
      recommendations: tips,
      
    };
  };

  const handleAnalyze = () => {
    if (!file) {
      alert("Please upload a resume first!");
      return;
    }
    setLoading(true);

   
    setTimeout(() => {
     
      const dynamicData = getSimulationData(targetJob);

      const mockResults = {
        atsScore: dynamicData.atsScore,
        keywords: dynamicData.keywords,
        filename: file.name,
        size: file.size,
        recommendations: dynamicData.recommendations
      };

      setResults(mockResults);
      setActiveTab("results");
      setLoading(false);
    }, 2500); // 2.5s late
   
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
          🚀 AI Resume Analyzer
        </h1>
        <p className="text-gray-600 text-lg">
          Get ATS scores, keyword insights, and professional optimization tips
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-6 mb-10 border-b">
        {["upload", "results", "tips"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            disabled={!results && tab !== "upload"}
            className={`px-6 py-3 rounded-t-xl font-semibold transition ${
              activeTab === tab
                ? "bg-white shadow-md text-indigo-600 border-t-2 border-indigo-600"
                : "text-gray-500 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {tab === "upload" && "📂 Upload & Configure"}
            {tab === "results" && "📊 Analysis Results"}
            {tab === "tips" && "💡 Optimization Tips"}
          </button>
        ))}
      </div>

      {/* Upload & Configure */}
      {activeTab === "upload" && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Upload Card */}
          <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <Upload className="w-6 h-6 text-indigo-600" />
              Upload Resume
            </h2>
            <p className="text-gray-500 mb-4">
              Upload your resume in PDF, DOC, or DOCX format
            </p>
            <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition relative">
                <FileText className="w-12 h-12 text-indigo-500 mb-4" />
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <p className="text-gray-700 font-medium">
                {file ? file.name : "Click to Upload or Drag & Drop"}
              </p>
            </div>
          </div>

          {/* Target Job Config */}
          <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Target Job Configuration
            </h2>

            <label className="block text-gray-600 font-medium mb-1">
              🎯 Target Job Role
            </label>
            <input
              type="text"
              value={targetJob}
              onChange={(e) => setTargetJob(e.target.value)}
              placeholder="e.g., Frontend Developer"
              className="w-full mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <label className="block text-gray-600 font-medium mb-1">
              🏢 Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select industry</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
            </select>

            <button
              onClick={handleAnalyze}
              className={`w-full py-3 rounded-lg font-semibold text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } transition`}
              disabled={loading || !file}
            >
              {loading ? "Analyzing..." : "Analyze Resume with AI"}
            </button>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {activeTab === "results" && results && (
        <div className="bg-white p-8 rounded-2xl shadow-lg animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            📊 Analysis Results
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ATS Score Circle */}
            <div className="flex flex-col items-center p-6 bg-indigo-50 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4">ATS Score</h3>
              <div className="w-40 h-40">
                <CircularProgressbar
                  value={results.atsScore}
                  text={`${results.atsScore}%`}
                  styles={buildStyles({
                    pathColor: results.atsScore > 70 ? "#22c55e" : "#eab308",
                    textColor: "#4f46e5",
                    trailColor: "#e5e7eb",
                  })}
                />
              </div>
            </div>

            {/* Keywords Chart */}
            <div className="col-span-2 p-6 bg-green-50 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4">Keyword Coverage</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={results.keywords.map((k) => ({
                    name: k,
                    count: Math.floor(Math.random() * 8) + 3,
                  }))}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* File Info */}
          <div className="mt-8 p-6 bg-purple-50 rounded-xl shadow-md text-center">
            <h3 className="font-semibold text-lg mb-2">📂 File Info</h3>
            <p className="text-gray-600">
              {results.filename} ({(results.size / 1024).toFixed(1)} KB)
            </p>
          </div>
        </div>
      )}

      {/* Optimization Tips */}
      {activeTab === "tips" && results && (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            💡 Optimization Tips
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.recommendations.map((tip, idx) => (
              <div
                key={idx}
                className="p-5 bg-white rounded-xl shadow-md border hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-indigo-600 mb-2">
                  {tip.heading || `Tip ${idx + 1}`}
                </h3>
                <p className="text-gray-600">{tip.detail || tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}