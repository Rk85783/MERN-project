import { useState } from "react";
import { Link } from "react-router";
import { useForgotPasswordMutation } from "../store/authApi";
import { toast } from "sonner";
import { motion } from "motion/react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [forgot, { isLoading, isSuccess }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgot({ email }).unwrap();
      toast.success("Email sent! Check your inbox");
    } catch (err) {
      toast.error(err.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">Forgot Password</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Enter your email to receive a reset link</p>
        {isSuccess ? (
          <p className="text-success text-center font-semibold">Email sent successfully!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 transition">
              {isLoading ? "Sending..." : "Send Email"}
            </button>
          </form>
        )}
        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
