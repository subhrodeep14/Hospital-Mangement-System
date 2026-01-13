import React from "react";
import { Calendar, AlertTriangle, Users, ArrowRightCircle } from "lucide-react";
import { Ticket } from "../types";



const priorityStyles: Record<Ticket["priority"], string> = {
  Low: "bg-emerald-100 text-emerald-800",
  Medium: "bg-amber-100 text-amber-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-rose-100 text-rose-800",
};

const statusStyles: Record<Ticket["status"], string> = {
  Open: "bg-sky-200 text-sky-900",
  "In Progress": "bg-indigo-200 text-indigo-900",
  Pending: "bg-slate-200 text-slate-900",
  Resolved: "bg-emerald-200 text-emerald-900",
  Closed: "bg-gray-200 text-gray-900",

};

const ReviewList = () => {
  const pending = tickets.filter((ticket) => ticket.status === "Pending");
  const criticalCount = tickets.filter((ticket) => ticket.priority === "Critical").length;
  const highCount = tickets.filter((ticket) => ticket.priority === "High").length;
  const oldest = tickets.reduce<Ticket | null>((currentOldest, next) => {
    if (!currentOldest) return next;
    return new Date(next.createdAt) < new Date(currentOldest.createdAt) ? next : currentOldest;
  }, null);
  const sortedTickets = [...tickets].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (tickets.length === 0) {
    return (
      <div className="min-h-screen ml-[300px] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6">
        <div className=" max-w-7xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur shadow-2xl">
          <AlertTriangle className="mx-auto mb-6 h-14 w-14 text-white" />
          <h1 className="text-3xl font-semibold text-white">Nothing waiting</h1>
          <p className="mt-3 text-slate-300">
            No tickets are pending review. New submissions will instantly appear here when ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-12">
      <div className="flex w-full flex-col gap-12 px-6 sm:px-10 lg:px-16">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Review desk</p>
          <div className="flex flex-col gap-1 text-white">
            <h1 className="text-4xl font-semibold">All Service Tickets</h1>
            <p className="text-slate-300">{tickets.length} ticket{tickets.length === 1 ? "" : "s"} generated. {pending.length} still awaiting review.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white">
              <p className="text-sm text-slate-300">Critical</p>
              <p className="text-3xl font-semibold">{criticalCount}</p>
              <p className="text-xs text-slate-400">Need immediate response</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white">
              <p className="text-sm text-slate-300">High priority</p>
              <p className="text-3xl font-semibold">{highCount}</p>
              <p className="text-xs text-slate-400">At risk of escalation</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white">
              <p className="text-sm text-slate-300">Oldest ticket</p>
              <p className="text-lg font-semibold leading-tight">{oldest?.title ?? ""}</p>
              <p className="text-xs text-slate-400">Since {oldest ? new Date(oldest.createdAt).toLocaleDateString() : "-"}</p>
            </div>
          </div>
        </header>

        <div className="grid gap-6">
          {sortedTickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => onSelect(ticket)}
              className="group w-full rounded-[32px] border border-white/10 bg-white/5 p-8 text-left text-white shadow-xl transition hover:bg-white/10 hover:shadow-2xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                <span className={`rounded-full px-3 py-1 font-semibold ${priorityStyles[ticket.priority]}`}>
                  {ticket.priority}
                </span>
                <span className={`rounded-full px-3 py-1 font-semibold ${statusStyles[ticket.status]}`}>
                  {ticket.status}
                </span>
                <span className="flex items-center gap-2 text-slate-300">
                  <Calendar className="h-4 w-4" />
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-semibold leading-tight">{ticket.title}</h2>
              <p className="mt-3 max-h-32 overflow-auto text-slate-200">{ticket.description}</p>

              <div className="mt-6 flex flex-wrap gap-6 text-slate-200">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {ticket.department}
                </span>
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {ticket.category}
                </span>
                {ticket.assignedTo && (
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Assigned to {ticket.assignedTo}
                  </span>
                )}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Raised by</p>
                  <p className="text-lg font-medium text-white">{ticket.createdBy}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-emerald-300 font-semibold">
                  Review now
                  <ArrowRightCircle className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
