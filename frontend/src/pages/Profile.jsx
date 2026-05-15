import { useState } from "react";
import { useGetMeQuery, useUpdateProfileMutation, useUpdatePasswordMutation } from "../store/authApi";
import { toast } from "sonner";
import { motion } from "motion/react";
import Loader from "../components/layouts/Loader";

const Profile = () => {
  const { data: user, isLoading } = useGetMeQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [updatePassword, { isLoading: pwdLoading }] = useUpdatePasswordMutation();

  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  if (isLoading) return <Loader />;
  if (!user) return <p className="text-center mt-10">Please login first</p>;

  const handleProfile = async (e) => {
    e.preventDefault();
    try { await updateProfile(profile).unwrap(); toast.success("Profile updated"); }
    catch (err) { toast.error(err.data?.message || "Update failed"); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error("Passwords do not match"); return; }
    try { await updatePassword(passwords).unwrap(); toast.success("Password updated"); setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" }); }
    catch (err) { toast.error(err.data?.message || "Password update failed"); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
        <p className="text-gray-500">{user.email}</p>
        <p className="text-sm text-gray-400">Role: {user.role} | Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Update Profile</h2>
        <form onSubmit={handleProfile} className="space-y-3">
          <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Name" />
          <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Email" />
          <button type="submit" disabled={updating} className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark disabled:opacity-50">{updating ? "Saving..." : "Save"}</button>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePassword} className="space-y-3">
          <input type="password" name="oldPassword" placeholder="Current Password" value={passwords.oldPassword} onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="password" name="newPassword" placeholder="New Password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="password" name="confirmPassword" placeholder="Confirm New Password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <button type="submit" disabled={pwdLoading} className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark disabled:opacity-50">{pwdLoading ? "Updating..." : "Update Password"}</button>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
