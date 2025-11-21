import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import {
  FileText,
  Download,
  Eye,
  Save,
  Sparkles,
  RefreshCcw,
} from "lucide-react";


const generateAIContent = (type, roleInput = "") => {
  const role = roleInput.toLowerCase();


  if (type === "summary") {
    if (role.includes("frontend") || role.includes("front end") || role.includes("web")) {
      return "Passionate Frontend Developer specializing in building responsive, pixel-perfect web interfaces. Proficient in React.js, Tailwind CSS, and modern JavaScript frameworks to deliver exceptional user experiences.";
    } else if (role.includes("backend") || role.includes("back end")) {
      return "Robust Backend Engineer focused on scalable server-side logic and database management. Experienced in designing RESTful APIs, optimizing MongoDB queries, and ensuring secure authentication flows using Node.js.";
    } else if (role.includes("full") || role.includes("stack")) {
      return "Versatile Full Stack Developer with experience in the entire MERN stack. Proven track record of building end-to-end web solutions, from intuitive front-ends to powerful back-end architectures.";
    } else if (role.includes("developer") || role.includes("engineer")) {
      return "Innovative Software Engineer dedicated to writing clean, maintainable code. Skilled in the software development lifecycle and committed to continuous learning and problem-solving in dynamic environments.";
    } else if (role.includes("designer") || role.includes("ui") || role.includes("ux")) {
      return "Creative UI/UX Designer focused on crafting intuitive and visually stunning user experiences. Proficient in Figma and Adobe Suite, with a strong portfolio of user-centered design projects.";
    } else if (role.includes("manager") || role.includes("lead")) {
      return "Results-oriented Project Manager with 5+ years of experience leading cross-functional teams. Skilled in Agile methodologies, strategic planning, and driving operational efficiency.";
    } else if (role.includes("data") || role.includes("analyst")) {
      return "Detail-oriented Data Analyst skilled in Python and SQL. Experienced in transforming complex datasets into actionable insights to drive business decisions and strategy.";
    } else {
      return `Motivated professional aspiring to excel as a ${roleInput}. Dedicated to contributing to team success through hard work, attention to detail, and excellent organizational skills.`;
    }
  }


  if (type === "skills") {
    if (role.includes("frontend")) return "React, Vue.js, JavaScript (ES6+), HTML5, CSS3, Tailwind, Redux, Git";
    if (role.includes("backend")) return "Node.js, Express, MongoDB, SQL, REST APIs, Docker, AWS, Authentication";
    if (role.includes("full")) return "MongoDB, Express, React, Node.js, Git, Docker, Agile, AWS";
    if (role.includes("designer")) return "Figma, Adobe XD, Photoshop, Illustrator, Wireframing, Prototyping";
    if (role.includes("manager")) return "Project Management, Agile, Scrum, Leadership, Communication, Jira";
    if (role.includes("data")) return "Python, R, SQL, Tableau, PowerBI, Machine Learning, Excel";
    return "Communication, Teamwork, Problem Solving, Time Management, Leadership";
  }


  if (type === "experience") {
    if (role.includes("frontend")) return "Frontend Dev at TechCorp: Built responsive UIs using React, improving page load speed by 30%. Collaborated with designers to implement pixel-perfect layouts.";
    if (role.includes("backend")) return "Backend Engineer at DataSystems: Designed and maintained scalable APIs. Optimized database queries reducing server response time by 40%.";
    if (role.includes("full")) return "Full Stack Developer at StartUp Inc: Developed end-to-end features for the main e-commerce platform. Managed deployment pipelines and database migrations.";
    if (role.includes("designer")) return "Senior Designer at CreativeStudio: Led the redesign of the company website, increasing user engagement by 25%. Created design systems for mobile apps.";
    if (role.includes("data")) return "Data Analyst at FinTech Co: Analyzed customer transaction data to identify trends. Built automated dashboards that saved 10 hours of manual work weekly.";
    return "Role at Company (Year-Year): Achieved X results by implementing Y strategies. Collaborated with diverse teams to reach project goals.";
  }

  return "";
};

const templateStyles = {
  Modern: {
    container: "bg-white border border-indigo-500",
    title: "text-indigo-700 font-extrabold text-4xl",
    sectionTitle: "text-indigo-600 font-bold text-lg",
    font: "font-sans",
    photoShape: "rounded-full w-24 h-24",
    sectionNumber: true,
  },
  Classic: {
    container: "bg-gray-50 border border-gray-700",
    title: "text-gray-900 font-serif text-3xl",
    sectionTitle: "text-gray-800 font-semibold text-lg",
    font: "font-serif",
    photoShape: "rounded-lg w-24 h-24",
    sectionNumber: false,
  },
  Creative: {
    container: "bg-pink-50 border border-pink-600",
    title: "text-pink-600 font-bold text-4xl",
    sectionTitle: "text-pink-500 font-semibold text-lg",
    font: "font-sans",
    photoShape: "rounded-full w-28 h-28 border-4 border-pink-400",
    sectionNumber: true,
  },
  Minimal: {
    container: "bg-gray-50 border border-gray-400",
    title: "text-gray-700 font-medium text-3xl",
    sectionTitle: "text-gray-600 font-semibold text-lg",
    font: "font-sans",
    photoShape: "rounded w-24 h-24",
    sectionNumber: false,
  },
};

