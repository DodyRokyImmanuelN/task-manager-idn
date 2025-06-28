import { useState, useEffect } from "react";
import axios from "axios";

export default function ModalTaskDetail({ task, list, onClose }) {
    const [description, setDescription] = useState(task.description || "");
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
        axios.get("/users").then((res) => setUserOptions(res.data));
    }, []);

    // Sync ketika task.description berubah dari luar
    useEffect(() => {
        setDescription(task.description || "");
    }, [task.description]);
    const handleAssign = (userId) => {
        axios
            .put(`/task-dropdowns/${task.id}/assign`, {
                assignee_id: userId,
            })
            .then((res) => {
                setAssignee(res.data.assignee);
                setShowAssigneeDropdown(false);
            })
            .catch((err) => {
                console.error("Failed to assign", err);
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
                assignee_ids: assignees.map((a) => a.id),
            });

            const updatedTask = response.data.task;
            setDescription(updatedTask.description);
            setAssigneeId(updatedTask.assignee_id);
            setAssignees(updatedTask.assignees);
            setIsEditing(false);

            if (onUpdate) onUpdate(updatedTask);
        } catch (err) {
            console.error("Failed to update task", err);
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
                                                    setAssignees((prev) =>
                                                        prev.filter(
                                                            (u) =>
                                                                u.id !== user.id
                                                        )
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
                                                onClick={() => {
                                                    setAssignees((prev) => [
                                                        ...prev,
                                                        user,
                                                    ]);
                                                    setShowAssigneeDropdown(
                                                        false
                                                    );
                                                }}
                                            >
                                                {user.name}
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>

                        <div>
                            <p className="text-gray-600">Due Date</p>
                            <button className="text-indigo-600 hover:underline">
                                📅 No due date
                            </button>
                        </div>
                        <div>
                            <p className="text-gray-600">Labels</p>
                            <button className="text-indigo-600 hover:underline">
                                ＋
                            </button>
                        </div>
                        <div>
                            <p className="text-gray-600">Repeat</p>
                            <button className="text-indigo-600 hover:underline">
                                ＋
                            </button>
                        </div>
                        <div>
                            <p className="text-gray-600">Delete</p>
                            <button
                                onClick={handleDelete}
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
