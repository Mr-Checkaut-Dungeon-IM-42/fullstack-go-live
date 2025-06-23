import React, { useState, useEffect } from "react";
import axios from "axios";
import CardComponent from "./CardComponent";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserInterfaceProps {
  backendName: string;
}

const UserInterface: React.FC<UserInterfaceProps> = ({ backendName }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [updateUser, setUpdateUser] = useState({ id: "", name: "", email: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const backgroundColors: { [key: string]: string } = {
    go: "bg-cyan-500",
  };

  const buttonColors: { [key: string]: string } = {
    go: "bg-cyan-700 hover:bg-cyan-600",
  };

  const bgColor = backgroundColors[backendName] || "bg-gray-200";
  const btnColor = buttonColors[backendName] || "bg-gray-500 hover:bg-gray-600";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/${backendName}/users`);
        setUsers(response.data.reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [backendName, apiUrl]);

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert("Name and email are required!");
      return;
    }
    
    try {
      const response = await axios.post(
        `${apiUrl}/api/${backendName}/users`,
        newUser
      );
      setUsers([response.data, ...users]);
      setNewUser({ name: "", email: "" });
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!updateUser.name.trim() || !updateUser.email.trim()) {
      alert("Name and email are required!");
      return;
    }
    
    try {
      const response = await axios.put(
        `${apiUrl}/api/${backendName}/users/${updateUser.id}`,
        { name: updateUser.name, email: updateUser.email }
      );
      
      setUsers(users.map(user => 
        user.id === parseInt(updateUser.id) ? response.data : user
      ));
      
      setUpdateUser({ id: "", name: "", email: "" });
      setIsUpdating(false);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await axios.delete(`${apiUrl}/api/${backendName}/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <div className={`user-interface ${bgColor} w-full max-w-md p-4 my-4 rounded shadow`}>
      <img
        src={`/${backendName}logo.svg`}
        alt={`${backendName} Logo`}
        className="w-20 h-20 mb-6 mx-auto"
      />
      <h2 className="text-xl font-bold text-center text-white mb-6">{`${
        backendName.charAt(0).toUpperCase() + backendName.slice(1)
      } Backend`}</h2>

      {!isUpdating ? (
        <form onSubmit={createUser} className="mb-6 p-4 bg-blue-100 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Create New User</h3>
          <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
            required
            type="email"
          />
          <button 
            type="submit" 
            className={`w-full p-2 text-white ${btnColor}`}
          >
            Add User
          </button>
        </form>
      ) : (
        <form onSubmit={handleUpdate} className="mb-6 p-4 bg-yellow-100 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Update User</h3>
          <input
            placeholder="Name"
            value={updateUser.name}
            onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            placeholder="Email"
            value={updateUser.email}
            onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
            required
            type="email"
          />
          <div className="flex space-x-2">
            <button 
              type="submit" 
              className="flex-1 p-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded"
            >
              Update User
            </button>
            <button 
              type="button" 
              className="p-2 text-white bg-gray-500 hover:bg-gray-600 rounded"
              onClick={() => {
                setUpdateUser({ id: "", name: "", email: "" });
                setIsUpdating(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
          >
            <CardComponent card={user} />
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  setUpdateUser({
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email
                  });
                  setIsUpdating(true);
                }}
                className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteUser(user.id)}
                className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserInterface;
