import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import {
  Building2,
  LogOut,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Plus,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import { PropertyCard } from "./PropertyCard";
import { ManagePropertiesModal } from "./ManagePropertiesModal";
import { EditPropertyModal } from "./EditPropertyModal";
import { RecordPaymentModal } from "./RecordPaymentModal";
import { PaymentHistoryModal } from "./PaymentHistoryModal";
import type { User } from "../App";

export interface Property {
  id: string;
  apartmentName: string;
  houseNumber: string;
  tenantName: string;
  phoneNumber: string;
  rentAmount: number;
  debt: number;
  isPaid: boolean;
  paymentHistory: { date: string; amount: number }[];
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

// Helper: map DB snake_case row → camelCase Property
const mapProperty = (row: any): Property => ({
  id: row.id ?? "",
  apartmentName: row.apartment_name ?? "",
  houseNumber: row.house_number ?? "",
  tenantName: row.tenant_name ?? "",
  phoneNumber: row.phone_number ?? "",
  rentAmount: row.rent_amount ?? 0,
  debt: row.debt ?? 0,
  isPaid: row.is_paid ?? false,
  paymentHistory: row.payment_history ?? [],
});


export function Dashboard({ user, onLogout }: DashboardProps) {
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [showManageModal, setShowManageModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [paymentProperty, setPaymentProperty] = useState<Property | null>(null);
  const [historyProperty, setHistoryProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  // -----------------------------
  // Fetch all properties from Supabase
  // -----------------------------
  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase.from("properties").select("*");
      if (error) {
        console.error("Error loading properties:", error);
        return;
      }
      setProperties((data || []).map(mapProperty));
    };

    fetchProperties();
  }, []);

  // -----------------------------
  // CRUD / Payment Functions
  // -----------------------------
  const addProperty = async (property: Omit<Property, "id">) => {
    const { data, error } = await supabase
      .from("properties")
      .insert({
        apartment_name: property.apartmentName,
        house_number: property.houseNumber,
        tenant_name: property.tenantName,
        phone_number: property.phoneNumber,
        rent_amount: property.rentAmount,
        debt: property.debt,
        is_paid: property.isPaid,
        payment_history: property.paymentHistory,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding property:", error);
      return;
    }

    setProperties([...properties, mapProperty(data)]);
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    const { data, error } = await supabase
      .from("properties")
      .update({
        apartment_name: updates.apartmentName,
        house_number: updates.houseNumber,
        tenant_name: updates.tenantName,
        phone_number: updates.phoneNumber,
        rent_amount: updates.rentAmount,
        debt: updates.debt,
        is_paid: updates.isPaid,
        payment_history: updates.paymentHistory,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      return;
    }

    setProperties(properties.map((prop) => (prop.id === id ? mapProperty(data) : prop)));
  };




  const recordPayment = async (id: string, amount: number) => {
    const existing = properties.find((p) => p.id === id);
    if (!existing) return;

    const newDebt = Math.max(0, existing.debt - amount);
    const updatedHistory = [...existing.paymentHistory, { date: new Date().toISOString().split("T")[0], amount }];

    const { data, error } = await supabase
      .from("properties")
      .update({
        debt: newDebt,
        is_paid: newDebt === 0,
        payment_history: updatedHistory,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Payment update error:", error);
      return;
    }

    setProperties(properties.map((p) => (p.id === id ? mapProperty(data) : p)));
  };

  const togglePaymentStatus = (id: string) => {
    setProperties(
      properties.map((prop) => (prop.id === id ? { ...prop, isPaid: !prop.isPaid } : prop))
    );
  };

  // -----------------------------
  // Filter / Aggregate Data
  // -----------------------------
const filteredProperties = properties.filter((property) => {
  const query = searchQuery.toLowerCase();

  // Search filter (null-safe)
  const matchesSearch =
    (property.apartmentName?.toLowerCase() ?? "").includes(query) ||
    (property.houseNumber?.toLowerCase() ?? "").includes(query) ||
    (property.tenantName?.toLowerCase() ?? "").includes(query);

  // Payment filter
  const matchesPaymentFilter =
    paymentFilter === "all" ||
    (paymentFilter === "paid" && property.isPaid) ||
    (paymentFilter === "unpaid" && !property.isPaid);

  return matchesSearch && matchesPaymentFilter;
});



  const unpaidCount = properties.filter((p) => !p.isPaid).length;
  const totalRent = properties.reduce((sum, p) => sum + p.rentAmount, 0);
  const totalCollected = properties.filter((p) => p.isPaid).reduce((sum, p) => sum + p.rentAmount, 0);
  const totalOutstanding = properties.filter((p) => !p.isPaid).reduce((sum, p) => sum + p.rentAmount, 0);
  const totalDebt = properties.reduce((sum, p) => sum + p.debt, 0);

  // -----------------------------
  // RETURN JSX (Your UI components go here)
  // -----------------------------


  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')`,
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-pink-500/85 to-orange-500/90" />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-white/10 backdrop-blur-xl border-b-4 border-white/30 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl"
                >
                  <Building2 className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-white">🏠 RentMaster Pro</h1>
                  <p className="text-purple-100">Welcome, {user.email.split('@')[0]}!</p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowManageModal(true)}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl hover:shadow-2xl transition-all flex-1 sm:flex-none"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add Property</span>
                  <span className="sm:hidden">Add</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLogout}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all backdrop-blur-sm flex-1 sm:flex-none"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-2xl p-6 text-white border-4 border-white/30"
            >
              <div className="flex items-center justify-between mb-3">
                <span>Total Properties</span>
                <Building2 className="w-8 h-8" />
              </div>
              <div className="text-white">
                {properties.length}
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              onClick={() => setPaymentFilter('unpaid')}
              className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-2xl p-6 text-white border-4 border-white/30 cursor-pointer text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <span>Unpaid Tenants</span>
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="text-white">{unpaidCount}</div>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-2xl p-6 text-white border-4 border-white/30"
            >
              <div className="flex items-center justify-between mb-3">
                <span>Rent Collected</span>
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="text-white">
                KES{totalCollected.toLocaleString()}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-2xl p-6 text-white border-4 border-white/30"
            >
              <div className="flex items-center justify-between mb-3">
                <span>Outstanding</span>
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="text-white">
                KES{totalOutstanding.toLocaleString()}
              </div>
            </motion.div>
          </div>

          {/* Monthly Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-8 border-4 border-white/50"
          >
            <h2 className="mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              💰 Monthly Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-xl">
                <p className="text-gray-700 mb-2">
                  Total Expected Rent
                </p>
                <p className="text-gray-900">
                  KES{totalRent.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-100 to-orange-100 p-6 rounded-xl">
                <p className="text-gray-700 mb-2">
                  Total Debt Owed
                </p>
                <p className="text-red-600">
                  KES{totalDebt.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-blue-100 p-6 rounded-xl">
                <p className="text-gray-700 mb-2">
                  Collection Rate
                </p>
                <p className="text-gray-900">
                  {totalRent > 0
                    ? (
                        (totalCollected / totalRent) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </motion.div>

          {/* Properties List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border-4 border-white/50"
          >
            <div className="flex flex-col gap-4 mb-6">
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                🏢 All Properties
              </h2>

              <div className="flex items-center gap-4 flex-wrap">
                {/* Payment Filter Buttons */}
                <div className="flex gap-2 bg-purple-50 p-1 rounded-xl">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPaymentFilter("all")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      paymentFilter === "all"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "bg-transparent text-gray-700 hover:bg-purple-100"
                    }`}
                  >
                    All
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPaymentFilter("paid")}
                    className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
                      paymentFilter === "paid"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                        : "bg-transparent text-gray-700 hover:bg-purple-100"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Paid
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPaymentFilter("unpaid")}
                    className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
                      paymentFilter === "unpaid"
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                        : "bg-transparent text-gray-700 hover:bg-purple-100"
                    }`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    Unpaid
                  </motion.button>
                </div>

                {/* Search Bar */}
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    placeholder="Search by property, unit, or tenant..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredProperties.length === 0 && (searchQuery || paymentFilter !== 'all') ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No properties found
                    {searchQuery && ` matching "${searchQuery}"`}
                    {paymentFilter !== 'all' && ` with ${paymentFilter} status`}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery('');
                      setPaymentFilter('all');
                    }}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl"
                  >
                    Clear Filters
                  </motion.button>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    No properties yet. Add your first property!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowManageModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl"
                  >
                    Add Property
                  </motion.button>
                </div>
              ) : (
                filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <PropertyCard
                      property={property}
                      onTogglePayment={togglePaymentStatus}
                      onEdit={() => setEditingProperty(property)}
                      onDelete={() => setPropertyToDelete(property)} // trigger modal
                      onRecordPayment={() => setPaymentProperty(property)}
                      onViewHistory={() => setHistoryProperty(property)}
                    />

                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </main>
      </div>

      {/* Modals */}
      {showManageModal && (
        <ManagePropertiesModal
          onClose={() => setShowManageModal(false)}
          onAdd={addProperty}
        />
      )}

      {editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          onClose={() => setEditingProperty(null)}
          onUpdate={(updates) => {
            updateProperty(editingProperty.id, updates);
            setEditingProperty(null);
          }}
        />
      )}

      {paymentProperty && (
        <RecordPaymentModal
          property={paymentProperty}
          onClose={() => setPaymentProperty(null)}
          onRecordPayment={(id, amount) => {
            recordPayment(id, amount);
            setPaymentProperty(null);
          }}
        />
      )}

      {historyProperty && (
        <PaymentHistoryModal
          property={historyProperty}
          onClose={() => setHistoryProperty(null)}
        />
      )}
      {propertyToDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
          >
            <h2 className="text-xl font-bold mb-4">Delete Property</h2>
            <p className="mb-6">
              Are you sure you want to delete <strong>{propertyToDelete.apartmentName} - {propertyToDelete.houseNumber}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setPropertyToDelete(null)}
                className="px-6 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  // Call your delete function
                  const { error } = await supabase
                    .from("properties")
                    .delete()
                    .eq("id", propertyToDelete.id);
                  if (error) {
                    console.error("Delete error:", error);
                  } else {
                    setProperties(properties.filter(p => p.id !== propertyToDelete.id));
                  }
                  setPropertyToDelete(null);
                }}
                className="px-6 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

    </div>
  );
}