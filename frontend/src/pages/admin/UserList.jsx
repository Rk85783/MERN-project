import { useGetAllUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from "../../store/authApi";
import { useGetMeQuery } from "../../store/authApi";
import Loader from "../../components/layouts/Loader";
import { toast } from "sonner";

const UserList = () => {
  const { data: me } = useGetMeQuery();
  const { data: users, isLoading } = useGetAllUsersQuery(undefined, { skip: !me || me?.role !== "admin" });
  const [updateRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  if (!me || me.role !== "admin") return <p className="text-center mt-10 text-danger">Admin access required</p>;
  if (isLoading) return <Loader />;

  const handleRole = async (id, role) => {
    try { await updateRole({ id, role }).unwrap(); toast.success("Role updated"); }
    catch (err) { toast.error(err.data?.message || "Failed"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try { await deleteUser(id).unwrap(); toast.success("User deleted"); }
    catch (err) { toast.error(err.data?.message || "Failed"); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-100"><th className="text-left p-3">User</th><th className="text-left p-3">Email</th><th className="text-left p-3">Role</th><th className="text-left p-3">Joined</th><th className="p-3">Actions</th></tr></thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-semibold">{u.name}</td>
                <td className="p-3 text-gray-500">{u.email}</td>
                <td className="p-3">
                  {u._id === me._id ? (
                    <span className="text-gray-400">{u.role}</span>
                  ) : (
                    <select value={u.role} onChange={(e) => handleRole(u._id, e.target.value)} className="border rounded px-2 py-1 text-xs">
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  )}
                </td>
                <td className="p-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  {u._id !== me._id && (
                    <button onClick={() => handleDelete(u._id)} className="text-danger hover:underline text-xs">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
