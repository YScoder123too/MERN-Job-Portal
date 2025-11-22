import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { FileText, Download, Eye, Save, Sparkles, RefreshCcw, Upload } from "lucide-react";

const generateAIContent = (type, roleInput = "") => {
  const role = roleInput.toLowerCase();
  if (!role) return "Please enter a Job Role in 'Personal Info' first.";

  if (type === "summary") {
    if (role.includes("front")) return "Passionate Frontend Developer with expertise in React.js and modern CSS frameworks. Dedicated to building responsive, user-friendly interfaces.";
    if (role.includes("back")) return "Backend Engineer skilled in Node.js, Express, and MongoDB. Focused on building scalable APIs and secure database architectures.";
    if (role.includes("data")) return "Data Analyst with strong SQL and Python skills. Experienced in visualizing complex datasets to drive business decisions.";
    return `Motivated ${roleInput} with a strong background in the industry. Committed to delivering high-quality results and continuous learning.`;
  }

  if (type === "skills") {
    if (role.includes("front")) return "React, JavaScript, HTML5, CSS3, Tailwind, Redux, Git";
    if (role.includes("back")) return "Node.js, Express, MongoDB, SQL, REST APIs, Docker";
    if (role.includes("data")) return "Python, SQL, Tableau, PowerBI, Excel, Machine Learning";
    return "Communication, Teamwork, Project Management, Problem Solving";
  }

  if (type === "experience") {
    if (role.includes("front")) return "Frontend Dev at TechCorp: Improved page load speed by 30%. Built reusable component library used by 3 teams.";
    if (role.includes("back")) return "Backend Dev at DataSystems: Optimized API response times by 40%. Designed scalable database schema for 1M+ users.";
    return `Role at Company: Key achiever in ${roleInput} team. Delivered projects on time and exceeded KPIs.`;
  }

  return "";
};

const templateStyles = {
  Modern: { container: "bg-white border border-indigo-500", title: "text-indigo-700 font-extrabold text-4xl", sectionTitle: "text-indigo-600 font-bold text-lg", font: "font-sans", photoShape: "rounded-full w-32 h-32 object-cover border-4 border-indigo-100", sectionNumber: true },
  Classic: { container: "bg-gray-50 border border-gray-700", title: "text-gray-900 font-serif text-3xl", sectionTitle: "text-gray-800 font-semibold text-lg", font: "font-serif", photoShape: "rounded-lg w-32 h-32 object-cover border border-gray-400", sectionNumber: false },
  Creative: { container: "bg-pink-50 border border-pink-600", title: "text-pink-600 font-bold text-4xl", sectionTitle: "text-pink-500 font-semibold text-lg", font: "font-sans", photoShape: "rounded-full w-32 h-32 object-cover border-4 border-pink-400", sectionNumber: true },
  Minimal: { container: "bg-gray-50 border border-gray-400", title: "text-gray-700 font-medium text-3xl", sectionTitle: "text-gray-600 font-semibold text-lg", font: "font-sans", photoShape: "rounded w-32 h-32 object-cover", sectionNumber: false },
};

