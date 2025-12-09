"use client";

import { useState, useMemo } from "react";

interface Payment {
  id: number;
  transactionId: string;
  orderId: number;
  amount: number;
  paymentMethod: "GCash" | "Cash on Delivery";
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  customerName: string;
  serviceName: string;
  paymentDate: string;
  dueDate: string;
}

const mockPayments: Payment[] = [
  {
    id: 1,
    transactionId: "TXN-001",
    orderId: 101,
    amount: 2500,
    paymentMethod: "GCash",
    status: "Completed",
    customerName: "John Smith",
    serviceName: "Plumbing Repair",
    paymentDate: "2024-12-01",
    dueDate: "2024-12-01",
  },
  {
    id: 2,
    transactionId: "TXN-002",
    orderId: 102,
    amount: 5000,
    paymentMethod: "Cash on Delivery",
    status: "Completed",
    customerName: "Sarah Johnson",
    serviceName: "Electrical Installation",
    paymentDate: "2024-12-02",
    dueDate: "2024-12-02",
  },
  {
    id: 3,
    transactionId: "TXN-003",
    orderId: 103,
    amount: 1500,
    paymentMethod: "GCash",
    status: "Pending",
    customerName: "Mike Wilson",
    serviceName: "AC Maintenance",
    paymentDate: "2024-12-03",
    dueDate: "2024-12-05",
  },
  {
    id: 4,
    transactionId: "TXN-004",
    orderId: 104,
    amount: 3000,
    paymentMethod: "Cash on Delivery",
    status: "Completed",
    customerName: "Emma Davis",
    serviceName: "Pest Control",
    paymentDate: "2024-12-04",
    dueDate: "2024-12-04",
  },
  {
    id: 5,
    transactionId: "TXN-005",
    orderId: 105,
    amount: 2000,
    paymentMethod: "GCash",
    status: "Failed",
    customerName: "Alex Brown",
    serviceName: "Wall Painting",
    paymentDate: "2024-12-05",
    dueDate: "2024-12-05",
  },
  {
    id: 6,
    transactionId: "TXN-006",
    orderId: 106,
    amount: 1200,
    paymentMethod: "Cash on Delivery",
    status: "Completed",
    customerName: "Lisa Anderson",
    serviceName: "Carpet Cleaning",
    paymentDate: "2024-12-06",
    dueDate: "2024-12-06",
  },
  {
    id: 7,
    transactionId: "TXN-007",
    orderId: 107,
    amount: 1800,
    paymentMethod: "GCash",
    status: "Completed",
    customerName: "David Martinez",
    serviceName: "Water Tank Cleaning",
    paymentDate: "2024-12-07",
    dueDate: "2024-12-07",
  },
  {
    id: 8,
    transactionId: "TXN-008",
    orderId: 108,
    amount: 4000,
    paymentMethod: "Cash on Delivery",
    status: "Refunded",
    customerName: "Jennifer Garcia",
    serviceName: "Door Installation",
    paymentDate: "2024-12-08",
    dueDate: "2024-12-08",
  },
  {
    id: 9,
    transactionId: "TXN-009",
    orderId: 109,
    amount: 6000,
    paymentMethod: "GCash",
    status: "Completed",
    customerName: "John Smith",
    serviceName: "Garden Landscaping",
    paymentDate: "2024-12-09",
    dueDate: "2024-12-09",
  },
  {
    id: 10,
    transactionId: "TXN-010",
    orderId: 110,
    amount: 1400,
    paymentMethod: "Cash on Delivery",
    status: "Pending",
    customerName: "Sarah Johnson",
    serviceName: "Window Repair",
    paymentDate: "2024-12-09",
    dueDate: "2024-12-10",
  },
];

const PAYMENT_METHODS = ["GCash", "Cash on Delivery"];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderId.toString().includes(searchTerm);

      const matchesPaymentMethod =
        paymentMethodFilter === "All" || payment.paymentMethod === paymentMethodFilter;
      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter;

      return matchesSearch && matchesPaymentMethod && matchesStatus;
    });
  }, [searchTerm, paymentMethodFilter, statusFilter, payments]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(
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
      case "Completed":
        return "badge badge-success text-[13px]";
      case "Pending":
        return "badge badge-warning text-[13px]";
      case "Failed":
        return "badge badge-error text-[13px]";
      case "Refunded":
        return "badge badge-info text-[13px]";
      default:
        return "badge";
    }
  };

  const getPaymentMethodBadgeColor = (method: string) => {
    switch (method) {
      case "GCash":
        return "badge badge-primary text-[13px]";
      case "Cash on Delivery":
        return "badge badge-secondary text-[13px]";
      default:
        return "badge";
    }
  };

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="overflow-auto text-[13px] h-full pb-5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Payments Management</h1>
        <p className="text-gray-600">
          Total Payments: {filteredPayments.length} of {payments.length} | Total Amount: ₱{totalAmount.toLocaleString()}
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
              placeholder="Search by transaction ID, order ID, customer name, or service..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Payment Method Filter */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Payment Method</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
            >
              <option>All</option>
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
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
              <option>Completed</option>
              <option>Pending</option>
              <option>Failed</option>
              <option>Refunded</option>
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
                <th className="font-bold">Transaction ID</th>
                <th className="font-bold">Order ID</th>
                <th className="font-bold">Customer</th>
                <th className="font-bold">Service</th>
                <th className="font-bold">Amount</th>
                <th className="font-bold">Payment Method</th>
                <th className="font-bold">Status</th>
                <th className="font-bold">Payment Date</th>
                <th className="font-bold">Due Date</th>
                <th className="font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td className="font-semibold">{payment.transactionId}</td>
                    <td>{payment.orderId}</td>
                    <td>{payment.customerName}</td>
                    <td>{payment.serviceName}</td>
                    <td className="font-semibold">₱{payment.amount.toLocaleString()}</td>
                    <td>
                      <span className={getPaymentMethodBadgeColor(payment.paymentMethod)}>
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeColor(payment.status)}>
                        {payment.status}
                      </span>
                    </td>
                    <td>{payment.paymentDate}</td>
                    <td>{payment.dueDate}</td>
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
                  <td colSpan={11} className="text-center py-4 text-gray-500">
                    No payments found
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
            Showing {paginatedPayments.length === 0 ? 0 : startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredPayments.length)} of{" "}
            {filteredPayments.length} payments
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
