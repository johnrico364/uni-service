"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeSection, setActiveSection] = useState<"user" | "notification" | "account">("user");

  // User & Provider Management
  const [autoApproveProviders, setAutoApproveProviders] = useState(false);
  const [defaultUserStatus, setDefaultUserStatus] = useState("Active");

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Admin Account Settings
  const [adminName, setAdminName] = useState("John Administrator");
  const [adminEmail, setAdminEmail] = useState("admin@example.com");

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSuccessMessage("");
    
    setTimeout(() => {
      setSuccessMessage("Settings saved successfully!");
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 800);
  };

  const handleRestoreDefaults = () => {
    if (confirm("Are you sure you want to restore all settings to defaults?")) {
      setAutoApproveProviders(false);
      setDefaultUserStatus("Active");
      setEmailNotifications(true);
      setSmsNotifications(false);
      setAdminName("John Administrator");
      setAdminEmail("admin@example.com");
      setSuccessMessage("Settings restored to defaults!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleCancel = () => {
    if (confirm("Discard changes?")) {
      window.location.reload();
    }
  };

  return (
    <div className="overflow-auto text-[12px] h-full pb-5">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-primary-content/80 text-sm">Manage your system configuration and preferences</p>
      </div>

      {/* Main Content */}
      <div className="px-6 max-w-7xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 alert alert-success shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Settings Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User & Provider Management Card */}
          <div
            onClick={() => setActiveSection("user")}
            className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${
              activeSection === "user"
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-base-300 bg-base-100 hover:border-primary hover:shadow-md"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">👥</div>
              <div className="flex-1">
                <h3 className="font-bold text-base mb-1">User & Provider Management</h3>
                <p className="text-gray-600 text-[11px]">
                  Control user registration and provider approval settings
                </p>
              </div>
            </div>
          </div>

          {/* Notification Settings Card */}
          <div
            onClick={() => setActiveSection("notification")}
            className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${
              activeSection === "notification"
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-base-300 bg-base-100 hover:border-primary hover:shadow-md"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔔</div>
              <div className="flex-1">
                <h3 className="font-bold text-base mb-1">Notification Settings</h3>
                <p className="text-gray-600 text-[11px]">
                  Configure email and SMS notification preferences
                </p>
              </div>
            </div>
          </div>

          {/* Admin Account Settings Card */}
          <div
            onClick={() => setActiveSection("account")}
            className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${
              activeSection === "account"
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-base-300 bg-base-100 hover:border-primary hover:shadow-md"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔐</div>
              <div className="flex-1">
                <h3 className="font-bold text-base mb-1">Admin Account</h3>
                <p className="text-gray-600 text-[11px]">
                  Manage your account information and security
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="bg-base-100 border border-base-300 rounded-xl p-6 shadow-lg mb-8">
          {/* USER & PROVIDER MANAGEMENT Section */}
          {activeSection === "user" && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">👥</div>
                <h2 className="text-xl font-bold">User & Provider Management</h2>
              </div>

              {/* Auto-Approve Service Providers */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm mb-1">Auto-Approve Service Providers</h3>
                    <p className="text-gray-600 text-[11px]">
                      When enabled, new service providers will be automatically approved without manual review
                    </p>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-3">
                      <input
                        type="checkbox"
                        checked={autoApproveProviders}
                        onChange={(e) => setAutoApproveProviders(e.target.checked)}
                        className="toggle toggle-primary toggle-sm"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Default User Status */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-50 border border-purple-200 rounded-lg p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1">Default User Status</h3>
                    <p className="text-gray-600 text-[11px]">
                      Choose the initial status for newly registered users
                    </p>
                  </div>
                  <select
                    value={defaultUserStatus}
                    onChange={(e) => setDefaultUserStatus(e.target.value)}
                    className="select select-bordered select-sm w-40 text-sm"
                  >
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATION SETTINGS Section */}
          {activeSection === "notification" && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">🔔</div>
                <h2 className="text-xl font-bold">Notification Settings</h2>
              </div>

              {/* Email Notifications */}
              <div className="bg-gradient-to-r from-green-50 to-green-50 border border-green-200 rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm mb-1">Email Notifications</h3>
                    <p className="text-gray-600 text-[11px]">
                      Receive email alerts for important system events and user activities
                    </p>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-3">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="toggle toggle-primary toggle-sm"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* SMS Notifications */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-50 border border-orange-200 rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm mb-1">SMS Notifications</h3>
                    <p className="text-gray-600 text-[11px]">
                      Get SMS alerts for critical system issues and security incidents
                    </p>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-3">
                      <input
                        type="checkbox"
                        checked={smsNotifications}
                        onChange={(e) => setSmsNotifications(e.target.checked)}
                        className="toggle toggle-primary toggle-sm"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN ACCOUNT SETTINGS Section */}
          {activeSection === "account" && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">🔐</div>
                <h2 className="text-xl font-bold">Admin Account Settings</h2>
              </div>

              {/* Admin Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-sm">Admin Name</span>
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="input input-bordered input-sm w-full text-sm"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Change Password Button */}
              <div className="pt-3">
                <button className="btn btn-outline btn-sm gap-2 text-xs">
                  <span>🔑</span>
                  Change Password
                </button>
              </div>

              {/* Account Info */}
              <div className="bg-gray-100 rounded-lg p-3 mt-5">
                <p className="text-[11px] text-gray-600">
                  <span className="font-semibold">Account Type:</span> Super Administrator
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap justify-end pb-8">
          <button
            onClick={handleCancel}
            className="btn btn-outline btn-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleRestoreDefaults}
            className="btn btn-outline btn-sm"
          >
            🔄 Restore Defaults
          </button>

          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="btn btn-primary btn-sm"
          >
            {isSaving ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Saving...
              </>
            ) : (
              <>
                <span>💾</span>
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
