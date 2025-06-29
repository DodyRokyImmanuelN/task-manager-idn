import React from "react";
import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    return (
        <nav className="mt-4 flex justify-center">
            <ul className="inline-flex items-center space-x-1 text-sm">
                {links.map((ln, idx) => (
                    <li key={idx} className={ln.active ? "font-semibold" : ""}>
                        {ln.url ? (
                            <Link
                                as="button"
                                method="get"
                                href={ln.url}
                                dangerouslySetInnerHTML={{ __html: ln.label }}
                                className="px-3 py-1 hover:bg-gray-200 rounded"
                            />
                        ) : (
                            <span
                                dangerouslySetInnerHTML={{ __html: ln.label }}
                                className="px-3 py-1 text-gray-400"
                            />
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}
