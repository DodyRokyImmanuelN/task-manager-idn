import React from "react";

export default function TaskCard({ task, onClick }) {
    return (
        <div
            className="bg-white p-2 rounded shadow hover:bg-gray-100 cursor-pointer text-sm"
            onClick={onClick}
        >
            {task.title}
        </div>
    );
}
