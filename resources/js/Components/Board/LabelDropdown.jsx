import React, { useRef, useEffect } from "react";

const LABELS = [
    { id: 1, name: "Konten", color: "bg-purple-500" },
    { id: 2, name: "Menulis", color: "bg-gray-700" },
    { id: 3, name: "Prospek", color: "bg-green-500" },
    { id: 4, name: "PSB", color: "bg-blue-500" },
    { id: 5, name: "Poster", color: "bg-red-500" },
];

export default function LabelDropdown({ onSelect, onCloseDropdown }) {
    const dropdownRef = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                onCloseDropdown?.(); // jika klik di luar, tutup
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onCloseDropdown]);
    return (
        <div className="mt-2 border rounded-md p-2 bg-white shadow-md w-48 absolute z-50">
            {LABELS.map((label) => (
                <button
                    key={label.id}
                    onClick={() => {
                        onSelect(label); // memicu proses penyimpanan label
                        onCloseDropdown();
                    }}
                    className="flex items-center gap-2 w-full px-2 py-1 rounded hover:bg-gray-100 text-sm"
                >
                    <span className={`w-3 h-3 rounded-full ${label.color}`} />
                    {label.name}
                </button>
            ))}
        </div>
    );
}
