import { useState } from "react";
import { X, DollarSign, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Property } from "./Dashboard";

interface RecordPaymentModalProps {
  property: Property;
  onClose: () => void;
  onRecordPayment: (propertyId: string, amount: number) => void;
}

export function RecordPaymentModal({
  property,
  onClose,
  onRecordPayment,
}: RecordPaymentModalProps) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amount = parseFloat(paymentAmount);

    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid payment amount");
      return;
    }

    onRecordPayment(property.id, amount);
    onClose();
  };

  const suggestedAmounts = [
    { label: "Full Rent", amount: Number(property.rentAmount) },
    { label: "Half Rent", amount: Number(property.rentAmount) / 2 },
    {
      label: "Full Debt",
      amount: Number(property.debt),
      disabled: Number(property.debt) === 0,
    },
  ];

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
          className="relative w-full max-w-lg bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl border-4 border-white/50 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-white">Record Payment</h2>
                  <p className="text-green-100">
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
          <div className="p-8">
            {/* Property Info */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-xl mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Tenant:</span>
                <span className="text-gray-900">
                  {property.tenantName}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">
                  Monthly Rent:
                </span>
                <span className="text-gray-900">
                  ${property.rentAmount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">
                  Current Debt:
                </span>
                <span
                  className={
                    property.debt > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }
                >
                  ${property.debt}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-3">
                  Payment Amount ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                  <input
                    type="number"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) =>
                      setPaymentAmount(e.target.value)
                    }
                    className="w-full pl-12 pr-4 py-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all"
                    placeholder="Enter payment amount"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="mb-6">
                <p className="text-gray-700 mb-3">
                  Quick Select:
                </p>
                <div className="flex gap-3">
                  {suggestedAmounts.map((suggested) => (
                    <motion.button
                      key={suggested.label}
                      type="button"
                      whileHover={{
                        scale: suggested.disabled ? 1 : 1.05,
                      }}
                      whileTap={{
                        scale: suggested.disabled ? 1 : 0.95,
                      }}
                      disabled={suggested.disabled}
                      onClick={() =>
                        setPaymentAmount(
                          suggested.amount.toString(),
                        )
                      }
                      className={`flex-1 px-4 py-3 rounded-xl transition-all ${
                        suggested.disabled
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-100 to-emerald-100 text-gray-800 hover:from-green-200 hover:to-emerald-200 border-2 border-green-300"
                      }`}
                    >
                      <div className="text-xs mb-1">
                        {suggested.label}
                      </div>
                      <div>${suggested.amount}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6"
                >
                  {error}
                </motion.div>
              )}

              {/* Impact Preview */}
              {paymentAmount &&
                !isNaN(parseFloat(paymentAmount)) &&
                parseFloat(paymentAmount) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-xl mb-6 border-2 border-green-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">
                        After Payment:
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">
                        New Debt:
                      </span>
                      <span className="text-green-600">
                        $
                        {Math.max(
                          0,
                          property.debt -
                            parseFloat(paymentAmount),
                        ).toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-5 h-5" />
                  Record Payment
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}