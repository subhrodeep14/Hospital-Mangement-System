import React, { useEffect, useMemo, useState } from 'react';
import { Ticket, Equipment } from '../types';
import { TICKET_CATEGORIES } from '../constants/category';
import {
	Plus,
	Search,
	Filter,
	Eye,
	Clock,
	Calendar,
	AlertTriangle,
	CheckCircle,
	User,
	Tag,
	FileText,
} from 'lucide-react';

import AddTicketModal from './AddTicketModal';
import TicketDetailsModal from './TicketDetailsModal';


interface TicketManagementProps {
	tickets: Ticket[];
	equipments: Equipment[];
	onAddTicket: (ticket: Ticket) => void | Promise<void>;
	onUpdateTicket: (ticket: Ticket) => void;
	onSlip: (ticket: Ticket) => void;
}


const statusOptions = ['all', 'Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];
const priorityOptions = ['all', 'Low', 'Medium', 'High', 'Critical'];

const filterToneClasses = {
	blue: 'bg-blue-50 text-blue-700 border-blue-100',
	red: 'bg-red-50 text-red-700 border-red-100',
	slate: 'bg-slate-50 text-slate-700 border-slate-100',
	green: 'bg-green-50 text-green-700 border-green-100',
} as const;

type FilterTone = keyof typeof filterToneClasses;

const TicketManagement: React.FC<TicketManagementProps> = ({
	tickets,
	equipments,
	onAddTicket,
	onUpdateTicket,
	onSlip,
}) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [priorityFilter, setPriorityFilter] = useState<string>('all');
	const [categoryFilter, setCategoryFilter] = useState<string>('all');
	const [showAddModal, setShowAddModal] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	
	const filteredTickets = useMemo(() => {
		return tickets.filter((ticket) => {
			const matchesSearch =
				ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ;

			const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
			const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
			const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;

			return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
		});
	}, [tickets, searchTerm, statusFilter, priorityFilter, categoryFilter]);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-IN', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getTimeAgo = (dateString: string) => {
		const now = new Date();
		const date = new Date(dateString);
		const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

		if (diffInHours < 1) return 'Just now';
		if (diffInHours < 24) return `${diffInHours}h ago`;
		return `${Math.floor(diffInHours / 24)}d ago`;
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'Critical':
				return 'bg-red-100 text-red-700 border-red-200';
			case 'High':
				return 'bg-orange-100 text-orange-700 border-orange-200';
			case 'Medium':
				return 'bg-yellow-100 text-yellow-700 border-yellow-200';
			case 'Low':
				return 'bg-green-100 text-green-700 border-green-200';
			default:
				return 'bg-gray-100 text-gray-700 border-gray-200';
		}
	};

	const getStatusDotColor = (status: string) => {
		switch (status) {
			case 'Open':
				return 'bg-blue-500';
			case 'In Progress':
				return 'bg-purple-500';
			case 'pending':
				return 'bg-yellow-500';
			case 'Review Pending':
				return 'bg-yellow-500';
			case 'Resolved':
				return 'bg-green-500';
			case 'Closed':
				return 'bg-gray-400';
			default:
				return 'bg-gray-400';
		}
	};
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Open':
				return 'text-blue-700 bg-blue-50';
			case 'In Progress':
				return 'text-purple-700 bg-purple-50';
			case 'Pending':
			case 'Review Pending':
				return 'text-yellow-700 bg-yellow-50';
			case 'Resolved':
				return 'text-green-700 bg-green-50';
			case 'Closed':
				return 'text-gray-700 bg-gray-100';
			default:
				return 'text-gray-700 bg-gray-50';
		}
	};

	const statCards = [
		{
			title: 'Total Tickets',
			value: tickets.length,
			accent: 'from-blue-500/80 to-blue-600',
			icon: <Tag className="w-6 h-6 text-white" />,
			onClick: () => {
				setStatusFilter('all');
				setPriorityFilter('all');
				setCategoryFilter('all');
			},
		},
		{
			title: 'Open',
			value: tickets.filter((t) => t.status === 'Open').length,
			accent: 'from-sky-500 to-blue-600',
			icon: <Clock className="w-6 h-6 text-white" />,
			onClick: () => setStatusFilter('Open'),
		},
		{
			title: 'In Progress',
			value: tickets.filter((t) => t.status === 'In Progress').length,
			accent: 'from-purple-500 to-indigo-600',
			icon: <Clock className="w-6 h-6 text-white" />,
			onClick: () => setStatusFilter('In Progress'),
		},
		{
			title: 'Pending',
			value: tickets.filter((t) => t.status === 'Pending').length,
			accent: 'from-amber-400 to-orange-500',
			icon: <Calendar className="w-6 h-6 text-white" />,
			onClick: () => setStatusFilter('Pending'),
		},
		{
			title: 'Resolved',
			value: tickets.filter((t) => t.status === 'Resolved').length,
			accent: 'from-emerald-500 to-green-600',
			icon: <CheckCircle className="w-6 h-6 text-white" />,
			onClick: () => setStatusFilter('Resolved'),
		},
		{
			title: 'Closed',
			value: tickets.filter((t) => t.status === 'Closed').length,
			accent: 'from-rose-500 to-pink-600',
			icon: <AlertTriangle className="w-6 h-6 text-white" />,
			onClick: () => setStatusFilter('Closed'),
		},
	];

	const handleViewTicket = (ticket: Ticket | null) => {
		setSelectedTicket(ticket);
		setShowDetailsModal(Boolean(ticket));
	};






	const activeFilters = [
		statusFilter !== 'all' && { label: `Status: ${statusFilter}`, tone: 'blue' as FilterTone },
		priorityFilter !== 'all' && { label: `Priority: ${priorityFilter}`, tone: 'red' as FilterTone },
		categoryFilter !== 'all' && { label: `Category: ${categoryFilter}`, tone: 'slate' as FilterTone },
		searchTerm && { label: `Search: "${searchTerm}"`, tone: 'green' as FilterTone },
	].filter(Boolean) as { label: string; tone: FilterTone }[];

	return (
		<div className="min-h-screen  bg-gradient-to-b text-md from-slate-50 to-white py-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-2xl shadow-sm  p-6 mb-2 border-2 border-blue-100 ring-1 ring-blue-100">
					<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between ">
						<div>
							<p className="text-sm uppercase tracking-[0.3em] text-blue-500 font-semibold">Operations</p>
							<h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Ticket Management</h1>
							<p className="text-slate-500 mt-2">Monitor incidents, triage requests, and keep wards running smoothly.</p>
						</div>
						<button
							onClick={() => setShowAddModal(true)}
							className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-white font-semibold shadow-lg shadow-blue-500/20 transition hover:shadow-blue-500/40 focus:outline-none focus:ring-4 focus:ring-blue-200"
						>
							<Plus className="w-5 h-5" />
							Raise Ticket
						</button>
					</div>
				</div>


				<div className="space-y-10 divide-y divide-slate-200">
					<section className="pt-2">
						<div className="rounded-2xl border-2 border-blue-100 bg-white/80 p-4 shadow-sm">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
								{statCards.map((card) => (
									<button
										key={card.title}
										onClick={card.onClick}
										className="w-full rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-200 group text-left relative"
									>
										<div className="p-5 flex items-start justify-between">
											<div>
												<p className="text-slate-500 text-sm">{card.title}</p>
												<p className="text-3xl font-bold text-slate-900 mt-1">{card.value}</p>
											</div>
											<div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center shadow-inner`}>
												{card.icon}
											</div>
										</div>
										<div className="absolute inset-x-3 bottom-3 h-1 rounded-full bg-gradient-to-r from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition" />
									</button>
								))}
							</div>
						</div>
					</section>

					<section className="pt-2">
						<div className="bg-white rounded-2xl border-2 border-indigo-100 ring-1 ring-indigo-50 shadow-sm p-6 space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="relative">
									<Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
									<input
										type="text"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										placeholder="Search by title, description, owner..."
										className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white"
									/>
								</div>

								<div className="flex flex-wrap gap-2 md:col-span-2">
									{statusOptions.map((option) => (
										<button
											key={option}
											onClick={() => setStatusFilter(option)}
											className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
												statusFilter === option
													? 'bg-blue-600 text-white border-blue-600 shadow-sm'
													: 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
											}`}
										>
											{option === 'all' ? 'All Status' : option}
										</button>
									))}
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="flex flex-wrap gap-2 md:col-span-2">
									{priorityOptions.map((option) => (
										<button
											key={option}
											onClick={() => setPriorityFilter(option)}
											className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
												priorityFilter === option
													? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
													: 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
											}`}
										>
											{option === 'all' ? 'All Priorities' : option}
										</button>
									))}
								</div>

								<div className="flex gap-2 flex-wrap">
									<button
										onClick={() => setCategoryFilter('all')}
										className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
											categoryFilter === 'all'
												? 'bg-slate-900 text-white border-slate-900'
												: 'bg-white border-slate-200 text-slate-600'
										}`}
									>
										All Categories
									</button>
									{TICKET_CATEGORIES.map((category) => (
										<button
											key={category}
											onClick={() => setCategoryFilter(category)}
											className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
												categoryFilter === category
													? 'bg-slate-900 text-white border-slate-900'
													: 'bg-white border-slate-200 text-slate-600'
											}`}
										>
											{category}
										</button>
									))}
								</div>
							</div>

							<div className="flex flex-wrap items-center justify-between gap-3">
								<div className="flex flex-wrap gap-2">
									{activeFilters.length === 0 && <span className="text-sm text-slate-500">No active filters</span>}
									{activeFilters.map((filter) => (
										<span
											key={filter.label}
											className={`px-3 py-1 rounded-full text-xs font-semibold border ${filterToneClasses[filter.tone]}`}
										>
											{filter.label}
										</span>
									))}
								</div>
								<button
									onClick={() => {
										setStatusFilter('all');
										setPriorityFilter('all');
										setCategoryFilter('all');
										setSearchTerm('');
									}}
									className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
								>
									<Filter className="w-4 h-4" />
									Clear Filters
								</button>
							</div>
						</div>
					</section>

					<section className="pt-10 space-y-6">
					<div className="space-y-4 md:hidden">
						{filteredTickets.map((ticket) => (
							<div key={ticket.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
								<div className="flex flex-wrap items-start gap-3">
									<div className="flex-1">
										<p className="text-sm uppercase tracking-wide text-slate-400">{ticket.department}</p>
										<h3 className="text-lg font-semibold text-slate-900">{ticket.title}</h3>
										<p className="text-sm text-slate-500 mt-1">{ticket.description}</p>
									</div>
									<span className={`px-3 py-1 rounded-full border text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
										{ticket.priority}
									</span>
								</div>

								<div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
									<span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
										<Tag className="h-3.5 w-3.5" />
										{ticket.category}
									</span>
									<span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-600">
										<User className="h-3.5 w-3.5" />
										{ticket.assignedTo || 'Unassigned'}
									</span>
									<span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${getStatusColor(ticket.status)} border border-slate-100`}>
										<span className={`h-2 w-2 rounded-full ${getStatusDotColor(ticket.status)}`} />
										{ticket.status}
									</span>
								</div>

								<div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
									<div>
										<p className="text-xs uppercase tracking-wide text-slate-400">Created</p>
										<p className="text-sm font-semibold text-slate-900">{getTimeAgo(ticket.createdAt)}</p>
										<p className="text-xs text-slate-400">{formatDate(ticket.createdAt)}</p>
									</div>
									<div className="flex flex-wrap items-center gap-2">
										<button
											onClick={() => handleViewTicket(ticket)}
											className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600"
										>
											<Eye className="h-4 w-4" />
											View
										</button>
										<button
											onClick={() => onSlip(ticket)}
											className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-500 hover:text-blue-600 hover:border-blue-300"
											title="Service call slip"
										>
											<FileText className="h-4 w-4" />
											<span className="sr-only">Service call slip</span>
										</button>
									</div>
								</div>
							</div>
						))}
						{filteredTickets.length === 0 && (
							<div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
								No tickets match the current filters.
							</div>
						)}
					</div>

						<div className="hidden md:block">
							<div className="bg-white rounded-2xl border-2 border-slate-200 ring-1 ring-slate-100 shadow-sm overflow-x-auto">
							<table className="w-full table-auto">
								<thead>
									<tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
										<th className="px-6 py-4">Ticket</th>
										<th className="px-6 py-4">Category</th>
										<th className="px-6 py-4">Priority</th>
										<th className="px-6 py-4">Status</th>
										<th className="px-6 py-4">Assigned To</th>
										<th className="px-6 py-4">Created</th>
										<th className="px-6 py-4 text-right">Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{filteredTickets.map((ticket) => (
										<tr key={ticket.id} className="hover:bg-slate-50/60 transition">
											<td className="px-6 py-4 align-top">
												<p className="font-semibold text-slate-900">{ticket.title}</p>
												<p className="text-sm text-slate-500 mt-1 line-clamp-2">{ticket.description}</p>
												<div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
													<User className="w-4 h-4" />
												
													<span className="text-slate-300">•</span>
													<span>{ticket.department}</span>
												</div>
											</td>
											<td className="px-6 py-4 align-top">
												<span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">{ticket.category}</span>
											</td>
											<td className="px-6 py-4 align-top">
												<span className={`px-3 py-1 rounded-full border text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
													{ticket.priority}
												</span>
											</td>
											<td className="px-6 py-4 align-top">
												<div className="flex items-center gap-2">
													<span className={`w-2 h-2 rounded-full ${getStatusDotColor(ticket.status)}`} />
													<span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
														{ticket.status}
													</span>
												</div>
											</td>
											<td className="px-6 py-4 align-top">
												{ticket.assignedTo ? (
													<div className="flex items-center gap-3">
														<div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-semibold">
															{ticket.assignedTo
																.split(' ')
																.map((part) => part.charAt(0))
																.join('')
																.slice(0, 2)}
														</div>
														<div>
															<p className="text-sm font-semibold text-slate-900">{ticket.assignedTo}</p>
															<p className="text-xs text-slate-400">Owner</p>
														</div>
													</div>
												) : (
													<span className="text-slate-400 text-sm">Unassigned</span>
												)}
											</td>
											<td className="px-6 py-4 align-top">
												<p className="text-sm font-semibold text-slate-900">{getTimeAgo(ticket.createdAt)}</p>
												<p className="text-xs text-slate-400">{formatDate(ticket.createdAt)}</p>
											</td>
											<td className="px-6 py-4 align-top text-right">
												<div className="flex justify-end gap-3">
													<button
														onClick={() => handleViewTicket(ticket)}
														className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100"
													>
														<Eye className="w-4 h-4" />
														View
													</button>
													<button
														onClick={() => onSlip(ticket)}
														className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-500 hover:text-blue-600 hover:border-blue-300"
														title="Service call slip"
													>
														<FileText className="w-4 h-4" />
														<span className="sr-only">Service call slip</span>
													</button>
												</div>
											</td>
										</tr>
									))}
									{filteredTickets.length === 0 && (
										<tr>
											<td colSpan={7} className="px-6 py-16 text-center text-slate-500">
												No tickets match the current filters.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</section>
				</div>

				{showAddModal && (
					<AddTicketModal
						isOpen={showAddModal}
						onClose={() => setShowAddModal(false)}
						onSubmit={onAddTicket}
						equipments={equipments}
					/>
				)}

				{showDetailsModal && selectedTicket && (
					<TicketDetailsModal
						isOpen={showDetailsModal}
						onClose={() => handleViewTicket(null)}
						ticket={selectedTicket}
						onUpdate={onUpdateTicket}
						equipments={equipments}
					/>
				)}
			</div>
		</div> 
	);
};

export default TicketManagement;

