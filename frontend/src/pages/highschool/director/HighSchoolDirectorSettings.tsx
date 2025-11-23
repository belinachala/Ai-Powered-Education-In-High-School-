// HighSchoolDirectorSettings.tsx
import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';

const HighSchoolDirectorSettings: React.FC = () => {
  // School info
  const [schoolName, setSchoolName] = useState('High School ABC');
  const [address, setAddress] = useState('123 Main St, City');
  const [phone, setPhone] = useState('0911000000');
  const [email, setEmail] = useState('admin@schoolabc.com');

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification settings
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);

  // Save school info
  const saveSchoolInfo = () => {
    if (!schoolName || !address || !phone || !email) return alert('Fill all school info fields');
    alert(`School information updated:\nName: ${schoolName}\nAddress: ${address}\nPhone: ${phone}\nEmail: ${email}`);
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

  // Save notification settings
  const saveNotificationSettings = () => {
    alert(`Notification settings updated:\nEmail: ${notifyEmail ? 'Enabled' : 'Disabled'}\nSMS: ${notifySMS ? 'Enabled' : 'Disabled'}`);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h3 className="text-3xl font-bold text-gray-800">System Settings</h3>

      {/* School Info */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h4 className="text-xl font-semibold">School Information</h4>
        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
          <input
            type="text"
            placeholder="School Name"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={schoolName}
            onChange={e => setSchoolName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <button
          onClick={saveSchoolInfo}
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition flex items-center"
        >
          <FaSave className="mr-2" /> Save School Info
        </button>
      </div>

      {/* Password Change */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h4 className="text-xl font-semibold">Change Password</h4>
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
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition flex items-center"
        >
          <FaSave className="mr-2" /> Change Password
        </button>
      </div>

      {/* Notification Settings */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h4 className="text-xl font-semibold">Notification Settings</h4>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={e => setNotifyEmail(e.target.checked)}
              className="w-4 h-4"
            />
            Enable Email Notifications
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifySMS}
              onChange={e => setNotifySMS(e.target.checked)}
              className="w-4 h-4"
            />
            Enable SMS Notifications
          </label>
        </div>
        <button
          onClick={saveNotificationSettings}
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition flex items-center"
        >
          <FaSave className="mr-2" /> Save Notification Settings
        </button>
      </div>
    </div>
  );
};

export default HighSchoolDirectorSettings;
