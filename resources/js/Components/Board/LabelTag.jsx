import React from "react";
import axios from "axios";

export default function LabelTag({ label, taskId, onClear }) {
    const handleRemove = async () => {
        try {
            await axios.put(`/task-dropdowns/${taskId}`, {
                label_id: null,
            });
            onClear();
        } catch (error) {
            console.error("Gagal menghapus label", error);
            alert("Gagal menghapus label");
        }
    };

    return (
        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-800 mt-2">
            <span className={`w-2 h-2 rounded-full ${label.color}`}></span>
            {label.name}
            <button
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700 text-xs font-bold"
            >
                ×
            </button>
        </div>
    );
}
