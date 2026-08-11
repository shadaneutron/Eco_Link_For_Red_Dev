import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowLeft, RefreshCw, DollarSign, Lock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { transactionsApi, TransactionResponse } from '../../services/api';

interface TransactionEscrowPageProps {
  onBack?: () => void;
}

export const TransactionEscrowPage: React.FC<TransactionEscrowPageProps> = ({ onBack }) => {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<TransactionResponse | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await transactionsApi.getTransactions();
      setTransactions(data || []);
      if (data && data.length > 0 && !selectedTx) {
        setSelectedTx(data[0]);
      }
    } catch (err: any) {
      console.error('Failed to load transactions:', err);
      setError(err.message || 'Failed to load transaction history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSimulatePayment = async (txId: number) => {
    try {
      setActionLoading(true);
      const res = await transactionsApi.simulatePayment(txId);
      showToast(res.detail || 'Payment simulated. Funds held in Escrow.');
      setTransactions(prev => prev.map(t => t.id === txId ? res.transaction : t));
      if (selectedTx?.id === txId) {
        setSelectedTx(res.transaction);
      }
    } catch (err: any) {
      showToast('Error: ' + (err.message || 'Payment simulation failed.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReleaseEscrow = async (txId: number) => {
    try {
      setActionLoading(true);
      const res = await transactionsApi.releaseEscrow(txId);
      showToast(res.detail || 'Escrow funds released successfully.');
      setTransactions(prev => prev.map(t => t.id === txId ? res.transaction : t));
      if (selectedTx?.id === txId) {
        setSelectedTx(res.transaction);
      }
    } catch (err: any) {
      showToast('Error: ' + (err.message || 'Escrow release failed.'));
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Held':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#FFF8E1] text-[#B78103] border border-[#FFE082]">
            <Lock className="w-3.5 h-3.5" /> HELD IN ESCROW
          </span>
        );
      case 'Released':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]">
            <CheckCircle2 className="w-3.5 h-3.5" /> ESCROW RELEASED
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#E0F2F1] text-[#006A6A] border border-[#80CBC4]">
            <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETED
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#FFF3E0] text-[#E65100] border border-[#FFCC80]">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> PAYMENT PENDING
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]">
            {status.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 font-sans bg-[#F7FAF9] text-[#181C1C] min-h-screen p-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#000A1F] text-white px-5 py-3 rounded-lg shadow-lg border border-[#80F9CA] flex items-center gap-3 font-sans text-sm animate-fade-in">
          <Sparkles className="w-5 h-5 text-[#80F9CA]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#C4C6D0] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 text-[#44474F] hover:bg-[#E6E9E8] rounded-full transition-colors"
                title="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-[#006A6A]" /> Escrow Transactions
            </h1>
          </div>
          <p className="font-sans text-sm text-[#44474F] pl-1">
            Automated payment simulation & 5% platform escrow tracking for verified deals.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchTransactions}
          disabled={isLoading}
          className="px-4 py-2 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </section>

      {/* Disclaimer Banner */}
      <div className="bg-[#E6F4F1] border border-[#80CBC4] rounded-lg p-4 flex items-center justify-between text-xs text-[#004D40] font-mono">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#006A6A]" />
          <span><strong>MVP Escrow Simulation Mode:</strong> Money is safely held in smart escrow. No real credit card or bank credentials are required.</span>
        </div>
        <span className="bg-[#006A6A] text-white px-2.5 py-0.5 rounded text-[10px] font-bold">5% Platform Fee</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#006A6A]" />
            <span className="font-mono text-sm text-[#44474F]">Loading Escrow Transactions...</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-700 font-sans">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p>{error}</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-white border border-[#C4C6D0] rounded-lg p-12 text-center space-y-4">
          <ShieldCheck className="w-12 h-12 mx-auto text-[#44474F]/40" />
          <h3 className="font-headline text-lg font-semibold text-[#181C1C]">No Transactions Yet</h3>
          <p className="font-sans text-sm text-[#44474F] max-w-md mx-auto">
            Transactions are automatically generated when a Factory accepts a Recycler's bid in the marketplace.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transactions List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-mono font-medium text-sm text-[#181C1C] uppercase tracking-wider">
              Recent Deals ({transactions.length})
            </h2>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTx?.id === tx.id
                      ? 'border-[#006A6A] bg-white shadow-md ring-1 ring-[#006A6A]'
                      : 'border-[#C4C6D0] bg-white hover:border-[#006A6A]/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs font-bold text-[#006A6A]">
                      TX #{tx.id}
                    </span>
                    {getStatusBadge(tx.status)}
                  </div>

                  <h4 className="font-sans text-sm font-semibold text-[#181C1C] truncate">
                    {tx.listing?.title || `Auction #${tx.auction}`}
                  </h4>

                  <div className="mt-3 flex justify-between items-baseline pt-2 border-t border-[#F0F2F1]">
                    <span className="font-sans text-xs text-[#44474F]">Amount:</span>
                    <span className="font-mono text-sm font-bold text-[#181C1C]">
                      {Number(tx.amount).toLocaleString()} EGP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Detail Panel */}
          {selectedTx && (
            <div className="lg:col-span-2 space-y-6 bg-white border border-[#C4C6D0] rounded-lg p-6 shadow-2xs">
              <div className="flex justify-between items-start border-b border-[#C4C6D0] pb-4">
                <div>
                  <span className="font-mono text-xs text-[#44474F]">Transaction Overview</span>
                  <h2 className="font-headline text-2xl font-bold text-[#181C1C]">
                    Transaction #{selectedTx.id}
                  </h2>
                  <p className="font-sans text-xs text-[#44474F]">
                    Created: {new Date(selectedTx.created_at).toLocaleString()}
                  </p>
                </div>
                <div>{getStatusBadge(selectedTx.status)}</div>
              </div>

              {/* Financial Calculation Breakdown Card (Prompt Requirement #9 & #3) */}
              <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 space-y-4">
                <h3 className="font-mono font-medium text-xs text-[#181C1C] uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#006A6A]" /> Financial Breakdown
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="flex flex-col bg-white p-4 rounded border border-[#C4C6D0]">
                    <span className="font-sans text-xs text-[#44474F] mb-1">Transaction Amount</span>
                    <span className="font-mono text-xl font-bold text-[#181C1C]">
                      {Number(selectedTx.amount).toLocaleString()} EGP
                    </span>
                    <span className="font-sans text-[10px] text-[#44474F] mt-1">100% Total Bid</span>
                  </div>

                  <div className="flex flex-col bg-white p-4 rounded border border-[#FFE082]">
                    <span className="font-sans text-xs text-[#B78103] mb-1">Platform Commission</span>
                    <span className="font-mono text-xl font-bold text-[#B78103]">
                      {Number(selectedTx.platform_commission).toLocaleString()} EGP
                    </span>
                    <span className="font-sans text-[10px] text-[#B78103] mt-1">5% Platform Fee</span>
                  </div>

                  <div className="flex flex-col bg-white p-4 rounded border border-[#80CBC4]">
                    <span className="font-sans text-xs text-[#006A6A] mb-1">Factory Receives</span>
                    <span className="font-mono text-xl font-bold text-[#006A6A]">
                      {Number(selectedTx.factory_amount).toLocaleString()} EGP
                    </span>
                    <span className="font-sans text-[10px] text-[#006A6A] mt-1">95% Net Payout</span>
                  </div>
                </div>
              </div>

              {/* Parties & Listing Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-[#C4C6D0] rounded p-4 space-y-2">
                  <span className="font-mono text-xs font-semibold text-[#44474F]">Factory (Seller)</span>
                  <div className="font-sans text-sm font-medium text-[#181C1C]">
                    {selectedTx.factory_name || `Factory User #${selectedTx.factory}`}
                  </div>
                </div>

                <div className="border border-[#C4C6D0] rounded p-4 space-y-2">
                  <span className="font-mono text-xs font-semibold text-[#44474F]">Recycler (Buyer)</span>
                  <div className="font-sans text-sm font-medium text-[#181C1C]">
                    {selectedTx.recycler_name || 'Verified Recycling Partner'}
                  </div>
                </div>
              </div>

              {/* Escrow Simulation Action Buttons (Prompt Requirement #9 & #5 & #6) */}
              <div className="border-t border-[#C4C6D0] pt-6 flex flex-col sm:flex-row justify-end items-center gap-4">
                {selectedTx.status === 'Pending' && (
                  <button
                    type="button"
                    onClick={() => handleSimulatePayment(selectedTx.id)}
                    disabled={actionLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-[#006A6A] text-white rounded font-mono text-xs font-medium hover:bg-[#005252] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" /> Simulate Payment (Hold Funds)
                  </button>
                )}

                {(selectedTx.status === 'Held' || selectedTx.status === 'Pending') && (
                  <button
                    type="button"
                    onClick={() => handleReleaseEscrow(selectedTx.id)}
                    disabled={actionLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-[#000A1F] text-white rounded font-mono text-xs font-medium hover:bg-[#00204A] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#80F9CA]" /> Release Escrow Funds
                  </button>
                )}

                {selectedTx.status === 'Released' && (
                  <div className="w-full text-center py-2 px-4 bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] rounded font-mono text-xs">
                    ✓ Escrow Funds Released to Factory Payout Account
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
