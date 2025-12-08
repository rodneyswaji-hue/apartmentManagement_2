import { useState } from "react";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Property } from "./Dashboard";

interface ManagePropertiesModalProps {
  onClose: () => void;
  onAdd: (property: Omit<Property, "id">) => void;
}

export function ManagePropertiesModal({
  onClose,
  onAdd,
}: ManagePropertiesModalProps) {
  const [formData, setFormData] = useState({
    apartmentName: "",
    houseNumber: "",
    tenantName: "",
    phoneNumber: "",
    rentAmount: "",
    debt: "",
    isPaid: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAdd({
      apartmentName: formData.apartmentName,
      houseNumber: formData.houseNumber,
      tenantName: formData.tenantName,
      phoneNumber: formData.phoneNumber,
      rentAmount: parseFloat(formData.rentAmount) || 0,
      debt: parseFloat(formData.debt) || 0,
      isPaid: formData.isPaid,
      paymentHistory: [],
    });


    // Reset form
    setFormData({
      apartmentName: "",
      houseNumber: "",
      tenantName: "",
      phoneNumber: "",
      rentAmount: "",
      debt: "",
      isPaid: false,
    });

    onClose();
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
          className="relative w-full max-w-2xl bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl border-4 border-white/50 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Plus className="w-6 h-6" />
                </div>
                <h2 className="text-white">Add New Property</h2>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Apartment Name */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Apartment/Building Name
                </label>
                <input
                  type="text"
                  value={formData.apartmentName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      apartmentName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all"
                  placeholder="e.g., Sunset Towers"
                  required
                />
              </div>

              {/* House Number */}
              <div>
                <label className="block text-gray-700 mb-2">
                  House/Unit Number
                </label>
                <input
                  type="text"
                  value={formData.houseNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      houseNumber: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all"
                  placeholder="e.g., A-101"
                  required
                />
              </div>

              {/* Tenant Name */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Tenant Name
                </label>
                <input
                  type="text"
                  value={formData.tenantName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tenantName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all"
                  placeholder="e.g., John Smith"
                  required
                />
              </div>

              {/* Rent Amount */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Monthly Rent ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.rentAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rentAmount: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all"
                  placeholder="e.g., 1200"
                  required
                />
              </div>

              {/* Debt */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Current Debt ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.debt}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      debt: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all"
                  placeholder="e.g., 0"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Tenant Phone Number</label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all"
                  placeholder="e.g., 555-1234"
                  required
                />
              </div>


              {/* Payment Status */}
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPaid}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isPaid: e.target.checked,
                      })
                    }
                    className="w-6 h-6 rounded-lg border-2 border-purple-300 text-purple-600 focus:ring-4 focus:ring-purple-300"
                  />
                  <span className="text-gray-700">
                    Rent is paid for this month
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
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
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-xl hover:shadow-2xl transition-all"
              >
                Add Property
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}