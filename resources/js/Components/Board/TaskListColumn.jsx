import { useState } from "react";
import TaskCard from "./TaskCard";

export default function TaskListColumn({
    list,
    onAddTaskClick,
    onDeleteListClick,
    onTaskClick,
}) {
    const [showInput, setShowInput] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    if (!list) {
        console.error("TaskListColumn: list prop is undefined");
        return (
            <div className="w-64 flex-shrink-0 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="text-red-600 text-sm">
                    Error: List data not found
                </div>
            </div>
        );
    }

    const handleSubmit = () => {
        if (!newTaskTitle.trim()) return;
        onAddTaskClick(list.id, newTaskTitle);
        setNewTaskTitle("");
        setShowInput(false);
    };

    const taskDropdowns = list.task_dropdowns || list.taskDropdowns || [];

    return (
        <div className="w-64 flex-none self-start bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3 relative">
                <h2 className="text-sm font-semibold text-gray-700">
                    {list.title}
                </h2>
                <div className="relative group">
                    <button
                        onClick={() => onDeleteListClick(list)}
                        className="text-gray-400 hover:text-red-600 transition duration-150"
                        title="Delete list"
                    >
                        <span className="group-hover:hidden">⋮</span>
                        <span className="hidden group-hover:inline-block">
                            ✕
                        </span>
                    </button>
                </div>
            </div>

            <div className="space-y-3 mb-3">
                {taskDropdowns.map((dropdown) => (
                    <TaskCard
                        key={dropdown.id}
                        task={dropdown}
                        onClick={() => onTaskClick(dropdown, list)} // ✅ Kirim list juga
                    />
                ))}
            </div>

            {showInput ? (
                <div className="space-y-2">
                    <input
                        className="w-full px-2 py-1 text-sm border rounded"
                        placeholder="Enter task title..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <button
                            onClick={handleSubmit}
                            className="text-indigo-600 hover:underline"
                        >
                            Add Task
                        </button>
                        <button
                            onClick={() => {
                                setShowInput(false);
                                setNewTaskTitle("");
                            }}
                            className="hover:underline"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setShowInput(true)}
                    className="mt-2 text-xs text-gray-500 hover:text-indigo-600 flex items-center space-x-1"
                >
                    <span>＋</span>
                    <span>Add task</span>
                </button>
            )}
        </div>
    );
}
