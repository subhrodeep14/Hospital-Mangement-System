
import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import neotiaLogo from '../assets/neotia-logo.png';
import { axiosClient } from '../api/axiosClient';
import { useNavigate } from "react-router-dom";
interface LoginPageProps {
  onLogin: (user: any) => void;  // updated: backend returns user object
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: "", // backend expects email, not username
    password: "",
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!credentials.email.trim()) newErrors.email = "Email is required";
    if (!credentials.password.trim()) {
      newErrors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const res = await axiosClient.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      // Login success → send user object to parent
      onLogin(res.data.user);

    } catch (err: any) {
      console.error(err);

      let message = "Login failed";

      if (err.response?.data?.message) {
        message = err.response.data.message;
      }

      setErrors({ general: message });
    }

    setIsLoading(false);
  };

  const handleChange = (field: keyof typeof credentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    if (errors.general) setErrors(prev => ({ ...prev, general: "" }));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        {/* Hospital Branding */}
        <div className="text-center mb-8">
          <img src={neotiaLogo} alt="Neotia Getwel" className="mx-auto mb-4 w-32 h-auto" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Neotia Getwel Multispecialty Hospital</h1>
          <p className="text-gray-600">Inventory Management System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login</h2>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={credentials.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className={`pl-10 pr-4 py-3 border rounded-lg w-full ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Enter your password"
                  className={`pl-10 pr-12 py-3 border rounded-lg w-full ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
           <div className="mt-6 text-center">
      <p className="text-sm text-gray-600">
        Don’t have an account?
      </p>

      <button
        type="button"
        onClick={() => navigate("/register")}
        className="mt-2 w-full py-2 rounded-lg border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 transition"
      >
        Create an account
      </button>
    </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2026 Neotia Getwel Multispecialty Hospital. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


