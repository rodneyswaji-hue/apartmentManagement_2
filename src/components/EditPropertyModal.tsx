import { useState } from "react";
import { X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Property } from "./Dashboard";

interface EditPropertyModalProps {
  property: Property;
  onClose: () => void;
  onUpdate: (updates: Partial<Property>) => void;
}

export function EditPropertyModal({
  property,
  onClose,
  onUpdate,
}: EditPropertyModalProps) {
  const [formData, setFormData] = useState({
    apartmentName: property.apartmentName,
    houseNumber: property.houseNumber,
    tenantName: property.tenantName,
    rentAmount: property.rentAmount.toString(),
    debt: property.debt.toString(),
    isPaid: property.isPaid,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onUpdate({
      apartmentName: formData.apartmentName,
      houseNumber: formData.houseNumber,
      tenantName: formData.tenantName,
      rentAmount: parseFloat(formData.rentAmount) || 0,
      debt: parseFloat(formData.debt) || 0,
      isPaid: formData.isPaid,
    });
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
          className="relative w-full max-w-2xl bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border-4 border-white/50 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Save className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-white">Edit Property</h2>
                  <p className="text-blue-100">
                    Update tenant and rent information
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
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all"
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
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all"
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
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all"
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
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all"
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
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all"
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
                    className="w-6 h-6 rounded-lg border-2 border-blue-300 text-blue-600 focus:ring-4 focus:ring-blue-300"
                  />
                  <span className="text-gray-700">
                    Rent is paid for this month
                  </span>
                </label>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-100 border-2 border-blue-300 rounded-xl">
              <p className="text-gray-700">
                💡 <span className="text-gray-900">Tip:</span>{" "}
                Use this form to change tenants, update rent
                amounts, or adjust debt balances.
              </p>
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
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}