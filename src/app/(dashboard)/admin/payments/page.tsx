import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Download, CreditCard, CheckCircle2, Clock, XCircle, Receipt } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDistanceToNow, format } from 'date-fns';

export const metadata: Metadata = { title: 'Payments Management' };

export default async function AdminPaymentsPage() {
  const supabase = await createServerSupabaseClient();
  
  // Fetch payments with joined college data
  const { data: payments } = await supabase
    .from('payments')
    .select('*, colleges(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payments</h1>
          <p className="text-slate-500 mt-1">Track and manage all subscription payments across the platform.</p>
        </div>
        <Button variant="outline" className="text-slate-600 bg-white border-slate-200 hover:bg-slate-50">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search by Order ID or Razorpay ID..." className="pl-9 border-slate-200 focus-visible:ring-indigo-500" />
            </div>
            <select className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all">
              <option value="">All Statuses</option>
              <option value="success">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm shadow-slate-200/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="p-4 font-medium text-slate-500">Transaction Info</th>
                  <th className="p-4 font-medium text-slate-500">College</th>
                  <th className="p-4 font-medium text-slate-500">Amount</th>
                  <th className="p-4 font-medium text-slate-500">Status</th>
                  <th className="p-4 font-medium text-slate-500">Date</th>
                  <th className="p-4 font-medium text-slate-500 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments && payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 group-hover:text-[#bce600] transition-colors truncate w-32 sm:w-auto">
                              {payment.razorpay_order_id || 'N/A'}
                            </p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5 truncate w-32 sm:w-auto">
                              {payment.razorpay_payment_id || 'No Payment ID'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-700">
                        {/* @ts-ignore */}
                        {payment.colleges?.name || 'Unknown College'}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-900">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: payment.currency || 'INR', maximumFractionDigits: 0 }).format(payment.amount || 0)}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={`
                          ${payment.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            payment.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                            'bg-red-50 text-red-700 border-red-200'}
                        `}>
                          {payment.status === 'success' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {payment.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {payment.status === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                          {payment.status?.toUpperCase() || 'UNKNOWN'}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-600">
                        <p className="font-medium text-slate-900">{format(new Date(payment.created_at), 'MMM dd, yyyy')}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{formatDistanceToNow(new Date(payment.created_at), { addSuffix: true })}</p>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" disabled={!payment.invoice_url}>
                          <Receipt className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      <CreditCard className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                      <p>No payments recorded yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
