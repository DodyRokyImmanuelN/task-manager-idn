import React from "react";

export default function Header({ project }) {
    return (
        <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
                {project?.name || "Project"}
            </h1>
        </header>
    );
}
