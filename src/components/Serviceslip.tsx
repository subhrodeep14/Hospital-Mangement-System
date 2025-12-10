import React, { useMemo, useState } from 'react';
import { Ticket } from '../types';
import { X, CalendarClock, Building2, User, FileText } from 'lucide-react';

interface ServiceSlipProps {
	ticket: Ticket | null;
	onClose: () => void;
	onAccept: (updated: Ticket) => void;
	onDecline: (updated: Ticket) => void;
}

const FALLBACK_UNIT = 'NGHC – SILIGURI';
// service status pill styles
const statusPill = (status: string) => {
	switch (status) {
		case 'Resolved':
			return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
		case 'In Progress':
			return 'bg-blue-100 text-blue-700 border border-blue-200';
		case 'Pending':
		case 'Review Pending':
			return 'bg-amber-100 text-amber-700 border border-amber-200';
		case 'Closed':
			return 'bg-slate-100 text-slate-600 border border-slate-200';
		default:
			return 'bg-rose-100 text-rose-700 border border-rose-200';
	}
};

const ServiceSlip: React.FC<ServiceSlipProps> = ({ ticket, onClose, onAccept, onDecline }) => {
	const [actionDate, setActionDate] = useState(() => new Date().toISOString().slice(0, 16));
	const [remarks, setRemarks] = useState('');

	const postedDate = useMemo(() => {
		if (!ticket?.createdAt) return '—';
		return new Date(ticket.createdAt).toLocaleString('en-IN', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	}, [ticket?.createdAt]);

	if (!ticket) return null;

	const handleAccept = () => {
		onAccept({ ...ticket, status: 'In Progress' });
		onClose();
	};

	const handleDecline = () => {
		onDecline({ ...ticket, status: 'Pending' });
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6">
			<div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl">
				<div className="flex items-center justify-between border-b border-slate-100 px-8 py-6">
					<div>
						<p className="text-sm uppercase tracking-[0.3em] text-slate-400">Service Call Slip</p>
						<h2 className="text-2xl font-semibold text-slate-900 mt-1">Ticket #{ticket.id}</h2>
					</div>
					<button
						onClick={onClose}
						className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
						aria-label="Close"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="px-8 py-6 space-y-6">
					<div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 md:grid-cols-2">
						<div className="flex items-center gap-3">
							<FileText className="h-4 w-4 text-slate-400" />
							<span>
								<strong className="text-slate-900">Ticket Number :</strong> #{ticket.id}
							</span>
						</div>
						<div className="flex items-center gap-3">
							<Building2 className="h-4 w-4 text-slate-400" />
							<span>
								<strong className="text-slate-900">Unit Name :</strong> {ticket.department || FALLBACK_UNIT}
							</span>
						</div>
					</div>

					<div className="grid gap-6 text-sm text-slate-700 md:grid-cols-2">
						<div className="space-y-3">
							<p>
								<strong className="text-slate-900">Posted Date:</strong> {postedDate}
							</p>
							<p>
								<strong className="text-slate-900">Description:</strong> {ticket.description || 'No description provided.'}
							</p>
							<p>
								<strong className="text-slate-900">Room No:</strong> {ticket.assignedTo ? `${ticket.assignedTo.split(' ')[0]} Bay` : 'N/A'}
							</p>
							<p>
								<strong className="text-slate-900">Accepted or Declined By:</strong> {ticket.assignedTo || 'Unassigned'}
							</p>
						</div>

						<div className="space-y-3">
							<p className="text-rose-600 font-semibold">
								<strong className="text-slate-900">Service Request For:</strong> {ticket.title}
							</p>
							<p>
								<strong className="text-slate-900">Department:</strong> {ticket.department}
							</p>
							<p>
								<strong className="text-slate-900">Bed No:</strong> N/A
							</p>
							<p>
								<strong className="text-slate-900">Remarks:</strong> {remarks || '—'}
							</p>
						</div>
					</div>

					<div className="grid gap-4 rounded-2xl border border-slate-100 p-4 text-sm text-slate-700 md:grid-cols-3">
						<p>
							<strong className="text-slate-900">Requested by:</strong> {ticket.createdBy}
						</p>
						<p>
							<strong className="text-slate-900">Floor No:</strong> L2
						</p>
						<div className="flex items-center gap-2">
							<strong className="text-slate-900">Call Status:</strong>
							<span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusPill(ticket.status)}`}>
								{ticket.status}
							</span>
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-[1fr,1fr]">
						<label className="flex flex-col gap-2 text-sm text-slate-700">
							<span className="font-semibold text-slate-900">Date & Time of Accept/Decline</span>
							<div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-2">
								<CalendarClock className="h-5 w-5 text-slate-400" />
								<input
									type="datetime-local"
									value={actionDate}
									onChange={(e) => setActionDate(e.target.value)}
									className="flex-1 bg-transparent text-slate-900 focus:outline-none"
								/>
							</div>
						</label>

						<label className="flex flex-col gap-2 text-sm text-slate-700">
							<span className="font-semibold text-slate-900">Remarks</span>
							<textarea
								value={remarks}
								onChange={(e) => setRemarks(e.target.value)}
								rows={3}
								className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none"
								placeholder="Add any notes for the engineer"
							/>
						</label>
					</div>
				</div>

				<div className="flex flex-col gap-3 border-t border-slate-100 px-8 py-6 md:flex-row md:items-center md:justify-end">
					<div className="flex flex-1 flex-wrap items-center gap-3 text-sm text-slate-500 md:justify-start">
						<div className="inline-flex items-center gap-2">
							<User className="h-4 w-4 text-slate-400" />
							<span>Logged by {ticket.createdBy}</span>
						</div>
						<div className="inline-flex items-center gap-2">
							<FileText className="h-4 w-4 text-slate-400" />
							<span>Category: {ticket.category}</span>
						</div>
					</div>

					<div className="flex flex-wrap justify-end gap-3">
						<button
							onClick={handleAccept}
							className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
						>
							Accept
						</button>
						<button
							onClick={handleDecline}
							className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-6 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
						>
							Decline
						</button>
						<button
							onClick={onClose}
							className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ServiceSlip;

