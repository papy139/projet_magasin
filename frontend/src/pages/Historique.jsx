import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Historique() {
  usePageTitle("Historique");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const orderHistory = localStorage.getItem("order_history");
    if (orderHistory) {
      try {
        const parsedOrders = JSON.parse(orderHistory);
        const sorted = parsedOrders.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );
        setOrders(sorted);
      } catch (error) {
        setOrders([]);
      }
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("fr-FR", options);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
            En attente
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
            Complétée
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium">
            Annulée
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
            {status}
          </span>
        );
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Historique des commandes
          </h1>
          <p className="text-lg text-gray-600 mb-6">Aucune commande passée</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Historique des commandes
        </h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {getStatusBadge(order.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
