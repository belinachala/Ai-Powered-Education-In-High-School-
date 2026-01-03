import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

interface Teacher {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  teacher_id: string;
  gender: string;
  date_of_birth: string;
  school_name: string;
  region: string;
  zone: string;
  subcity: string;
  woreda: string;
  years_of_experience: number;
  subjects_taught: string[];
  grade_levels: string[];
  profile_picture_url: string | null;
}

const BACKEND_URL = "http://127.0.0.1:8000";
const SCHOOL_LOGO = "/assets/rvu-logo.png";

const HighSchoolDirectorTeachers: React.FC = () => {
  const token = localStorage.getItem("token");

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);

    axios
      .get(`${BACKEND_URL}/directors/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.teachers || res.data || [];
        const updated = data.map((t: Teacher) => ({
          ...t,
          profile_picture_url: t.profile_picture_url
            ? `${BACKEND_URL}/${t.profile_picture_url}`
            : "",
        }));
        setTeachers(updated);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.detail || "Failed to load teachers");
        setLoading(false);
      });
  }, [token]);

  const filteredTeachers = teachers.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.username.toLowerCase().includes(q) ||
      t.teacher_id.toLowerCase().includes(q) ||
      t.first_name.toLowerCase().includes(q) ||
      t.last_name.toLowerCase().includes(q)
    );
  });

  /* ================= PDF DOWNLOAD ================= */
  const downloadPDF = async (teacher: Teacher) => {
    const doc = new jsPDF("p", "mm", "a4");

    const toBase64 = async (url: string) => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    };

    let profileImg = "";
    let logoImg = "";

    try {
      if (teacher.profile_picture_url)
        profileImg = await toBase64(teacher.profile_picture_url);
      logoImg = await toBase64(SCHOOL_LOGO);
    } catch {}

    /* Border */
    doc.setLineWidth(1.5);
    doc.rect(10, 10, 190, 277);

    /* Header */
    if (logoImg) doc.addImage(logoImg, "PNG", 15, 15, 25, 25);

    doc.setFontSize(10);
    doc.text("EduTena Website", 160, 22);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(teacher.school_name, 105, 30, { align: "center" });

    doc.setFillColor(0, 102, 204);
    doc.rect(10, 38, 190, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("Official Teacher Profile", 105, 46, { align: "center" });

    /* Profile Image */
    if (profileImg) doc.addImage(profileImg, "JPEG", 150, 60, 40, 40);

    /* Info */
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    let y = 65;

    const rows = [
      ["Full Name", `${teacher.first_name} ${teacher.last_name}`],
      ["Username", teacher.username],
      ["Teacher ID", teacher.teacher_id],
      ["Email", teacher.email],
      ["Phone", teacher.phone_number],
      ["Gender", teacher.gender],
      ["Date of Birth", teacher.date_of_birth],
      ["Region", teacher.region],
      ["Zone", teacher.zone],
      ["Subcity", teacher.subcity],
      ["Woreda", teacher.woreda],
      ["Experience", `${teacher.years_of_experience} years`],
      ["Subjects", teacher.subjects_taught.join(", ") || "N/A"],
      ["Grades", teacher.grade_levels.join(", ") || "N/A"],
    ];

    rows.forEach(([label, value], i) => {
      if (i % 2 === 0) {
        doc.setFillColor(230, 230, 250);
        doc.rect(15, y - 6, 170, 9, "F");
      }
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(value), 80, y);
      y += 10;
    });

    doc.save(`${teacher.username}_profile.pdf`);
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        Teachers Management
      </h2>

      {/* Search */}
      <div className="max-w-md mx-auto mb-6">
        <input
          placeholder="Search by username, teacher ID, name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg shadow border focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-center">Loading teachers...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((t) => (
            <div
              key={t.id}
              className="bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition flex flex-col items-center"
            >
              <img
                src={t.profile_picture_url || "/assets/default-avatar.png"}
                className="w-32 h-32 object-cover border-4 border-blue-500 rounded-xl mb-3"
              />

              <h3 className="text-xl font-bold text-blue-700">
                {t.first_name} {t.last_name}
              </h3>
              <p className="text-sm text-gray-600">ID: {t.teacher_id}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedTeacher(t)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                >
                  View
                </button>
                <button
                  onClick={() => downloadPDF(t)}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg"
                >
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= VIEW MODAL ================= */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-2xl"
              onClick={() => setSelectedTeacher(null)}
            >
              &times;
            </button>

            <div className="flex items-center gap-3 mb-2">
              <img src={SCHOOL_LOGO} className="w-10 h-10" />
              <p className="font-semibold text-gray-500">EduTena Website</p>
            </div>

            <h3 className="text-xl font-bold text-center text-blue-800">
              {selectedTeacher.school_name}
            </h3>

            <img
              src={
                selectedTeacher.profile_picture_url ||
                "/assets/default-avatar.png"
              }
              className="w-36 h-36 mx-auto border-4 border-blue-500 rounded-xl my-4"
            />

            <h4 className="text-center font-bold text-lg">
              {selectedTeacher.first_name} {selectedTeacher.last_name}
            </h4>

            <div className="grid grid-cols-2 gap-3 text-sm mt-4">
              <p><b>Username:</b> {selectedTeacher.username}</p>
              <p><b>Teacher ID:</b> {selectedTeacher.teacher_id}</p>
              <p><b>Email:</b> {selectedTeacher.email}</p>
              <p><b>Phone:</b> {selectedTeacher.phone_number}</p>
              <p><b>Gender:</b> {selectedTeacher.gender}</p>
              <p><b>DOB:</b> {selectedTeacher.date_of_birth}</p>
              <p><b>Region:</b> {selectedTeacher.region}</p>
              <p><b>Zone:</b> {selectedTeacher.zone}</p>
              <p><b>Subcity:</b> {selectedTeacher.subcity}</p>
              <p><b>Woreda:</b> {selectedTeacher.woreda}</p>
              <p className="col-span-2 text-center">
                <span className="bg-yellow-200 px-3 py-1 rounded-full">
                  Experience: {selectedTeacher.years_of_experience} years
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HighSchoolDirectorTeachers;
