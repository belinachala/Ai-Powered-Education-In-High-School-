// HighSchoolDirectorProfile.tsx
import React, { useState } from 'react';
import { FaCamera, FaSave, FaKey } from 'react-icons/fa';

const HighSchoolDirectorProfile: React.FC = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('director@schoolabc.com');
  const [phone, setPhone] = useState('0911000000');
  const [avatar, setAvatar] = useState<string | null>(null);

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Save profile info
  const saveProfile = () => {
    if (!name || !email || !phone) return alert('Fill all fields');
    alert(`Profile updated:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}`);
  };

  // Change password
  const changePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) return alert('Fill all password fields');
    if (newPassword !== confirmPassword) return alert('New passwords do not match');
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h3 className="text-3xl font-bold text-gray-800">Setup Yor Profile</h3>

      {/* Profile Info */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-600">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-3xl">
                JD
              </div>
            )}
          </div>
          <label className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition flex items-center gap-2">
            <FaCamera /> Upload Avatar
            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </label>
        </div>
        <div className="flex-1 space-y-4 w-full">
          <input
            type="text"
            placeholder="Full Name"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <button
            onClick={saveProfile}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition flex items-center gap-2"
          >
            <FaSave /> Save Profile
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h4 className="text-xl font-semibold flex items-center gap-2">
          <FaKey /> Change Password
        </h4>
        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
          <input
            type="password"
            placeholder="Current Password"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          onClick={changePassword}
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition flex items-center gap-2"
        >
          <FaSave /> Change Password
        </button>
      </div>
    </div>
  );
};

export default HighSchoolDirectorProfile;
