import {
  Home,
  User,
  
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Wallet,
  FileText,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Property } from "./Dashboard";

interface PropertyCardProps {
  property: Property;
  onTogglePayment: (id: string) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onRecordPayment: () => void;
  onViewHistory: () => void;
}

export function PropertyCard({
  property,
  onTogglePayment,
  onEdit,
  onDelete,
  onRecordPayment,
  onViewHistory,
}: PropertyCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="border-4 border-purple-200 bg-gradient-to-r from-white to-purple-50 rounded-2xl p-6 hover:shadow-2xl transition-all"
    >
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-center">
        {/* Apartment Name */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-900">
                {property.apartmentName}
              </p>
              <p className="text-purple-600">
                Unit {property.houseNumber}
              </p>
            </div>
          </div>
        </div>

        
        {/* Tenant */}
        <div className="lg:col-span-1">
          <div className="flex flex-col gap-1 bg-blue-100 px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <p className="text-gray-900">{property.tenantName}</p>
            </div>
            
          </div>
        </div>
        

        {/* Phone Number */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 bg-indigo-100 px-3 py-2 rounded-lg">
            <Phone className="w-4 h-4 text-indigo-600" />
            <p className="text-gray-900">{property.phoneNumber}</p>
          </div>
        </div>

        {/* Rent Amount */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg">
            
            <p className="text-gray-900">
              <span className="text-green-600 font-bold mr-1">KSh</span>
              {property.rentAmount}
            </p>
          </div>
        </div>

        {/* Debt */}
        <div className="lg:col-span-1">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              property.debt > 0 ? "bg-red-100" : "bg-gray-100"
            }`}
          >
            <AlertTriangle
              className={`w-4 h-4 ${
                property.debt > 0 ? "text-red-600" : "text-gray-400"
              }`}
            />

            <p
              className={
                property.debt > 0
                  ? "text-red-600"
                  : "text-gray-600"
              }
            >
              <span
                className={`font-bold mr-1 ${
                  property.debt > 0 ? "text-red-600" : "text-gray-600"
                }`}
              >
                KSh
              </span>
              {property.debt}
            </p>
          </div>
        </div>


        {/* Payment Status */}
        <div className="lg:col-span-1">
          {property.isPaid ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg"
            >
              <CheckCircle className="w-4 h-4" />
              Paid
            </motion.span>
          ) : (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg"
            >
              <XCircle className="w-4 h-4" />
              Unpaid
            </motion.span>
          )}
        </div>

         {/* Action Buttons */}
        <div className="lg:col-span-2 flex flex-col gap-2">
          {/* Top row - Primary actions */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRecordPayment}
              className="flex-1 px-3 py-2 rounded-xl transition-all shadow-md bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:shadow-lg"
              title="Record Payment"
            >
              <div className="flex items-center justify-center gap-1">
                <Wallet className="w-4 h-4" />
                <span className="text-xs">Pay</span>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewHistory}
              className="flex-1 px-3 py-2 rounded-xl transition-all shadow-md bg-gradient-to-r from-indigo-400 to-blue-500 text-white hover:shadow-lg"
              title="View Receipt & History"
            >
              <div className="flex items-center justify-center gap-1">
                <FileText className="w-4 h-4" />
                <span className="text-xs">History</span>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
              title="Edit Property"
            >
              <div className="flex items-center justify-center gap-1">
                <Edit className="w-4 h-4" />
                <span className="text-xs">Edit</span>
              </div>
            </motion.button>
          </div>

          {/* Bottom row - Status toggle and delete */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTogglePayment(property.id)}
              className={`flex-1 px-3 py-2 rounded-xl transition-all shadow-md text-xs ${
                property.isPaid
                  ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:shadow-lg'
                  : 'bg-gradient-to-r from-green-400 to-blue-500 text-white hover:shadow-lg'
              }`}
              title={property.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
            >
              {property.isPaid ? 'Mark Unpaid' : 'Mark Paid'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(property.id)}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-xl hover:shadow-lg transition-all"
              title="Delete Property"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}