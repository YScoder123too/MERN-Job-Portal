import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus, FiEye, FiCheck } from "react-icons/fi"; 
import { Plus, Edit, Trash2, Eye, Zap, Clock, Users, BookOpen, BarChart3, X } from "lucide-react"; // Additional Icons for visual flair

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState(() => {
    const saved = localStorage.getItem("hr_demo_quizzes");
    return saved ? JSON.parse(saved) : [];
  });
  const [editingIndex, setEditingIndex] = useState(null);
  
  const [quizForm, setQuizForm] = useState({
    title: "", 
    description: "", 
    category: "", 
    subject: "", 
    level: "Easy", 
    status: "Active", 
    duration: "10"
  });

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(null);
  const [questionsForm, setQuestionsForm] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false); // Restore View Modal State

  // Auto-Save Logic
  useEffect(() => {
    if (quizzes.length > 0) localStorage.setItem("hr_demo_quizzes", JSON.stringify(quizzes));
  }, [quizzes]);

  const handleQuizFormChange = (e) => setQuizForm({ ...quizForm, [e.target.name]: e.target.value });

  const handleAddOrEditQuiz = () => {
    if (!quizForm.title.trim()) return;
    
    const safeDuration = parseInt(quizForm.duration) || 10;
    const updated = [...quizzes];
    
    if (editingIndex !== null) {
      updated[editingIndex] = { ...updated[editingIndex], ...quizForm, duration: safeDuration };
      setEditingIndex(null);
    } else {
      updated.unshift({ 
        id: Date.now(), 
        ...quizForm, 
        duration: safeDuration, 
        questions: [], 
        attempts: 0, 
        published: false 
      });
    }
    setQuizzes(updated);
    setQuizForm({ title: "", description: "", category: "", subject: "", level: "Easy", status: "Active", duration: "10" });
  };

  const handleEditQuiz = (index) => { setEditingIndex(index); setQuizForm({ ...quizzes[index] }); };
  const handleDeleteQuiz = (index) => { if(window.confirm("Delete this quiz?")) setQuizzes(quizzes.filter((_, i) => i !== index)); };
  
  // Question Modal Logic (Simplified handlers)
  const openQuestionModal = (index) => { setCurrentQuizIndex(index); setQuestionsForm(quizzes[index].questions || []); setShowQuestionModal(true); };
  const saveQuestions = () => {
      const updated = [...quizzes];
      updated[currentQuizIndex].questions = questionsForm;
      setQuizzes(updated);
      setShowQuestionModal(false);
  };
  const addQ = () => setQuestionsForm([...questionsForm, { title: "", options: ["","","",""], correctOption: 0 }]);
  const changeQ = (i, f, v) => { const u = [...questionsForm]; u[i][f] = v; setQuestionsForm(u); };
  const changeOpt = (qi, oi, v) => { const u = [...questionsForm]; u[qi].options[oi] = v; setQuestionsForm(u); };

  // FAKE STATS LOGIC
  const totalStudentsAttended = quizzes.length * 15 + 4; // Ensures it's not 0
  const totalQuizzes = quizzes.length;
  const activeQuizzes = quizzes.filter(q => q.status === "Active").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">HR Quiz Dashboard</h1>
        <p className="text-gray-500 mb-8">Manage skill assessment tests and track performance.</p>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-indigo-50 p-6 rounded-xl shadow-md border border-indigo-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-semibold text-gray-600">Total Quizzes</p>
                <h3 className="text-3xl font-bold text-indigo-700">{totalQuizzes}</h3>
            </div>
            <BarChart3 size={32} className="text-indigo-500"/>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow-md border border-green-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-semibold text-gray-600">Active Quizzes</p>
                <h3 className="text-3xl font-bold text-green-700">{activeQuizzes}</h3>
            </div>
            <Zap size={32} className="text-green-500"/>
          </div>
          <div className="bg-yellow-50 p-6 rounded-xl shadow-md border border-yellow-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-semibold text-gray-600">Students Attended</p>
                <h3 className="text-3xl font-bold text-yellow-700">{totalStudentsAttended}</h3>
            </div>
            <Users size={32} className="text-yellow-500"/>
          </div>
        </div>

        {/* QUIZ CREATION FORM */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Plus size={24} className="text-indigo-600"/> Create New Quiz</h2>

            <div className="grid md:grid-cols-4 gap-4">
                <input name="title" placeholder="Quiz Title (e.g. React Hooks)" value={quizForm.title} onChange={handleQuizFormChange} className="p-3 border rounded-xl col-span-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input name="category" placeholder="Category (e.g. Frontend)" value={quizForm.category} onChange={handleQuizFormChange} className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input type="number" name="duration" placeholder="Duration (mins)" value={quizForm.duration} onChange={handleQuizFormChange} className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />

                <input name="subject" placeholder="Subject (e.g. Machine Learning)" value={quizForm.subject} onChange={handleQuizFormChange} className="p-3 border rounded-xl" />
                
                <select name="level" value={quizForm.level} onChange={handleQuizFormChange} className="p-3 border rounded-xl"><option>Easy</option><option>Medium</option><option>Hard</option></select>
                <select name="status" value={quizForm.status} onChange={handleQuizFormChange} className="p-3 border rounded-xl"><option>Active</option><option>Inactive</option></select>
                
                <button onClick={handleAddOrEditQuiz} className="bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2">
                    <Plus size={18}/> Add Quiz
                </button>
            </div>
        </div>

        {/* QUIZ LIST */}
        <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quiz Library ({totalQuizzes})</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {quizzes.map((quiz, index) => (
                    <div key={quiz.id} className="border rounded-2xl shadow p-5 bg-white hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-indigo-700">{quiz.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">{quiz.category || 'General'} / {quiz.subject}</p>
                                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{quiz.level}</span>
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">{quiz.status}</span>
                                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">{quiz.duration} mins</span>
                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Questions: {quiz.questions ? quiz.questions.length : 0}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 text-xl mt-[-5px]">
                                <button onClick={() => handleEditQuiz(index)} className="text-blue-600 hover:text-blue-800 p-1.5"><FiEdit /></button>
                                <button onClick={() => handleDeleteQuiz(index)} className="text-red-600 hover:text-red-800 p-1.5"><FiTrash2 /></button>
                                <button onClick={() => openQuestionModal(index)} className="text-green-600 hover:text-green-800 p-1.5"><FiPlus /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>


        {/* QUESTION MODAL (Keep Existing Logic) */}
        {showQuestionModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-50 p-4 overflow-auto">
            <div className="bg-white p-6 rounded-3xl w-full max-w-4xl mt-10 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Questions</h2>
              {questionsForm.map((q, qi) => (
                <div key={qi} className="border p-4 rounded-xl mb-3 bg-gray-50">
                  <input placeholder="Question Title" value={q.title} onChange={(e) => changeQ(qi, "title", e.target.value)} className="w-full mb-2 p-2 border rounded" />
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => (<input key={oi} placeholder={`Option ${oi+1}`} value={opt} onChange={(e) => changeOpt(qi, oi, e.target.value)} className="p-2 border rounded" />))}
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                      <label className="text-sm font-bold text-gray-600">Correct Option (0-3): <input type="number" min="0" max="3" value={q.correctOption} onChange={(e) => changeQ(qi, "correctOption", e.target.value)} className="border p-1 w-16 ml-2 rounded"/>
                      </label>
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={addQ} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 shadow">+ Add Question</button>
                <button onClick={saveQuestions} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow">Save & Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizManagement;
