import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash, User, Image as ImageIcon } from "lucide-react";

const initialCourses = [
  {
    id: 1,
    title: "React for Beginners",
    instructor: "John Doe",
    price: "Free",
    duration: "4 Weeks",
    description: "Learn the basics of React hooks and components.",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    status: "Published"
  }
];

const CourseManagement = () => {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("hr_courses");
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "", instructor: "", price: "", duration: "", image: "", description: "", status: "Draft"
  });

  useEffect(() => {
    localStorage.setItem("hr_courses", JSON.stringify(courses));
  }, [courses]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const finalImage = formData.image.trim() || "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

    const payload = { ...formData, image: finalImage };

    if (editingId) {
        setCourses(courses.map(c => c.id === editingId ? { ...payload, id: editingId } : c));
    } else {
        setCourses([{ ...payload, id: Date.now() }, ...courses]);
    }
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: "", instructor: "", price: "", duration: "", image: "", description: "", status: "Draft" });
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setFormData(course);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this course?")) {
        setCourses(courses.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
        <button 
          onClick={() => { setEditingId(null); setFormData({title:"", instructor:"", price:"", duration:"", image:"", description: "", status:"Draft"}); setShowModal(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 shadow-md"
        >
          <Plus size={20} /> Add Course
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition">
            <div className="h-32 bg-gray-200 relative flex items-center justify-center overflow-hidden">
                <img 
                  src={course.image} 
                  className="w-full h-full object-cover" 
                  alt="course" 
                  onError={(e) => e.target.src = "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                />
                <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${course.status === "Published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {course.status}
                </span>
            </div>
            <div className="p-5">
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-4 flex items-center gap-1"><User size={14}/> {course.instructor}</p>
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{course.description || "No description provided."}</p>
                
                <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-4">
                    {/* REMOVED DOLLAR SIGN ICON */}
                    <span className="font-bold text-indigo-600">{course.price || "Free"}</span>
                    <span>{course.duration}</span>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => handleEdit(course)} className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded hover:bg-indigo-100">Edit</button>
                    <button onClick={() => handleDelete(course.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded hover:bg-red-100">Delete</button>
                </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">{editingId ? "Edit Course" : "Add New Course"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Course Title" className="w-full p-2 border rounded" required />
                <input name="instructor" value={formData.instructor} onChange={handleChange} placeholder="Instructor Name" className="w-full p-2 border rounded" required />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Course Description..." rows={3} className="w-full p-2 border rounded resize-none" />
                
                <div className="flex gap-3">
                    <input name="price" value={formData.price} onChange={handleChange} placeholder="Price (e.g. ₹5000)" className="w-full p-2 border rounded" />
                    <input name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration" className="w-full p-2 border rounded" />
                </div>
                <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL (Leave empty for default)" className="w-full p-2 border rounded" />
                
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                    <option>Draft</option>
                    <option>Published</option>
                </select>

                <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 py-2 rounded hover:bg-gray-200 transition">Cancel</button>
                    <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">Save</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;