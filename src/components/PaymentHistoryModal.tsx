import {
  X,
  Download,
  Receipt,
  Calendar,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Property } from "./Dashboard";
import { useEffect } from 'react';

interface PaymentHistoryModalProps {
  property: Property;
  onClose: () => void;
}

export function PaymentHistoryModal({
  property,
  onClose,
}: PaymentHistoryModalProps) {
  const history = property.paymentHistory ?? [];
  const totalPaid = history.reduce(

    (sum, payment) => sum + payment.amount,
    0,
  );

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleDownloadReceipt = () => {
    const receiptWindow = window.open("", "_blank");
    if (!receiptWindow) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Receipt - ${property.tenantName}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 40px;
              background: #f5f5f5;
            }
            .receipt {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #8b5cf6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #8b5cf6;
              margin: 0;
              font-size: 32px;
            }
            .header p {
              color: #666;
              margin: 5px 0;
            }
            .info-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
              padding: 20px;
              background: #f9fafb;
              border-radius: 8px;
            }
            .info-item {
              margin-bottom: 10px;
            }
            .info-label {
              color: #666;
              font-size: 14px;
              margin-bottom: 5px;
            }
            .info-value {
              color: #111;
              font-size: 18px;
              font-weight: bold;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th {
              background: #8b5cf6;
              color: white;
              padding: 15px;
              text-align: left;
              font-weight: 600;
            }
            td {
              padding: 15px;
              border-bottom: 1px solid #e5e7eb;
            }
            tr:hover {
              background: #f9fafb;
            }
            .summary {
              margin-top: 30px;
              padding: 20px;
              background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
              color: white;
              border-radius: 8px;
            }
            .summary-item {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
              font-size: 18px;
            }
            .summary-total {
              font-size: 24px;
              font-weight: bold;
              border-top: 2px solid rgba(255,255,255,0.3);
              padding-top: 15px;
              margin-top: 15px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              color: #666;
              font-size: 14px;
            }
            @media print {
              body {
                background: white;
                margin: 0;
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1>🏠 RentMaster Pro</h1>
              <p>Payment Receipt & History</p>
              <p style="color: #8b5cf6; font-size: 12px;">Generated on ${new Date().toLocaleDateString()}</p>
            </div>

            <div class="info-section">
              <div>
                <div class="info-item">
                  <div class="info-label">Tenant Name</div>
                  <div class="info-value">${property.tenantName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Property</div>
                  <div class="info-value">${property.apartmentName}</div>
                </div>
              </div>
              <div>
                <div class="info-item">
                  <div class="info-label">Unit Number</div>
                  <div class="info-value">${property.houseNumber}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Monthly Rent</div>
                  <div class="info-value">KES${property.rentAmount.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <h2 style="color: #8b5cf6; margin-top: 30px;">Payment History</h2>
            ${
              property.paymentHistory.length === 0
                ? `
              <p style="text-align: center; color: #666; padding: 40px;">No payments recorded yet.</p>
            `
                : `
              <table>
                <thead>
                  <tr>
                    <th>Payment #</th>
                    <th>Date</th>
                    <th>Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  ${property.paymentHistory
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() -
                        new Date(a.date).getTime(),
                    )
                    .map(
                      (payment, index) => `
                      <tr>
                        <td>#${property.paymentHistory.length - index}</td>
                        <td>${new Date(
                          payment.date,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}</td>
                        <td style="color: #10b981; font-weight: bold;">KES${payment.amount.toLocaleString()}</td>
                      </tr>
                    `,
                    )
                    .join("")}
                </tbody>
              </table>

              <div class="summary">
                <div class="summary-item">
                  <span>Total Payments Made:</span>
                  <span>${property.paymentHistory.length}</span>
                </div>
                <div class="summary-item">
                  <span>Current Balance Owed:</span>
                  <span>KES${property.debt.toLocaleString()}</span>
                </div>
                <div class="summary-item summary-total">
                  <span>Total Amount Paid:</span>
                  <span>KES${totalPaid.toLocaleString()}</span>
                </div>
              </div>
            `
            }

            <div class="footer">
              <p><strong>RentMaster Pro</strong> - Property Management System</p>
              <p>This is an official payment receipt. Please keep for your records.</p>
            </div>

            <div class="no-print" style="text-align: center; margin-top: 30px;">
              <button onclick="window.print()" style="
                background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                margin-right: 10px;
              ">Print Receipt</button>
              <button onclick="window.close()" style="
                background: #e5e7eb;
                color: #111;
                border: none;
                padding: 15px 30px;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
              ">Close</button>
            </div>
          </div>
        </body>
      </html>
    `;

    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-3xl bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl border-4 border-white/50 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-white">
                    Payment History & Receipt
                  </h2>
                  <p className="text-purple-100">
                    {property.apartmentName} - Unit{" "}
                    {property.houseNumber}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto flex-1">
            {/* Property Info */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700 mb-1">
                    Tenant Name
                  </p>
                  <p className="text-gray-900">
                    {property.tenantName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 mb-1">
                    Monthly Rent
                  </p>
                  <p className="text-gray-900">
                    KES{property.rentAmount}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 mb-1">
                    Total Payments
                  </p>
                  <p className="text-gray-900">
                    {property.paymentHistory.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 mb-1">
                    Current Debt
                  </p>
                  <p
                    className={
                      property.debt > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    KES{property.debt}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment History Table */}
            <div className="mb-6">
              <h3 className="text-gray-900 mb-4">
                All Payments
              </h3>
              {property.paymentHistory.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No payment history available
                  </p>
                  <p className="text-gray-500">
                    Payments will appear here once recorded
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border-2 border-purple-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <th className="px-4 py-3 text-left">
                          #
                        </th>
                        <th className="px-4 py-3 text-left">
                          Date
                        </th>
                        <th className="px-4 py-3 text-right">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {property.paymentHistory
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime(),
                        )
                        .map((payment, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-purple-100 hover:bg-purple-50 transition-colors"
                          >
                            <td className="px-4 py-4 text-gray-700">
                              #
                              {property.paymentHistory.length -
                                index}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-purple-600" />
                                <span className="text-gray-900">
                                  {new Date(
                                    payment.date,
                                  ).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    },
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="text-green-600">
                                  {payment.amount.toLocaleString()}
                                </span>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Summary */}
            {property.paymentHistory.length > 0 && (
              <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 p-6 rounded-xl border-2 border-purple-300">
                <h3 className="text-gray-900 mb-4">Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">
                      Total Payments Made:
                    </span>
                    <span className="text-gray-900">
                      {property.paymentHistory.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">
                      Total Amount Paid:
                    </span>
                    <span className="text-green-600">
                      KES{totalPaid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t-2 border-purple-300">
                    <span className="text-gray-900">
                      Current Balance Owed:
                    </span>
                    <span
                      className={
                        property.debt > 0
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      KES{property.debt.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-gray-50 border-t-2 border-purple-200">
            <div className="flex gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
              >
                Close
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadReceipt}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Receipt
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}