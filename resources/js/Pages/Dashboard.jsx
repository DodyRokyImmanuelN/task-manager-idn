import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function Dashboard({
    auth,
    openTasks,
    completedTasks,
    totalProjects,
    weeklyData,
    monthlyData,
}) {
    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Dashboard" />
            <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4 pb-2">
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Dashboard
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <StatCard
                        title="Open Tasks"
                        value={openTasks}
                        color="bg-purple-100 text-purple-700"
                        icon={<IconTasks />}
                    />
                    <StatCard
                        title="Completed Tasks"
                        value={completedTasks}
                        color="bg-green-100 text-green-700"
                        icon={<IconCompleted />}
                    />
                    <StatCard
                        title="Total Projects"
                        value={totalProjects}
                        color="bg-yellow-100 text-yellow-700"
                        icon={<IconCalendar />}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartCard
                        title="Completed in the last 7 days"
                        data={weeklyData}
                        dataKey="tasks"
                        xKey="day"
                    />
                    <ChartCard
                        title="Most productive month"
                        data={monthlyData}
                        dataKey="tasks"
                        xKey="month"
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow flex items-center justify-between">
            <div>
                <div className="text-sm text-gray-500 font-medium">{title}</div>
                <div className="text-3xl font-bold mt-1 text-gray-900">
                    {value}
                </div>
            </div>
            <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        </div>
    );
}

function ChartCard({ title, data, dataKey, xKey }) {
    return (
        <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <ResponsiveContainer width="100%" height={160}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xKey} />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke="#8884d8"
                        fill="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

// Icons
function IconTasks() {
    return (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <path
                d="M8 9l3 3-3 3M13 9h3M13 15h3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconCompleted() {
    return (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconCalendar() {
    return (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <path
                d="M8 7V3M16 7V3M4 11h16M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
