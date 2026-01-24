import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

interface Student {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  student_id: string;
  gender: string;
  date_of_birth: string;
  school_name: string;
  region: string;
  zone: string;
  subcity: string;
  woreda: string;
  grade_levels: string;
  profile_picture_url: string | null;
}

const BACKEND_URL = "http://127.0.0.1:8000";
const SCHOOL_LOGO = "/assets/rvu-logo.png";

const HighSchoolDirectorStudents: React.FC = () => {
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);

    axios
      .get(`${BACKEND_URL}/directors/students`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.students || res.data || [];
        const updated = data.map((s: Student) => ({
          ...s,
          profile_picture_url: s.profile_picture_url
            ? `${BACKEND_URL}/${s.profile_picture_url}`
            : "",
        }));
        setStudents(updated);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.detail || "Failed to load students");
        setLoading(false);
      });
  }, [token]);

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.username.toLowerCase().includes(q) ||
      s.student_id?.toLowerCase().includes(q) ||
      s.first_name.toLowerCase().includes(q) ||
      s.last_name.toLowerCase().includes(q)
    );
  });

  /* ================= PDF DOWNLOAD ================= */
  const downloadPDF = async (student: Student) => {
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
      if (student.profile_picture_url)
        profileImg = await toBase64(student.profile_picture_url);
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
    doc.text(student.school_name, 105, 30, { align: "center" });

    doc.setFillColor(0, 102, 204);
    doc.rect(10, 38, 190, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("Official Student Profile", 105, 46, { align: "center" });

    /* Profile image */
    if (profileImg) doc.addImage(profileImg, "JPEG", 150, 60, 40, 40);

    /* Info */
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    let y = 65;

    const rows = [
      ["Full Name", `${student.first_name} ${student.last_name}`],
      ["Username", student.username],
      ["Student ID", student.student_id],
      ["Email", student.email],
      ["Phone", student.phone_number],
      ["Gender", student.gender],
      ["Date of Birth", student.date_of_birth],
      ["Region", student.region],
      ["Zone", student.zone],
      ["Subcity", student.subcity],
      ["Woreda", student.woreda],
      ["Grade Level", student.grade_levels],
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

    doc.save(`${student.username}_profile.pdf`);
  };

  /* ================= UI ================= */
  return (
    <div className="p-2 bg-gray-100 min-h-screen"> 
      {/* Search */}
      <div className="max-w-md mx-auto mb-6">
        <input
          placeholder="Search by username, student ID, name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg shadow border focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-center">Loading students...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((s) => (
            <div
              key={s.id}
              className="bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition flex flex-col items-center"
            >
              <img
                src={s.profile_picture_url || "/assets/default-avatar.png"}
                className="w-42 h-42 object-cover border-4 border-blue-500 rounded-xl mb-3"
              />

              <h5 className="text-xl font-bold text-blue-700">
                {s.first_name} {s.last_name}
              </h5>
              <h5 className="text-sm text-gray-600">Grade: {s.grade_levels} Student</h5>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedStudent(s)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                >
                  View
                </button>
                <button
                  onClick={() => downloadPDF(s)}
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
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-2xl"
              onClick={() => setSelectedStudent(null)}
            >
              &times;
            </button>

            <div className="flex items-center gap-3 mb-2">
              <img src={SCHOOL_LOGO} className="w-12 h-12" />
              <p className="font-semibold text-gray-500">EduTena Website</p>
            </div>

            <h3 className="text-xl font-bold text-center text-blue-800">
              {selectedStudent.school_name}
            </h3>

            <img
              src={selectedStudent.profile_picture_url || "/assets/default-avatar.png"}
              className="w-36 h-36 mx-auto border-4 border-blue-500 rounded-xl my-4"
            />

            <h4 className="text-center font-bold text-lg">
              {selectedStudent.first_name} {selectedStudent.last_name}
            </h4>

            <div className="grid grid-cols-2 gap-3 text-sm mt-4">
              <p><b>Username:</b> {selectedStudent.username}</p>
              <p><b>Student ID:</b> {selectedStudent.student_id}</p>
              <p><b>Email:</b> {selectedStudent.email}</p>
              <p><b>Phone:</b> {selectedStudent.phone_number}</p>
              <p><b>Gender:</b> {selectedStudent.gender}</p>
              <p><b>DOB:</b> {selectedStudent.date_of_birth}</p>
              <p><b>Region:</b> {selectedStudent.region}</p>
              <p><b>Zone:</b> {selectedStudent.zone}</p>
              <p><b>Subcity:</b> {selectedStudent.subcity}</p>
              <p><b>Woreda:</b> {selectedStudent.woreda}</p>
              <p className="col-span-2 text-center">
                <span className="bg-yellow-200 px-3 py-1 rounded-full">
                  Grade {selectedStudent.grade_levels}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HighSchoolDirectorStudents;