export default function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState("personal");
  const [template, setTemplate] = useState("Creative");
  const [photo, setPhoto] = useState(null); 
  const [f, setF] = useState({
    firstName: "", lastName: "", role: "", email: "", phone: "", location: "", website: "", linkedin: "", github: "", summary: "", education: "", experience: "", skills: "", projects: "",
  });

  const handleSave = () => { localStorage.setItem("resumeData", JSON.stringify(f)); alert("✅ Resume saved!"); };
  useEffect(() => { const saved = localStorage.getItem("resumeData"); if (saved) setF(JSON.parse(saved)); }, []);

  const handleAIAssist = () => {
    const targetRole = f.role || prompt("Enter Target Job Role (e.g. Frontend Developer):");
    if (!targetRole) return;
    
    const updated = { ...f, role: targetRole };
    ["summary", "skills", "experience"].forEach(key => {
        if (!updated[key]) updated[key] = generateAIContent(key, targetRole);
    });
    setF(updated);
    alert("✨ AI Content Generated!");
  };

  const generateField = (key) => {
      const targetRole = f.role || prompt("Enter Target Job Role:");
      if(targetRole) {
          setF(prev => ({...prev, role: targetRole, [key]: generateAIContent(key, targetRole)}));
      }
  };

  const handlePhotoUpload = (e) => { 
      if (e.target.files && e.target.files[0]) {
          setPhoto(URL.createObjectURL(e.target.files[0]));
      }
  };
  
  const makePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text(`${f.firstName} ${f.lastName}`, 14, 20);
    doc.setFontSize(14); doc.setTextColor(100); doc.text(f.role, 14, 28);
    doc.setTextColor(0); doc.setFontSize(11); doc.text(`${f.phone} | ${f.email}`, 14, 36);
    doc.save("Resume.pdf");
  };

  const renderInput = (label, placeholder, key, rows = 1) => (
    <div className="flex flex-col">
      <label className="mb-1 font-semibold text-gray-700">{label}</label>
      {rows === 1 ? (
        <input type="text" placeholder={placeholder} value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition" />
      ) : (
        <textarea rows={rows} placeholder={placeholder} value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition resize-none" />
      )}
      {["summary", "skills", "experience"].includes(key) && (
        <button onClick={() => generateField(key)} className="mt-2 self-start px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:opacity-90 flex items-center gap-1 text-sm">
          <RefreshCcw className="w-4 h-4" /> Generate with AI
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <div><h1 className="text-2xl font-bold flex items-center gap-2 text-indigo-600"><FileText/> Resume Builder</h1></div>
        <div className="flex gap-3">
          <button onClick={handleAIAssist} className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-gray-100"><Sparkles size={16}/> AI Assist</button>
          <button onClick={() => setActiveTab("preview")} className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-gray-100"><Eye size={16}/> Preview</button>
          <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-gray-100"><Save size={16}/> Save</button>
          <button onClick={makePDF} className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"><Download size={16}/> Download</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white shadow-lg p-6 border-r overflow-y-auto">
            <h2 className="font-bold text-lg mb-4 text-gray-800">Templates</h2>
            {["Modern", "Classic", "Creative", "Minimal"].map(t => (
                <div key={t} onClick={() => setTemplate(t)} className={`p-3 rounded cursor-pointer border mb-2 ${template===t ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}>{t}</div>
            ))}
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex gap-6 border-b px-6 mt-4">
            {[{key:"personal", label:"Personal"}, {key:"experience", label:"Experience"}, {key:"education", label:"Education"}, {key:"skills", label:"Skills"}, {key:"preview", label:"Preview"}].map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)} className={`pb-2 font-medium ${activeTab === t.key ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}>{t.label}</button>
            ))}
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            {activeTab === "preview" ? (
               <div className={`p-10 shadow-xl max-w-3xl mx-auto ${templateStyles[template].container} ${templateStyles[template].font}`}>
                  
                  {/* --- PROFILE PHOTO IN PREVIEW --- */}
                  {photo && (
                    <div className="flex justify-center mb-6">
                      <img src={photo} alt="Profile" className={templateStyles[template].photoShape} />
                    </div>
                  )}

                  <h1 className={`text-center ${templateStyles[template].title}`}>{f.firstName} {f.lastName}</h1>
                  <p className="text-xl text-indigo-600 text-center font-medium">{f.role}</p>
                  <p className="mb-4 text-gray-600 text-center mt-2">{f.email} | {f.phone} | {f.location}</p>
                  <hr className="my-4"/>
                  <div className="mb-4"><h3 className={templateStyles[template].sectionTitle}>Summary</h3><p>{f.summary}</p></div>
                  <div className="mb-4"><h3 className={templateStyles[template].sectionTitle}>Experience</h3><p>{f.experience}</p></div>
                  <div className="mb-4"><h3 className={templateStyles[template].sectionTitle}>Skills</h3><p>{f.skills}</p></div>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTab === "personal" && (
                    <>
                        <div className="col-span-2 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition relative">
                            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <Upload className="text-gray-400 mb-2" size={32}/>
                            <span className="text-gray-600 font-medium">{photo ? "Change Profile Photo" : "Upload Profile Photo"}</span>
                        </div>

                        {renderInput("First Name", "John", "firstName")}
                        {renderInput("Last Name", "Doe", "lastName")}
                        {renderInput("Target Role (For AI)", "e.g. React Developer", "role")}
                        {renderInput("Email", "john@example.com", "email")}
                        {renderInput("Phone", "123-456-7890", "phone")}
                        {renderInput("Location", "New York, USA", "location")}
                        <div className="col-span-2">
                            {renderInput("Professional Summary", "Summary...", "summary", 4)}
                        </div>
                    </>
                )}
                {activeTab === "experience" && renderInput("Work Experience", "Describe...", "experience", 6)}
                {activeTab === "skills" && renderInput("Skills", "List skills...", "skills", 4)}
                {activeTab === "education" && renderInput("Education", "Degree...", "education", 4)}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}