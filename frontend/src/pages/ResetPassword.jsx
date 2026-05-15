import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useResetPasswordMutation } from "../store/authApi";
import { toast } from "sonner";
import { motion } from "motion/react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [reset, { isLoading }] = useResetPasswordMutation();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await reset({ token, password: form.password, confirmPassword: form.confirmPassword }).unwrap();
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required minLength={8} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 transition">
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
