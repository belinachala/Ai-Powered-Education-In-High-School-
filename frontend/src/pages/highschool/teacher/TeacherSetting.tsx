import React, { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaBell,
  FaMoon,
  FaSun,
  FaLock,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";

const TeacherSetting: React.FC = () => {
  const [firstName, setFirstName] = useState("Samuel");
  const [lastName, setLastName] = useState("Getachew");
  const [email, setEmail] = useState("samuel.getachew@school.edu");
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);

  // Apply theme instantly
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleSave = () => {
    setError("");

    // Simulate validations
    if (newPassword && newPassword !== confirmPassword) {
      setError("❌ New passwords do not match!");
      return;
    }

    if (newPassword && currentPassword === newPassword) {
      setError("⚠️ New password must be different from current password.");
      return;
    }

    // Simulate loading state
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("✅ Settings saved successfully!");
    }, 1500);
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    setEmailConfirmationSent(true);
    setTimeout(() => {
      setEmailConfirmationSent(false);
    }, 5000); // Reset message after 5s
  };

  const handleCancel = () => {
    alert("❌ Changes discarded.");
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center p-6 transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white"
          : "bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 text-gray-800"
      }`}
    >
      <div
        className={`rounded-3xl shadow-2xl p-8 w-full max-w-3xl transform transition-all hover:scale-[1.01] ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <h2 className="text-3xl font-extrabold text-center text-purple-700 dark:text-purple-400 mb-8">
          Teacher Settings
        </h2>

        {/* Profile Section */}
        <div className="flex items-center gap-6 mb-8">
          <FaUserCircle
            className="text-purple-700 dark:text-purple-400"
            size={80}
          />
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-transparent"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-transparent"
              />
              {emailConfirmationSent && (
                <p className="text-green-500 text-sm mt-2 flex items-center gap-2 animate-pulse">
                  <FaCheckCircle /> Confirmation email sent to {email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FaLock className="text-purple-600 dark:text-purple-400" />
            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Change Password
            </label>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-transparent"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-transparent"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-transparent"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2 font-medium animate-pulse">
              {error}
            </p>
          )}
        </div>

        {/* Notification Preferences */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FaBell className="text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Notification Preferences
            </h3>
          </div>
          <div className="flex flex-col gap-2 pl-8">
            {Object.keys(notifications).map((key) => (
              <label
                key={key}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
              >
                <input
                  type="checkbox"
                  checked={notifications[key as keyof typeof notifications]}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [key]: e.target.checked,
                    })
                  }
                  className="accent-purple-600"
                />
                {key === "email" && <FaEnvelope />}
                {key === "sms" && <span>📱</span>}
                {key === "push" && <span>💬</span>}
                <span className="capitalize">{key} Notifications</span>
              </label>
            ))}
          </div>
        </div>

        {/* Theme Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            {theme === "dark" ? (
              <FaMoon className="text-purple-500" />
            ) : (
              <FaSun className="text-yellow-400" />
            )}
            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Theme Mode
            </label>
          </div>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-transparent"
          >
            <option value="light">🌞 Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="system">💻 System Default</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={handleCancel}
            className="px-6 py-2 rounded-xl font-semibold border border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-gray-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`px-6 py-2 rounded-xl font-semibold bg-purple-700 text-white hover:bg-purple-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 ${
              isLoading && "opacity-70 cursor-wait"
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" /> Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherSetting;
