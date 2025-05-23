import { useState, useEffect } from "react";
import axios from "axios";
import {
  Pencil,
  X,
  CreditCard,
  Wallet,
  Building,
  Plus,
  Shield,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import api from "../../../config/api";

export default function PaymentMethods() {
  const { user } = useAuth();
  const [methods, setMethods] = useState([]);
  const [mode, setMode] = useState("add");
  const [form, setForm] = useState({ type: "", details: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [isWorking, setWorking] = useState(false);

  const paymentTypes = [
    { value: "Credit Card", icon: CreditCard, color: "text-blue-600" },
    { value: "Debit Card", icon: CreditCard, color: "text-green-600" },
    { value: "Digital Wallet", icon: Wallet, color: "text-purple-600" },
    { value: "Bank Transfer", icon: Building, color: "text-orange-600" },
  ];

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchMethods();
    }
  }, [user]);

  const fetchMethods = async () => {
    try {
      const res = await api.get("/payment-methods");
      setMethods(res.data);
    } catch (err) {
      console.error("Error fetching methods:", err);
    }
  };

  const resetForm = () => {
    setForm({ type: "", details: "" });
    setMode("add");
    setEditingId(null);
    setError("");
  };

  const handleEdit = (method) => {
    setForm({
      type: method.type,
      details: JSON.stringify(method.details, null, 2),
    });
    setEditingId(method.id);
    setMode("edit");
  };

  const handleSubmit = async (e) => {
    setWorking(true);
    e.preventDefault();
    try {
      const payload = {
        type: form.type,
        details: JSON.parse(form.details),
      };

      if (mode === "add") {
        await api.post("/payment-methods", payload);
      } else {
        await api.patch(
          `/payment-methods/${editingId}`,
          payload
        );
      }

      fetchMethods();
      resetForm();
    } catch (err) {
      console.error("Error submitting method:", err);
      setError("Invalid JSON format in details field.");
    } finally {
      setWorking(false);
    }
  };

  const getPaymentIcon = (type) => {
    const paymentType = paymentTypes.find((pt) => pt.value === type);
    if (paymentType) {
      const IconComponent = paymentType.icon;
      return <IconComponent className={`w-5 h-5 ${paymentType.color}`} />;
    }
    return <CreditCard className="w-5 h-5 text-gray-500" />;
  };

  const formatPaymentDetails = (details) => {
    if (typeof details === "object") {
      return Object.entries(details).map(([key, value]) => (
        <div key={key} className="flex justify-between py-1">
          <span className="text-gray-600 capitalize text-sm">{key}:</span>
          <span className="text-gray-800 text-sm font-medium">{value}</span>
        </div>
      ));
    }
    return <span className="text-gray-600 text-sm">{String(details)}</span>;
  };

  if (user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            Administrator privileges required to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Methods Management
          </h1>
         
        </div>

        <div className="grid lg:grid-cols-2 gap-8 overflow-y-hidden">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === "edit" ? "Edit Payment Method" : "Add New Method"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Type
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {paymentTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setForm({ ...form, type: type.value })}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                          form.type === type.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 ${type.color}`} />
                        <span className="text-sm font-medium text-gray-700">
                          {type.value}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  placeholder="Or enter custom payment type"
                  required
                />
              </div>

              {/* Payment Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Details (JSON Format)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={6}
                  value={form.details}
                  onChange={(e) =>
                    setForm({ ...form, details: e.target.value })
                  }
                  placeholder={`Enter details in JSON format, e.g.:
{
  "number": "**** **** **** 1234",
  "expiry": "12/25",
  "name": "John Doe"
}`}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter payment configuration details in valid JSON format
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4">
                {mode === "edit" && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-sm">Cancel</span>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isWorking}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 ml-auto"
                >
                  {isWorking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      {mode === "edit" ? (
                        <Pencil className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <span>
                        {mode === "edit" ? "Update Method" : "Add Method"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Payment Methods List */}
          <div className="overflow-y-scroll h-screen pb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Configured Payment Methods
            </h2>

            {methods.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  No payment methods configured
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Add your first payment method to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {methods.map((method) => (
                  <div
                    key={method.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getPaymentIcon(method.type)}
                        <h3 className="font-semibold text-gray-900">
                          {method.type}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleEdit(method)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit payment method"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-1">
                        {formatPaymentDetails(method.details)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
