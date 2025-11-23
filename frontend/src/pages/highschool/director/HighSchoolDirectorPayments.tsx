// HighSchoolDirectorPayments.tsx
import React, { useState } from 'react';
import { FaCheck, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

interface Payment {
  id: number;
  studentName: string;
  email: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Paid' | 'Rejected';
  date: string;
}

const HighSchoolDirectorPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([
    { id: 1, studentName: 'Alice Johnson', email: 'alice.johnson@example.com', amount: 1000, status: 'Pending', date: '2025-11-01' },
    { id: 2, studentName: 'Bob Smith', email: 'bob.smith@example.com', amount: 1200, status: 'Approved', date: '2025-10-28' },
    { id: 3, studentName: 'Charlie Brown', email: 'charlie.brown@example.com', amount: 1500, status: 'Paid', date: '2025-10-25' },
  ]);

  const [newPaymentName, setNewPaymentName] = useState('');
  const [newPaymentEmail, setNewPaymentEmail] = useState('');
  const [newPaymentAmount, setNewPaymentAmount] = useState('');

  // Approve payment
  const approvePayment = (id: number) => {
    setPayments(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'Approved' } : p))
    );
  };

  // Mark payment as paid
  const markPaid = (id: number) => {
    setPayments(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'Paid' } : p))
    );
  };

  // Reject payment
  const rejectPayment = (id: number) => {
    setPayments(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'Rejected' } : p))
    );
  };

  // Remove payment
  const removePayment = (id: number) => {
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  // Add new payment
  const addPayment = () => {
    if (!newPaymentName || !newPaymentEmail || !newPaymentAmount) return alert('Fill in all fields');
    const newPayment: Payment = {
      id: Math.max(0, ...payments.map(p => p.id)) + 1,
      studentName: newPaymentName,
      email: newPaymentEmail,
      amount: parseFloat(newPaymentAmount),
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    };
    setPayments(prev => [...prev, newPayment]);
    setNewPaymentName('');
    setNewPaymentEmail('');
    setNewPaymentAmount('');
  };

  return (
    <div className="space-y-6"> 
      {/* Add Payment Form */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4 flex items-center">
          <FaPlus className="mr-2" /> Add New Payment
        </h4>
        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Student Name"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={newPaymentName}
            onChange={e => setNewPaymentName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={newPaymentEmail}
            onChange={e => setNewPaymentEmail(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            className="border border-gray-300 rounded-md p-2 w-40"
            value={newPaymentAmount}
            onChange={e => setNewPaymentAmount(e.target.value)}
          />
          <button
            onClick={addPayment}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition flex items-center"
          >
            <FaPlus className="mr-2" /> Add
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="p-6 bg-white rounded-lg shadow-md overflow-x-auto">
        <h4 className="text-xl font-semibold mb-4">Payments List</h4>
        <table className="min-w-full table-auto border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Student Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                <td className="px-4 py-2 text-sm text-gray-600">{payment.id}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{payment.studentName}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{payment.email}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{payment.amount}</td>
                <td className="px-4 py-2 text-sm">
                  {payment.status === 'Approved' && <span className="text-green-600 font-semibold">{payment.status}</span>}
                  {payment.status === 'Pending' && <span className="text-yellow-600 font-semibold">{payment.status}</span>}
                  {payment.status === 'Paid' && <span className="text-blue-600 font-semibold">{payment.status}</span>}
                  {payment.status === 'Rejected' && <span className="text-red-600 font-semibold">{payment.status}</span>}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{payment.date}</td>
                <td className="px-4 py-2 text-sm flex gap-2 flex-wrap">
                  {payment.status === 'Pending' && (
                    <button
                      onClick={() => approvePayment(payment.id)}
                      className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 transition flex items-center"
                    >
                      <FaCheck className="mr-1" /> Approve
                    </button>
                  )}
                  {payment.status === 'Approved' && (
                    <button
                      onClick={() => markPaid(payment.id)}
                      className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition flex items-center"
                    >
                      <FaCheck className="mr-1" /> Mark Paid
                    </button>
                  )}
                  {payment.status === 'Pending' && (
                    <button
                      onClick={() => rejectPayment(payment.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition flex items-center"
                    >
                      <FaTimes className="mr-1" /> Reject
                    </button>
                  )}
                  <button
                    onClick={() => removePayment(payment.id)}
                    className="bg-gray-600 text-white px-2 py-1 rounded-md hover:bg-gray-700 transition flex items-center"
                  >
                    <FaTrash className="mr-1" /> Remove
                  </button>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HighSchoolDirectorPayments;
