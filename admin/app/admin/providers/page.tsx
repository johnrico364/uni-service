"use client";

import { useState, useMemo } from "react";

interface Provider {
  id: number;

  business_name: string;
  service_category: string;
  description: string;
  verification_status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const mockProviders: Provider[] = [
  {
    id: 1,
    business_name: "Fast Delivery Co",
    service_category: "Home Services",
    description: "Fast and reliable same-day delivery service",
    verification_status: "approved",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    business_name: "Drone Express",
    service_category: "Health & Wellness",
    description: "Innovative drone delivery for quick transport",
    verification_status: "approved",
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    business_name: "Standard Logistics",
    service_category: "Automotive Services",
    description: "Affordable standard delivery across the region",
    verification_status: "approved",
    createdAt: "2023-12-20",
  },
  {
    id: 4,
    business_name: "Express Shipping Inc",
    service_category: "Professional & Freelance Services",
    description: "Premium express shipping with tracking",
    verification_status: "approved",
    createdAt: "2024-02-01",
  },
  {
    id: 5,
    business_name: "Quick Logistics",
    service_category: "Events & Entertainment",
    description: "Quick and efficient logistics solutions",
    verification_status: "pending",
    createdAt: "2024-03-15",
  },
  {
    id: 6,
    business_name: "Reliable Couriers",
    service_category: "Education & Tutoring",
    description: "Trusted courier service for all needs",
    verification_status: "approved",
    createdAt: "2024-01-05",
  },
  {
    id: 7,
    business_name: "Sky Logistics",
    service_category: "Pet Care",
    description: "Advanced drone technology for deliveries",
    verification_status: "approved",
    createdAt: "2024-02-10",
  },
  {
    id: 8,
    business_name: "Metro Delivery",
    service_category: "Maintenance & Technical Services",
    description: "Metropolitan express shipping services",
    verification_status: "rejected",
    createdAt: "2023-11-15",
  },
];

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredProviders = useMemo(() => {
    return mockProviders.filter((provider) => {
      const matchesSearch =
        provider.business_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        provider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.service_category
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesService =
        serviceFilter === "All" || provider.service_category === serviceFilter;
      const matchesStatus =
        statusFilter === "All" || provider.verification_status === statusFilter;

      return matchesSearch && matchesService && matchesStatus;
    });
  }, [searchTerm, serviceFilter, statusFilter]);

  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProviders = filteredProviders.slice(
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
      case "approved":
        return "badge badge-success text-[13px]";
      case "rejected":
        return "badge badge-error text-[13px]";
      case "pending":
        return "badge badge-warning text-[13px]";
      default:
        return "badge";
    }
  };

  const categories = [
    "All",
    ...new Set(mockProviders.map((provider) => provider.service_category)),
  ];

  return (
    <div className="overflow-auto text-[13px] pb-5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">
          Service Providers Management
        </h1>
        <p className="text-gray-600">
          Total Providers: {filteredProviders.length} of {mockProviders.length}
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
              placeholder="Search by name, categorty, or description..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Service Filter */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Service</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
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
              <option>approved</option>
              <option>pending</option>
              <option>rejected</option>
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
                <th></th>
                <th className="font-bold">Business Name</th>
                <th className="font-bold">Service Category</th>
                <th className="font-bold">Description</th>
                <th className="font-bold">Verification Status</th>
                <th className="font-bold">Created Date</th>
                <th className="font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProviders.length > 0 ? (
                paginatedProviders.map((provider) => (
                  <tr key={provider.id}>
                    <td>{provider.id}</td>

                    <td className="font-semibold">{provider.business_name}</td>
                    <td>{provider.service_category}</td>
                    <td>{provider.description}</td>
                    <td>
                      <span
                        className={getStatusBadgeColor(
                          provider.verification_status
                        )}
                      >
                        {provider.verification_status}
                      </span>
                    </td>
                    <td>{provider.createdAt}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-xs btn-info text-[13px]">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No providers found
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
            {Math.min(startIndex + itemsPerPage, filteredProviders.length)} of{" "}
            {filteredProviders.length} providers
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
