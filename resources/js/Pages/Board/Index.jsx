import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TaskListColumn from "@/Components/Board/TaskListColumn";
import { usePage, router } from "@inertiajs/react";
import ModalTaskDetail from "@/Components/Board/Partials/ModalTaskDetail";
import axios from "axios";

export default function Index() {
    const { branch } = usePage().props;
    const [newListTitle, setNewListTitle] = useState("");
    const [showAddList, setShowAddList] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedList, setSelectedList] = useState(null);

    // Normalize task_lists data to ensure tasks is always an array
    const [taskLists, setTaskLists] = useState(
        branch.task_lists.map((list) => ({
            ...list,
            tasks: list.tasks || [], // Ensure tasks is always an array
        }))
    );
    const handleDeleteList = async (list) => {
        try {
            await axios.delete(`/task-lists/${list.id}`);
            setTaskLists((prev) => prev.filter((l) => l.id !== list.id));
        } catch (error) {
            console.error("Gagal menghapus list:", error);
            alert("Gagal menghapus list.");
        }
    };

    const handleTaskClick = (task, list) => {
        setSelectedTask(task);
        setSelectedList(list);
    };

    const handleAddTask = async (taskListId, title) => {
        try {
            const response = await axios.post("/task-dropdowns", {
                task_list_id: taskListId,
                title: title,
            });

            const newTask = response.data.task;

            setTaskLists((prev) =>
                prev.map((list) => {
                    if (list.id === taskListId) {
                        return {
                            ...list,
                            task_dropdowns: [
                                ...(list.task_dropdowns || []),
                                newTask,
                            ],
                        };
                    }
                    return list;
                })
            );

            return newTask; // ⬅️ Penting jika kamu ingin langsung tambahkan di child pakai state lokal
        } catch (error) {
            console.error("Gagal menambahkan task:", error);
            throw error;
        }
    };

    const handleAddList = async () => {
        if (!newListTitle.trim()) return;

        try {
            const response = await axios.post("/task-lists", {
                branch_id: branch.id,
                title: newListTitle,
            });

            setNewListTitle("");
            setShowAddList(false);
            setTaskLists((prev) => [
                ...prev,
                {
                    ...response.data,
                    tasks: [], // Ensure new list has empty tasks array
                },
            ]);
        } catch (error) {
            console.error("Gagal menambahkan list:", error);
        }
    };

    const handleTaskUpdate = (updatedTask) => {
        setTaskLists((prev) =>
            prev.map((list) => {
                if (list.id === updatedTask.task_list_id) {
                    return {
                        ...list,
                        tasks: (list.tasks || []).map((task) =>
                            task.id === updatedTask.id ? updatedTask : task
                        ),
                    };
                }
                return list;
            })
        );
    };

    const handleTaskDelete = (deletedTaskId) => {
        setTaskLists((prev) =>
            prev.map((list) => ({
                ...list,
                tasks: (list.tasks || []).filter(
                    (task) => task.id !== deletedTaskId
                ),
            }))
        );
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Project: {branch.name}</h1>

            <div className="flex gap-4 overflow-x-auto">
                {taskLists.map((list) => (
                    <TaskListColumn
                        key={list.id}
                        list={list}
                        onAddTaskClick={handleAddTask}
                        onDeleteListClick={handleDeleteList}
                        onTaskClick={handleTaskClick}
                    />
                ))}

                {/* Add List Column */}
                <div className="w-52 flex-none self-start bg-gray-100 border border-dashed border-gray-400 rounded-xl p-4 flex flex-col justify-center items-center min-h-[80px]">
                    {showAddList ? (
                        <div className="w-full">
                            <input
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                placeholder="Enter list title..."
                                value={newListTitle}
                                onChange={(e) =>
                                    setNewListTitle(e.target.value)
                                }
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <button
                                    onClick={handleAddList}
                                    className="text-indigo-600 hover:underline"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddList(false);
                                        setNewListTitle("");
                                    }}
                                    className="hover:underline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAddList(true)}
                            className="text-sm text-gray-500 hover:text-indigo-600"
                        >
                            ＋ Add List
                        </button>
                    )}
                </div>
                {selectedTask && (
                    <ModalTaskDetail
                        task={selectedTask}
                        list={selectedList}
                        onClose={(shouldReload, updatedTask) => {
                            setSelectedTask(null);
                            setSelectedList(null);
                            if (updatedTask) {
                                handleTaskUpdate(updatedTask);
                            } else if (shouldReload) {
                                handleTaskDelete(selectedTask.id);
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
}

Index.layout = (page) => <AuthenticatedLayout children={page} />;
