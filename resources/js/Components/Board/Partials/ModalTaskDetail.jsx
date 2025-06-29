import { useState, useEffect } from "react";
import axios from "axios";
import LabelDropdown from "@/Components/Board/LabelDropdown";
import LabelTag from "@/Components/Board/LabelTag";

export default function ModalTaskDetail({ task, list, onClose }) {
    const [repeat, setRepeat] = useState(task.repeat || "none");
    const [label, setLabel] = useState(task.label || null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [description, setDescription] = useState(task.description || "");
    const [dueDate, setDueDate] = useState(task.due_date || "");
    const [isEditing, setIsEditing] = useState(false);
    const [newChecklistItem, setNewChecklistItem] = useState("");
    const [comments, setComments] = useState(task.comments || []);
    const [newComment, setNewComment] = useState("");
    const [userOptions, setUserOptions] = useState([]);
    const [assignees, setAssignees] = useState(task.assignees || []);
    const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
    const [assigneeId, setAssigneeId] = useState(task.assignee_id || "");
    const [assignee, setAssignee] = useState(task.assignee || null);
    const [selectedAssigneeId, setSelectedAssigneeId] = useState(
        task.assignee?.id || null
    );

    const [checklists, setChecklists] = useState(
        Array.isArray(task.checklists) ? task.checklists : []
    );
    useEffect(() => {
        setLabel(task.label || null);
    }, [task.label]);
    useEffect(() => {
        setDueDate(task.due_date || "");
    }, [task.due_date]);
    useEffect(() => {
        // Update assignees saat task berubah
        setAssignees(task.assignees || []);
    }, [task.assignees]);

    useEffect(() => {
        axios.get("/users").then((res) => setUserOptions(res.data));
    }, []);

    // Sync ketika task.description berubah dari luar
    useEffect(() => {
        setDescription(task.description || "");
    }, [task.description]);

    const handleDeleteTask = async () => {
        if (confirm("Are you sure you want to delete this task?")) {
            try {
                await axios.delete(`/task-dropdowns/${task.id}`);
                onClose("delete"); // Tutup modal dan beri sinyal ke parent
            } catch (err) {
                console.error("Failed to delete task", err);
            }
        }
    };

    const handleSelect = async (selected) => {
        try {
            // Kirim ke server, agar label disimpan (jika belum ada)
            const response = await axios.post("/labels/attach", {
                name: selected.name,
                color: selected.color,
            });

            const label = response.data.label;

            setLabel(label); // simpan di local state

            // Update ke task_dropdowns
            await axios.put(`/task-dropdowns/${task.id}`, {
                label_id: label.id,
            });
        } catch (err) {
            console.error("Gagal menyimpan label", err);
            alert("Gagal menyimpan label");
        }
    };

    const handleDueDateChange = (date) => {
        setDueDate(date);

        axios
            .put(`/task-dropdowns/${task.id}`, {
                due_date: date || null,
            })
            .then((res) => {
                setDueDate(res.data.task.due_date);
            })
            .catch((err) => {
                console.error("Failed to update due date", err);
                alert("Failed to update due date");
            });
    };
    const handleAddRepeat = async (newRepeat) => {
        setRepeat(newRepeat);

        try {
            const response = await axios.put(`/task-dropdowns/${task.id}`, {
                repeat: newRepeat,
            });

            // Optional: update repeat dari response
            setRepeat(response.data.task.repeat);
        } catch (err) {
            console.error("Failed to update repeat", err);
            alert("Gagal memperbarui repeat");
        }
    };

    const handleAddAssignee = (user) => {
        setAssignees((prev) => [...prev, user]);
        setShowAssigneeDropdown(false);

        // Langsung update ke backend
        axios
            .put(`/task-dropdowns/${task.id}`, {
                assignee_ids: [...assignees, user].map((a) => a.id),
            })
            .catch((err) => {
                console.error("Failed to update assignees", err);
                // Rollback jika gagal
                setAssignees((prev) => prev.filter((u) => u.id !== user.id));
            });
    };

    const handleRemoveAssignee = (userId) => {
        const newAssignees = assignees.filter((u) => u.id !== userId);
        setAssignees(newAssignees);

        // Langsung update ke backend
        axios
            .put(`/task-dropdowns/${task.id}`, {
                assignee_ids: newAssignees.map((a) => a.id),
            })
            .catch((err) => {
                console.error("Failed to update assignees", err);
                // Rollback jika gagal
                setAssignees(assignees);
            });
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        axios
            .post("/task-comments", {
                task_id: task.id,
                comment: newComment,
            })
            .then((res) => {
                setComments((prev) => [...prev, res.data]);
                setNewComment("");
            })
            .catch((err) => {
                console.error("Failed to add comment", err);
            });
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`/task-dropdowns/${task.id}`, {
                description,
                due_date: dueDate || null,
                label_id: label ? label.id : null,
                assignee_ids: assignees.map((a) => a.id),
                repeat,
            });

            const updatedTask = response.data.task;

            // Update state lokal
            setDescription(updatedTask.description);
            setAssignees(updatedTask.assignees);
            setDueDate(updatedTask.due_date);
            setLabel(updatedTask.label);
            setIsEditing(false);

            // Panggil callback untuk update parent component tanpa menutup modal

            // Tambahkan notifikasi sukses
        } catch (err) {
            console.error("Failed to update task", err);
            alert("Failed to save changes. Please try again.");
        }
    };

    const toggleChecklistDone = async (item) => {
        try {
            const updated = await axios.put(`/task-checklists/${item.id}`, {
                is_done: !item.is_done,
            });

            setChecklists((prev) =>
                prev.map((c) =>
                    c.id === item.id
                        ? { ...c, is_done: updated.data.is_done }
                        : c
                )
            );
        } catch (err) {
            console.error("Failed to update checklist status", err);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this task?")) {
            try {
                await axios.delete(`/task-dropdowns/${task.id}`);
                onClose("delete");
            } catch (err) {
                console.error("Failed to delete task", err);
            }
        }
    };

    const handleAddChecklistItem = async () => {
        if (!newChecklistItem.trim()) return;

        try {
            const response = await axios.post("/task-checklists", {
                task_id: task.id,
                item: newChecklistItem,
            });

            setChecklists((prev) => [...prev, response.data]);
            setNewChecklistItem("");
        } catch (err) {
            console.error("Failed to add checklist item", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
            <div className="bg-white rounded-xl shadow-lg w-[900px] max-w-full p-6">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
                    <div className="flex flex-col">
                        <div className="text-sm text-gray-500 font-semibold">
                            {list.project?.name || "Project"} / {list.title}
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            onClose(false);
                            window.location.reload(); // 🔁 reload full page
                        }}
                        className="text-gray-500 text-xl font-bold"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-[2fr_1fr] gap-6">
                    <div>
                        {/* Deskripsi */}
                        <div className="mb-6">
                            {isEditing ? (
                                <div>
                                    <textarea
                                        className="w-full border rounded p-2 text-sm"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        rows={3}
                                    />
                                    <div className="mt-2 text-sm">
                                        <button
                                            onClick={handleSave}
                                            className="mr-3 text-indigo-600 hover:underline"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDescription(
                                                    task.description || ""
                                                );
                                                setIsEditing(false);
                                            }}
                                            className="hover:underline"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="text-sm text-gray-700 whitespace-pre-wrap cursor-pointer"
                                    onClick={() => setIsEditing(true)}
                                >
                                    {description ||
                                        "Click to add description..."}
                                </div>
                            )}
                        </div>

                        {/* Checklist */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold mb-2">
                                Checklist
                            </h3>

                            {checklists && checklists.length > 0 ? (
                                <ul className="space-y-2">
                                    {checklists.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={item.is_done}
                                                onChange={() =>
                                                    toggleChecklistDone(item)
                                                }
                                                className="w-4 h-4"
                                            />
                                            <span
                                                className={
                                                    item.is_done
                                                        ? "line-through text-gray-400"
                                                        : ""
                                                }
                                            >
                                                {item.item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No checklist items yet.
                                </p>
                            )}

                            <div className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    className="w-full border px-2 py-1 text-sm rounded"
                                    placeholder="Add new item"
                                    value={newChecklistItem}
                                    onChange={(e) =>
                                        setNewChecklistItem(e.target.value)
                                    }
                                />
                                <button
                                    onClick={handleAddChecklistItem}
                                    className="text-sm text-white bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Komentar */}
                        <div>
                            <h3 className="text-sm font-semibold mb-1">
                                Comments
                            </h3>
                            <ul className="space-y-2 mb-4">
                                {comments.map((c) => (
                                    <li
                                        key={c.id}
                                        className="border p-3 rounded bg-gray-50 text-sm shadow-sm"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-gray-800">
                                                {c.user?.name || "Unknown"}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(
                                                    c.created_at
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700">
                                            {c.comment}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex gap-2">
                                <input
                                    value={newComment}
                                    onChange={(e) =>
                                        setNewComment(e.target.value)
                                    }
                                    className="w-full border rounded px-3 py-1 text-sm"
                                    placeholder="Write a comment"
                                />
                                <button
                                    onClick={handleAddComment}
                                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4 text-sm">
                        <div>
                            <p className="text-gray-600">Time</p>
                            <p className="font-semibold">00:00:00</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Project List</p>
                            <p className="font-semibold">{list.title}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Assignees</p>
                            {assignees.length > 0 ? (
                                <ul className="space-y-1 mb-1">
                                    {assignees.map((user) => (
                                        <li
                                            key={user.id}
                                            className="flex items-center justify-between text-sm border p-1 rounded"
                                        >
                                            <span>{user.name}</span>
                                            <button
                                                onClick={() =>
                                                    handleRemoveAssignee(
                                                        user.id
                                                    )
                                                }
                                                className="text-red-500 text-xs hover:underline"
                                            >
                                                ✕
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 italic text-sm">
                                    No assignees
                                </p>
                            )}

                            <button
                                className="text-indigo-600 hover:underline text-sm"
                                onClick={() =>
                                    setShowAssigneeDropdown(
                                        !showAssigneeDropdown
                                    )
                                }
                            >
                                ＋ Add Assignee
                            </button>

                            {showAssigneeDropdown && (
                                <ul className="mt-2 border rounded p-2 bg-white shadow-md max-h-40 overflow-auto text-sm">
                                    {userOptions
                                        .filter(
                                            (u) =>
                                                !assignees.find(
                                                    (a) => a.id === u.id
                                                )
                                        )
                                        .map((user) => (
                                            <li
                                                key={user.id}
                                                className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                                                onClick={() =>
                                                    handleAddAssignee(user)
                                                }
                                            >
                                                {user.name}
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>

                        <div className="mt-4">
                            <label className="text-gray-600 text-sm">
                                Due Date
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="date"
                                    value={dueDate || ""}
                                    onChange={(e) =>
                                        handleDueDateChange(e.target.value)
                                    }
                                    className="text-sm border px-2 py-1 rounded w-full"
                                />
                                {dueDate && (
                                    <button
                                        onClick={() => handleDueDateChange("")}
                                        className="text-red-500 text-xs hover:underline"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 relative">
                            <div className="flex items-center justify-between">
                                <p className="text-gray-600 text-sm font-semibold">
                                    Label
                                </p>
                                <button
                                    onClick={() =>
                                        setShowDropdown(!showDropdown)
                                    }
                                    className="text-gray-600 hover:text-black px-2 text-lg font-bold"
                                >
                                    +
                                </button>
                            </div>

                            {showDropdown && (
                                <LabelDropdown
                                    onSelect={handleSelect}
                                    onCloseDropdown={() =>
                                        setShowDropdown(false)
                                    }
                                />
                            )}

                            {label && (
                                <LabelTag
                                    label={label}
                                    taskId={task.id}
                                    onClear={() => setLabel(null)}
                                />
                            )}
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 font-semibold">
                                Repeat
                            </p>
                            <select
                                value={repeat}
                                onChange={(e) =>
                                    handleAddRepeat(e.target.value)
                                }
                                className="w-full border rounded-md px-2 py-1 text-sm mt-1"
                            >
                                <option value="none">Tidak Berulang</option>
                                <option value="daily">Harian</option>
                                <option value="weekly">Mingguan</option>
                                <option value="monthly">Bulanan</option>
                            </select>
                        </div>

                        <div>
                            <p className="text-gray-600">Delete</p>
                            <button
                                onClick={async () => {
                                    await handleDeleteTask();
                                    window.location.reload();
                                }}
                                className="text-red-500 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                        <div>
                            <p className="text-gray-600">Share</p>
                            <button className="hover:underline">🔗</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
