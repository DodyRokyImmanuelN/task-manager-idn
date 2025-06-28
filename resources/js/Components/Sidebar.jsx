import React from "react";

export default function Sidebar({ projects = [], activeProject = null }) {
    return (
        <aside className="w-64 bg-gray-800 text-white p-4">
            <h2 className="text-lg font-semibold mb-4">Projects</h2>
            <ul className="space-y-2">
                {projects.map((project) => (
                    <li
                        key={project.id}
                        className={`p-2 rounded cursor-pointer ${
                            activeProject?.id === project.id
                                ? "bg-gray-700 font-bold"
                                : "hover:bg-gray-700"
                        }`}
                    >
                        {project.name}
                    </li>
                ))}
            </ul>
        </aside>
    );
}
