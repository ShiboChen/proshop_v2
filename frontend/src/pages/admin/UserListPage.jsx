import React from "react";
import { toast } from "react-toastify";
import {Link} from 'react-router-dom'
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";

const UserListPage = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.error || err.error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold my-4">Users</h1>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert type="4">{error?.data?.error || error.error}</Alert>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
              </tr>
            </thead>
            <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck className="text-green-400" />
                  ) : (
                    <FaTimes className="text-red-400" />
                  )}
                </td>
                <td>
                  {!user.isAdmin && (
                    <>
                      <Link
                        to={`/admin/user/${user._id}/edit`}
                      >
                        <button className='btn btn-ghost btn-sm'>
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        className='btn btn-ghost btn-sm'
                        onClick={() => deleteHandler(user._id)}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserListPage;
