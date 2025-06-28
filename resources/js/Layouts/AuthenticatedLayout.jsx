import Dropdown from "@/Components/Dropdown";
import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";

export default function AuthenticatedLayout({ children }) {
    const { auth, branches = [] } = usePage().props;
    const user = auth?.user;
    const { url } = usePage();
    const [projectOpen, setProjectOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [projectName, setProjectName] = useState("");

    const isActive = (path) => url === path || url.startsWith(path + "/");

    const submitProject = (e) => {
        e.preventDefault();

        router.post(
            "/branches",
            { name: projectName },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setProjectName("");
                    setModalOpen(false);
                },
            }
        );
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-[#111827] text-white flex flex-col">
                <div className="px-6 py-4 text-xl font-bold border-b border-gray-700">
                    IDN TASK
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 text-sm">
                    <Link
                        href="/dashboard"
                        className={`block p-2 rounded transition-all duration-200 ${
                            isActive("/dashboard")
                                ? "bg-gray-800 font-semibold"
                                : "hover:bg-gray-800"
                        }`}
                    >
                        Dashboard
                    </Link>

                    {user?.role === "user" && (
                        <Link
                            href="/my-tasks"
                            className={`block p-2 rounded transition-all duration-200 ${
                                isActive("/my-tasks")
                                    ? "bg-gray-800 font-semibold"
                                    : "hover:bg-gray-800"
                            }`}
                        >
                            My Tasks
                        </Link>
                    )}

                    {(user?.role === "admin" ||
                        user?.role === "superadmin") && (
                        <Link
                            href="/guest-requests"
                            className={`block p-2 rounded transition-all duration-200 ${
                                isActive("/guest-requests")
                                    ? "bg-gray-800 font-semibold"
                                    : "hover:bg-gray-800"
                            }`}
                        >
                            Guest Requests
                        </Link>
                    )}

                    {/* Branch Section */}
                    <div className="flex items-center justify-between text-gray-400 text-xs uppercase my-2">
                        <button
                            className="flex items-center gap-1"
                            onClick={() => setProjectOpen(!projectOpen)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 7h18M3 12h18m-7 5h7"
                                />
                            </svg>
                            Projects
                        </button>

                        {user?.role === "superadmin" && (
                            <button
                                className="hover:text-white"
                                onClick={() => setModalOpen(true)}
                            >
                                +
                            </button>
                        )}
                    </div>

                    {projectOpen && (
                        <div className="space-y-1">
                            {branches.map((branch) => {
                                const path = `/projects/${branch.id}/board`;
                                return (
                                    <Link
                                        key={branch.id}
                                        href={path}
                                        className={`flex items-center gap-2 p-2 rounded text-sm transition-all duration-200 ${
                                            isActive(path)
                                                ? "bg-gray-800 font-semibold"
                                                : "hover:bg-gray-800"
                                        }`}
                                    >
                                        <span
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{
                                                backgroundColor: branch.color,
                                            }}
                                        ></span>
                                        <span>{branch.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </nav>
            </aside>

            {/* Create Branch Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900">
                            Create Branch
                        </h2>
                        <form onSubmit={submitProject}>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="Branch name"
                                className="w-full p-2 border rounded text-gray-900 mb-4"
                                required
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">
                    <h1 className="text-lg font-semibold text-gray-700">
                        Dashboard
                    </h1>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md">
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-600 transition hover:text-gray-800"
                                >
                                    {user.name}
                                    <svg
                                        className="ml-2 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </span>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <Dropdown.Content>
                                {/* Profile menu bisa di-nonaktifkan jika belum tersedia */}
                                <div className="px-4 py-2 text-sm text-gray-400 cursor-not-allowed">
                                    Profile (coming soon)
                                </div>

                                <Dropdown.Link
                                    method="post"
                                    href={route("logout")}
                                    as="button"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                            <Dropdown.Link
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </header>

                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
