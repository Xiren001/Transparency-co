import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Building2, MousePointer, Package, Search as SearchIcon, Star, TrendingUp, Users } from 'lucide-react';
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const COLORS = ['#6366f1', '#f59e42', '#10b981', '#f43f5e', '#8b5cf6', '#06b6d4'];

function StatCard({
    title,
    value,
    icon,
    change,
    changeType,
    sub,
}: {
    title: string;
    value: string | number;
    icon?: any;
    change?: string;
    changeType?: 'up' | 'down';
    sub?: string;
}) {
    return (
        <div className="flex min-h-[90px] min-w-0 flex-col justify-between rounded-2xl bg-white p-4 shadow-sm sm:p-6 dark:bg-[#18181c]">
            <div className="mb-2 flex items-center gap-3">
                {icon && <span className="inline-flex items-center justify-center rounded-lg bg-gray-100 p-2 dark:bg-[#23232a]">{icon}</span>}
                <span className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">{title}</span>
            </div>
            <div className="flex items-end gap-2">
                <span className="truncate text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
                {change && (
                    <span className={`text-xs font-semibold ${changeType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {changeType === 'up' ? '↑' : '↓'} {change}
                    </span>
                )}
            </div>
            {sub && <div className="mt-1 truncate text-xs text-gray-400">{sub}</div>}
        </div>
    );
}

export default function Dashboard() {
    const { analytics } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex min-h-screen w-full flex-col gap-8 bg-[#f7f8fa] p-2 sm:p-4 md:p-6 lg:p-8 xl:p-12 dark:bg-[#101014]">
                {/* Top Stat Cards */}
                <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4 md:gap-6">
                    <StatCard
                        title="Total Users"
                        value={analytics.users.total}
                        icon={<Users className="h-5 w-5 text-blue-500" />}
                        change={'+1%'}
                        changeType="up"
                    />
                    <StatCard
                        title="Total Products"
                        value={analytics.products.total}
                        icon={<Package className="h-5 w-5 text-green-500" />}
                        change={'+2%'}
                        changeType="up"
                    />
                    <StatCard
                        title="Total Companies"
                        value={analytics.companies.total}
                        icon={<Building2 className="h-5 w-5 text-purple-500" />}
                        change={'+1%'}
                        changeType="up"
                    />
                    <StatCard
                        title="New Users (Month)"
                        value={analytics.users.newThisMonth}
                        icon={<TrendingUp className="h-5 w-5 text-pink-500" />}
                        change={'+3%'}
                        changeType="up"
                    />
                </div>

                {/* Search Analytics Section */}
                <div className="mt-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                    <StatCard
                        title="Total Searches"
                        value={analytics.search.totalQueries}
                        icon={<SearchIcon className="h-5 w-5 text-blue-500" />}
                        sub="Last 30 days"
                    />
                    <StatCard
                        title="Total Suggestion Clicks"
                        value={analytics.search.totalClicks}
                        icon={<MousePointer className="h-5 w-5 text-cyan-500" />}
                        sub="Last 30 days"
                    />
                    <div className="col-span-1 flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm md:col-span-2 dark:bg-[#18181c]">
                        <div className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Top Search Queries</div>
                        <ul className="text-sm text-gray-800 dark:text-gray-100">
                            {analytics.search.topQueries.length === 0 && <li className="text-gray-400">No data</li>}
                            {analytics.search.topQueries.map((q: any) => (
                                <li key={q.query} className="flex justify-between border-b border-gray-100 py-1 dark:border-[#23232a]">
                                    <span>{q.query}</span>
                                    <span className="text-xs text-gray-400">{q.count}x</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Top Clicked Suggestions</div>
                        <ul className="text-sm text-gray-800 dark:text-gray-100">
                            {analytics.search.topClickedSuggestions.length === 0 && <li className="text-gray-400">No data</li>}
                            {analytics.search.topClickedSuggestions.map((c: any, i: number) => (
                                <li
                                    key={c.suggestion_value + '-' + i}
                                    className="flex justify-between border-b border-gray-100 py-1 dark:border-[#23232a]"
                                >
                                    <span>
                                        {c.suggestion_value} <span className="text-xs text-gray-400">({c.suggestion_type})</span>
                                    </span>
                                    <span className="text-xs text-gray-400">{c.count}x</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Main Chart and Side Panel */}
                <div className="grid w-full flex-1 grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
                    {/* Main Line Chart Card */}
                    <div className="col-span-2 flex h-full min-h-[320px] min-w-0 flex-col rounded-2xl bg-white p-2 shadow-sm sm:p-4 md:p-8 dark:bg-[#18181c]">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">User Signups Trend</div>
                            <button className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 dark:bg-[#23232a] dark:text-gray-400">
                                Download CSV
                            </button>
                        </div>
                        <div className="min-h-[220px] w-full flex-1 md:min-h-[260px] xl:min-h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.users.signupsTrend} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} />
                                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(0,0,0,0.9)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Line type="monotone" dataKey="signups" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Side Panel */}
                    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-6">
                        {/* Pie Chart for Product Categories */}
                        <div className="flex h-full min-w-0 flex-col items-center justify-center rounded-2xl bg-white p-2 shadow-sm sm:p-4 dark:bg-[#18181c]">
                            <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Products by Category</div>
                            <div className="flex min-h-[180px] w-full flex-1 items-center justify-center">
                                <ResponsiveContainer width="100%" height={220} minWidth={0} minHeight={0}>
                                    <PieChart>
                                        <Pie
                                            data={analytics.products.byCategory}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={80}
                                            fill="#6366f1"
                                            label={({ name }) => name}
                                        >
                                            {analytics.products.byCategory.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(0,0,0,0.9)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                color: 'white',
                                                fontSize: '12px',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Cards (Top Products, Top Clicked, etc.) */}
                <div className="mt-2 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-4">
                    <StatCard
                        title="Top Product"
                        value={analytics.products.mostViewed}
                        icon={<Star className="h-5 w-5 text-yellow-500" />}
                        sub="Most Viewed"
                    />
                    <StatCard
                        title="Top Clicked Product"
                        value={analytics.products.topClicked[0]?.name || 'N/A'}
                        icon={<MousePointer className="h-5 w-5 text-cyan-500" />}
                        sub={`${analytics.products.topClicked[0]?.clicks || 0} clicks`}
                    />
                    <StatCard
                        title="Top Category"
                        value={analytics.products.byCategory[0]?.name || 'N/A'}
                        icon={<Package className="h-5 w-5 text-green-500" />}
                        sub={`${analytics.products.byCategory[0]?.value || 0} products`}
                    />
                    <StatCard
                        title="Top Company"
                        value={analytics.companies.topByProductCount[0]?.name || 'N/A'}
                        icon={<Building2 className="h-5 w-5 text-purple-500" />}
                        sub={`${analytics.companies.topByProductCount[0]?.products || 0} products`}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
