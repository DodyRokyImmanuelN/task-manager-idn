import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";

export default function Index() {
    const { users, search: initialSearch, flash = {} } = usePage().props;

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });

    // Fix: Pastikan search tidak pernah null
    const [search, setSearch] = useState(initialSearch || "");

    const submitAdd = (e) => {
        e.preventDefault();
        router.post(route("users.store"), form, {
            onSuccess: () =>
                setForm({ name: "", email: "", password: "", role: "user" }),
        });
    };

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route("users.index"), { search }, { preserveState: true });
    };

    const handleDelete = (userId) => {
        if (!confirm("Delete this user?")) return;

        console.log(
            "Deleting user with route:",
            route("users.destroy", userId)
        );

        router.delete(route("users.destroy", userId), {
            preserveScroll: true,
            onSuccess: () => {
                console.log("User deleted");
            },
            onError: (errors) => {
                console.error("Failed to delete user:", errors);
                alert("Something went wrong while deleting the user.");
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
                <h1 className="text-3xl font-bold">User Management</h1>

                {flash.success && (
                    <div className="bg-green-100 text-green-800 p-3 rounded">
                        {flash.success}
                    </div>
                )}

                {/* Form Add User */}
                <form
                    onSubmit={submitAdd}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-lg shadow"
                >
                    <input
                        type="text"
                        placeholder="Name"
                        className="border p-2 rounded w-full"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="border p-2 rounded w-full"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-2 rounded w-full"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        required
                    />
                    <select
                        className="border p-2 rounded w-full"
                        value={form.role}
                        onChange={(e) =>
                            setForm({ ...form, role: e.target.value })
                        }
                        required
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="monitor">Monitor</option>
                    </select>
                    <button
                        type="submit"
                        className="md:col-span-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Add User
                    </button>
                </form>

                {/* Search bar */}
                <form
                    onSubmit={submitSearch}
                    className="flex items-center space-x-3"
                >
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="flex-1 border p-2 rounded"
                    />
                    <button
                        type="submit"
                        className="bg-gray-600 text-white px-4 py-2 rounded"
                    >
                        Search
                    </button>
                </form>

                {/* Table */}
                <div className="overflow-x-auto rounded shadow">
                    <table className="w-full table-auto border border-gray-200">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Role</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2">{u.name}</td>
                                    <td className="px-4 py-2">{u.email}</td>
                                    <td className="px-4 py-2 capitalize">
                                        {u.role}
                                    </td>
                                    <td className="px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            className="text-sm text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center text-gray-500 py-4"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.links.length > 1 && <Pagination links={users.links} />}
            </div>
        </AuthenticatedLayout>
    );
}
