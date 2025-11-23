import React, { useState } from "react";
import { User, Mail, Phone, Edit3, Camera, BookOpen } from "lucide-react";

const TeacherProfile: React.FC = () => {
  const [teacher, setTeacher] = useState({
    firstName: "Tesfaye",
    lastName: "Bekele",
    email: "tesfaye@school.com",
    phone: "+251 912 345 678",
    grade: "Grade 12",
    subject: "Mathematics",
    photo: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(teacher);

  // For profile image upload (local only)
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTeacher((prev) => ({ ...prev, photo: imageUrl }));
    }
  };

  // Handle edit
  const handleSave = () => {
    setTeacher(tempData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mt-10 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-400 flex items-center gap-3">
          <User size={30} /> Teacher Profile
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow"
        >
          <Edit3 size={18} /> Edit
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative w-32 h-32 mb-4">
          <img
            src={
              teacher.photo ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-purple-400 shadow-md"
          />
          <label
            htmlFor="photoUpload"
            className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition"
          >
            <Camera size={16} />
          </label>
          <input
            type="file"
            id="photoUpload"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          {teacher.firstName} {teacher.lastName}
        </h3>
        <p className="text-gray-500">{teacher.subject} Teacher</p>
      </div>

      {/* Info Section */}
      <div className="space-y-4 text-gray-700 dark:text-gray-300 text-lg">
        <p className="flex items-center gap-3">
          <Mail size={20} className="text-purple-600" /> {teacher.email}
        </p>
        <p className="flex items-center gap-3">
          <Phone size={20} className="text-purple-600" /> {teacher.phone}
        </p>
        <p className="flex items-center gap-3">
          <BookOpen size={20} className="text-purple-600" /> Teaching:{" "}
          <span className="font-semibold">{teacher.subject}</span>
        </p>
        <p className="flex items-center gap-3">
          <User size={20} className="text-purple-600" /> {teacher.grade}
        </p>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-[90%] max-w-lg animate-fadeIn">
            <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-4">
              Edit Profile
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="First Name"
                value={tempData.firstName}
                onChange={(e) =>
                  setTempData({ ...tempData, firstName: e.target.value })
                }
                className="border rounded-xl px-3 py-2 bg-transparent border-gray-300 dark:border-gray-700"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={tempData.lastName}
                onChange={(e) =>
                  setTempData({ ...tempData, lastName: e.target.value })
                }
                className="border rounded-xl px-3 py-2 bg-transparent border-gray-300 dark:border-gray-700"
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={tempData.email}
              onChange={(e) =>
                setTempData({ ...tempData, email: e.target.value })
              }
              className="w-full border rounded-xl px-3 py-2 mb-4 bg-transparent border-gray-300 dark:border-gray-700"
            />
            <input
              type="text"
              placeholder="Phone"
              value={tempData.phone}
              onChange={(e) =>
                setTempData({ ...tempData, phone: e.target.value })
              }
              className="w-full border rounded-xl px-3 py-2 mb-4 bg-transparent border-gray-300 dark:border-gray-700"
            />
            <input
              type="text"
              placeholder="Subject"
              value={tempData.subject}
              onChange={(e) =>
                setTempData({ ...tempData, subject: e.target.value })
              }
              className="w-full border rounded-xl px-3 py-2 mb-4 bg-transparent border-gray-300 dark:border-gray-700"
            />
            <input
              type="text"
              placeholder="Grade"
              value={tempData.grade}
              onChange={(e) =>
                setTempData({ ...tempData, grade: e.target.value })
              }
              className="w-full border rounded-xl px-3 py-2 mb-6 bg-transparent border-gray-300 dark:border-gray-700"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-all shadow"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
