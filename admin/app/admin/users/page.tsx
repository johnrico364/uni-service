"use client";

import { useState, useMemo } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "Active" | "Inactive" | "Pending";
  joinDate: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    phone: "09123456789",
    role: "Customer",
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "09998887777",
    role: "Service Provider",
    status: "Active",
    joinDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike@example.com",
    phone: "09112223333",
    role: "Customer",
    status: "Inactive",
    joinDate: "2023-12-10",
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma@example.com",
    phone: "09223334444",
    role: "Customer",
    status: "Active",
    joinDate: "2024-03-05",
  },
  {
    id: 5,
    name: "Alex Brown",
    email: "alex@example.com",
    phone: "09334445555",
    role: "Service Provider",
    status: "Pending",
    joinDate: "2024-04-01",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "laisa@example.com",
    phone: "09332445555",
    role: "Customer",
    status: "Active",
    joinDate: "2024-01-22",
  },
  {
    id: 7,
    name: "David Martinez",
    email: "david@example.com",
    phone: "09112413333",
    role: "Service Provider",
    status: "Active",
    joinDate: "2024-02-14",
  },
  {
    id: 8,
    name: "Jennifer Garcia",
    email: "jennifer@example.com",
    phone: "09992187777",
    role: "Customer",
    status: "Inactive",
    joinDate: "2023-11-30",
  },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm);

      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "badge badge-success text-[13px]";
      case "Inactive":
        return "badge badge-error text-[13px]";
      case "Pending":
        return "badge badge-warning text-[13px]";
      default:
        return "badge";
    }
  };

  return (
    <div className="overflow-auto text-[13px] h-full pb-5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Users Management</h1>
        <p className="text-gray-600">
          Total Users: {filteredUsers.length} of {mockUsers.length}
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-base-100 border border-base-300 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">Search</span>
            </label>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Role</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option>All</option>
              <option>Customer</option>
              <option>Service Provider</option>
              <option>Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Status</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Pending</option>
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
                <th className="font-bold"></th>
                <th className="font-bold">Name</th>
                <th className="font-bold">Email</th>
                <th className="font-bold">Phone</th>
                <th className="font-bold">Role</th>
                <th className="font-bold">Status</th>
                <th className="font-bold">Join Date</th>
                <th className="font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td className="font-semibold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={getStatusBadgeColor(user.status)}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.joinDate}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-xs text-[13px] btn-info">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No users found
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
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
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
