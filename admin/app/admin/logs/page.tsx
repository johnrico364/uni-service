"use client";

import { useState, useMemo } from "react";

interface AdminLog {
  log_id: string;
  admin_id: string;
  action: string;
  details: string;
  created_at: string;
}

const mockLogs: AdminLog[] = [
  {
    log_id: "LOG-001",
    admin_id: "ADMIN-001",
    action: "Create",
    details: "Created new service: Electrical Installation",
    created_at: "2024-12-09T14:32:45",
  },
  {
    log_id: "LOG-002",
    admin_id: "ADMIN-002",
    action: "Update",
    details: "Updated drone maintenance schedule for Drone #01",
    created_at: "2024-12-09T13:15:20",
  },
  {
    log_id: "LOG-003",
    admin_id: "ADMIN-001",
    action: "Delete",
    details: "Deleted inactive user account: test_user_123",
    created_at: "2024-12-09T12:45:10",
  },
  {
    log_id: "LOG-004",
    admin_id: "ADMIN-003",
    action: "Export",
    details: "Exported revenue report as PDF",
    created_at: "2024-12-09T11:30:55",
  },
  {
    log_id: "LOG-005",
    admin_id: "ADMIN-002",
    action: "Update",
    details: "Updated payment settings",
    created_at: "2024-12-08T16:20:30",
  },
  {
    log_id: "LOG-006",
    admin_id: "ADMIN-001",
    action: "Create",
    details: "Created new appointment template",
    created_at: "2024-12-08T15:10:15",
  },
  {
    log_id: "LOG-007",
    admin_id: "ADMIN-003",
    action: "Export",
    details: "Exported user activity report as CSV",
    created_at: "2024-12-08T14:05:40",
  },
  {
    log_id: "LOG-008",
    admin_id: "ADMIN-001",
    action: "Update",
    details: "Modified drone battery thresholds",
    created_at: "2024-12-08T13:45:25",
  },
  {
    log_id: "LOG-009",
    admin_id: "ADMIN-002",
    action: "Create",
    details: "Added new service provider: John Plumber",
    created_at: "2024-12-07T10:30:00",
  },
  {
    log_id: "LOG-010",
    admin_id: "ADMIN-001",
    action: "Delete",
    details: "Removed expired promotional offer",
    created_at: "2024-12-07T09:15:45",
  },
  {
    log_id: "LOG-011",
    admin_id: "ADMIN-003",
    action: "Update",
    details: "Updated system settings for drone operations",
    created_at: "2024-12-07T08:50:20",
  },
  {
    log_id: "LOG-012",
    admin_id: "ADMIN-002",
    action: "Export",
    details: "Generated appointment summary report",
    created_at: "2024-12-06T17:25:30",
  },
];

const actions = ["All", ...new Set(mockLogs.map((log) => log.action))];

export default function LogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.admin_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.log_id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction =
        actionFilter === "All" || log.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [searchTerm, actionFilter, logs]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "Create":
        return "badge badge-success text-[13px]";
      case "Update":
        return "badge badge-warning text-[13px]";
      case "Delete":
        return "badge badge-error text-[13px]";
      case "Export":
        return "badge badge-primary text-[13px]";
      default:
        return "badge";
    }
  };

  return (
    <div className="overflow-auto text-[13px] h-full pb-5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Admin Logs</h1>
        <p className="text-gray-600">
          Total Logs: {filteredLogs.length} of {logs.length}
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-base-100 border border-base-300 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">Search</span>
            </label>
            <input
              type="text"
              placeholder="Search by admin ID, log ID, or details..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Action Filter */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Action</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              {actions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-[13px]">
            <thead>
              <tr className="bg-base-200">
                <th className="font-bold">Log ID</th>
                <th className="font-bold">Admin ID</th>
                <th className="font-bold">Action</th>
                <th className="font-bold">Details</th>
                <th className="font-bold">Created At</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <tr key={log.log_id}>
                    <td className="font-semibold">{log.log_id}</td>
                    <td className="font-semibold">{log.admin_id}</td>
                    <td>
                      <span className={getActionBadgeColor(log.action)}>
                        {log.action}
                      </span>
                    </td>
                    <td className="max-w-xs truncate">{log.details}</td>
                    <td className="text-[12px]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing {paginatedLogs.length === 0 ? 0 : startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of{" "}
            {filteredLogs.length} logs
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold w-60">
              Items per page:
            </label>
            <select
              className="select select-bordered select-sm"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
        <div className="join">
          <button
            className="join-item btn btn-sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`join-item btn btn-sm ${
                currentPage === page ? "btn-active" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="join-item btn btn-sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