export default function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState("personal");
  const [template, setTemplate] = useState("Creative");
  const [photo, setPhoto] = useState(null); 
  const [f, setF] = useState({
    firstName: "",
    lastName: "",
    role: "", 
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
    education: "",
    experience: "",
    skills: "",
    projects: "",
  });

  const tabs = [
    { key: "personal", label: "Personal Info" },
    { key: "experience", label: "Experience" },
    { key: "education", label: "Education" },
    { key: "skills", label: "Skills" },
    { key: "projects", label: "Projects" },
    { key: "preview", label: "Preview" },
  ];

  const templates = ["Modern", "Classic", "Creative", "Minimal"];
  const currentTemplateStyle = templateStyles[template];

  const handleSave = () => {
    localStorage.setItem("resumeData", JSON.stringify(f));
    alert("✅ Resume saved successfully!");
  };

  useEffect(() => {
    const saved = localStorage.getItem("resumeData");
    if (saved) setF(JSON.parse(saved));
  }, []);


  const handleAIAssist = () => {
    const targetRole = f.role || prompt("What is your target job role? (e.g. Frontend Developer)");
    if (!targetRole) return;

    
    if(!f.role) setF({...f, role: targetRole});

    const updated = { ...f, role: targetRole };
    ["summary", "skills", "experience"].forEach((key) => {
      if (!updated[key]) {
        updated[key] = generateAIContent(key, targetRole);
      }
    });
    setF(updated);
    alert(`✨ AI suggestions added for ${targetRole}!`);
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = URL.createObjectURL(e.target.files[0]);
      setPhoto(file);
    }
  };

  const makePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${f.firstName} ${f.lastName}`, 14, 20);
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`${f.role}`, 14, 28); // Shows Role in PDF
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text(`${f.phone} | ${f.email}`, 14, 36);
    doc.text(`${f.linkedin} | ${f.github}`, 14, 42);
    doc.text(`${f.website}`, 14, 48);
    doc.setLineWidth(0.5);
    doc.line(14, 54, 196, 54);
    let y = 62;

    function section(title, text, index = null) {
      if (!text) return;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(`${index !== null ? index + ". " : ""}${title}`, 14, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const splitText = doc.splitTextToSize(text, 180);
      doc.text(splitText, 14, y);
      y += splitText.length * 6 + 4;
    }

    const sections = [
      { key: "summary", title: "Professional Summary" },
      { key: "experience", title: "Experience" },
      { key: "education", title: "Education" },
      { key: "projects", title: "Projects" },
      { key: "skills", title: "Skills" },
    ];

    sections.forEach((sec, i) => {
      section(
        sec.title,
        f[sec.key],
        currentTemplateStyle.sectionNumber ? i + 1 : null
      );
    });

    doc.save("Professional_Resume.pdf");
  };

  const renderInput = (label, placeholder, key, rows = 1) => (
    <div className="flex flex-col">
      <label className="mb-1 font-semibold text-gray-700">{label}</label>
      {rows === 1 ? (
        <input
          type="text"
          placeholder={placeholder}
          value={f[key]}
          onChange={(e) => setF({ ...f, [key]: e.target.value })}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
        />
      ) : (
        <textarea
          rows={rows}
          placeholder={placeholder}
          value={f[key]}
          onChange={(e) => setF({ ...f, [key]: e.target.value })}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition resize-none"
        />
      )}
      {["summary", "skills", "experience"].includes(key) && (
        <button
          onClick={() => {
             const targetRole = f.role || prompt("Target Role? (e.g. Backend Developer)");
             if (targetRole) {
                 setF(prev => ({ ...prev, [key]: generateAIContent(key, targetRole) }));
             }
          }}
          className="mt-2 self-start px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 transition flex items-center gap-1 text-sm"
        >
          <RefreshCcw className="w-4 h-4" /> Generate with AI
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" /> Resume Builder
          </h1>
          <p className="text-gray-500 text-sm">
            Create a professional resume with AI assistance
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAIAssist}
            className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            <Sparkles className="w-4 h-4" /> AI Assist
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            <Save className="w-4 h-4" /> Save
          </button>
          <button
            onClick={makePDF}
            className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 bg-white shadow-lg p-6 border-r overflow-y-auto">
          <h2 className="font-bold text-lg mb-4 text-gray-800">Templates</h2>
          <div className="space-y-3">
            {templates.map((t) => (
              <div
                key={t}
                onClick={() => setTemplate(t)}
                className={`p-4 rounded-lg cursor-pointer border transition shadow-sm ${
                  template === t
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:bg-gray-50 hover:shadow"
                }`}
              >
                <h3 className="font-semibold">{t}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex gap-6 border-b px-6 mt-4 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`pb-2 font-medium transition ${
                  activeTab === t.key
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {activeTab === "preview" ? (
              <div
                className={`p-6 rounded-xl shadow-lg max-w-3xl mx-auto ${currentTemplateStyle.container} ${currentTemplateStyle.font}`}
              >
                {photo && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={photo}
                      alt="Profile"
                      className={`${currentTemplateStyle.photoShape} object-cover`}
                    />
                  </div>
                )}

                <h2 className={`mb-2 ${currentTemplateStyle.title}`}>
                  {f.firstName} {f.lastName}
                </h2>
                <p className="text-lg text-indigo-600 font-medium text-center mb-2">
                  {f.role}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {f.phone} | {f.email} | {f.linkedin} | {f.github} | {f.website}
                </p>

                {f.summary && (
                  <div className="mb-4">
                    <h3 className={`${currentTemplateStyle.sectionTitle} mb-1`}>
                      {currentTemplateStyle.sectionNumber ? "1. " : ""}
                      Professional Summary
                    </h3>
                    <p>{f.summary}</p>
                  </div>
                )}
                {f.experience && (
                  <div className="mb-4">
                    <h3 className={`${currentTemplateStyle.sectionTitle} mb-1`}>
                      {currentTemplateStyle.sectionNumber ? "2. " : ""}Experience
                    </h3>
                    <p>{f.experience}</p>
                  </div>
                )}
                {f.education && (
                  <div className="mb-4">
                    <h3 className={`${currentTemplateStyle.sectionTitle} mb-1`}>
                      {currentTemplateStyle.sectionNumber ? "3. " : ""}Education
                    </h3>
                    <p>{f.education}</p>
                  </div>
                )}
                {f.projects && (
                  <div className="mb-4">
                    <h3 className={`${currentTemplateStyle.sectionTitle} mb-1`}>
                      {currentTemplateStyle.sectionNumber ? "4. " : ""}Projects
                    </h3>
                    <p>{f.projects}</p>
                  </div>
                )}
                {f.skills && (
                  <div className="mb-4">
                    <h3 className={`${currentTemplateStyle.sectionTitle} mb-1`}>
                      {currentTemplateStyle.sectionNumber ? "5. " : ""}Skills
                    </h3>
                    <p>{f.skills}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTab === "personal" && (
                  <>
                    {renderInput("First Name", "John", "firstName")}
                    {renderInput("Last Name", "Doe", "lastName")}
                    
                    {/* --- NEW ROLE FIELD --- */}
                    {renderInput("Target Job Title (For AI)", "e.g. React Developer", "role")}
                    
                    {renderInput("Email", "john.doe@example.com", "email")}
                    {renderInput("Phone", "+1 234 567 890", "phone")}
                    {renderInput("Location", "New York, USA", "location")}
                    {renderInput("Website", "https://johndoe.com", "website")}
                    {renderInput("LinkedIn", "linkedin.com/in/johndoe", "linkedin")}
                    {renderInput("GitHub", "github.com/johndoe", "github")}
                    
                    <div className="mt-4">
                      <label className="mb-1 font-semibold text-gray-700">
                        Profile Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                      />
                    </div>
                    
                    {renderInput(
                      "Professional Summary",
                      "E.g., Software developer with 5 years experience...",
                      "summary",
                      5
                    )}
                  </>
                )}
                {activeTab === "experience" &&
                  renderInput(
                    "Work Experience",
                    "E.g., Software Engineer at ABC Corp (2018-2023)...",
                    "experience",
                    5
                  )}
                {activeTab === "education" &&
                  renderInput(
                    "Education",
                    "E.g., B.Tech in Computer Science, XYZ University, 2014-2018",
                    "education",
                    5
                  )}
                {activeTab === "skills" &&
                  renderInput(
                    "Skills",
                    "E.g., JavaScript, React, Node.js, Communication, Teamwork",
                    "skills",
                    4
                  )}
                {activeTab === "projects" &&
                  renderInput(
                    "Projects",
                    "E.g., Portfolio website, E-commerce app, AI Chatbot",
                    "projects",
                    4
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}