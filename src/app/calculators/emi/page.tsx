"use client";
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function EMICalculator() {
  // States accept string or number so the input can be cleared completely without breaking
  const [principal, setPrincipal] = useState<number | string>(16400000);
  const [rate, setRate] = useState<number | string>(8.5);
  const [years, setYears] = useState<number | string>(10);

  // Formatting currency to Indian numbering system
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateEMI = () => {
    const p = parseFloat(principal.toString()) || 0;
    const r = parseFloat(rate.toString()) / 12 / 100 || 0;
    const n = parseFloat(years.toString()) * 12 || 0;
    
    if (!p || !r || !n) return { emi: 0, total: 0, interest: 0, chartData: [] };
    
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    const interest = total - p;

    return { 
      emi: emi, 
      total: total, 
      interest: interest,
      chartData: [
        { name: 'Principal Amount', value: p },
        { name: 'Total Interest', value: interest }
      ]
    };
  };

  const results = calculateEMI();
  const COLORS = ['#3b82f6', '#f97316']; // Blue for Principal, Orange for Interest

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Calculator Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 px-6 py-8 sm:px-10 text-center text-white">
            <h1 className="text-3xl font-extrabold sm:text-4xl">Advanced EMI Calculator</h1>
            <p className="mt-2 text-blue-100">Calculate your monthly loan installments accurately.</p>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Input Section */}
            <div className="space-y-8">
              
              {/* Principal Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
                  <div className="relative flex items-center bg-blue-50 rounded-md focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden border border-blue-100">
                    <span className="pl-3 text-blue-600 font-bold">₹</span>
                    <input 
                      type="text"
                      value={principal ? Number(principal).toLocaleString('en-IN') : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setPrincipal(val ? Number(val) : '');
                      }}
                      className="w-32 sm:w-40 bg-transparent text-lg font-bold text-blue-600 text-right py-1 pr-3 outline-none"
                    />
                  </div>
                </div>
                <input 
                  type="range" min="100000" max="50000000" step="50000" 
                  value={Number(principal) || 0} onChange={(e) => setPrincipal(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>₹1L</span>
                  <span>₹5Cr</span>
                </div>
              </div>

              {/* Rate Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Interest Rate (p.a.)</label>
                  <div className="relative flex items-center bg-blue-50 rounded-md focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden border border-blue-100">
                    <input 
                      type="text"
                      value={rate}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        if ((val.match(/\./g) || []).length > 1) return; // Prevent multiple decimal points
                        setRate(val);
                      }}
                      className="w-20 sm:w-24 bg-transparent text-lg font-bold text-blue-600 text-right py-1 pl-3 outline-none"
                    />
                    <span className="pr-3 text-blue-600 font-bold">%</span>
                  </div>
                </div>
                <input 
                  type="range" min="1" max="25" step="0.1" 
                  value={Number(rate) || 0} onChange={(e) => setRate(e.target.value)} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>1%</span>
                  <span>25%</span>
                </div>
              </div>

              {/* Tenure Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Loan Tenure</label>
                  <div className="relative flex items-center bg-blue-50 rounded-md focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden border border-blue-100">
                    <input 
                      type="text"
                      value={years}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setYears(val ? Number(val) : '');
                      }}
                      className="w-20 sm:w-24 bg-transparent text-lg font-bold text-blue-600 text-right py-1 pl-3 outline-none"
                    />
                    <span className="pr-3 pl-1 text-blue-600 font-bold text-sm">Years</span>
                  </div>
                </div>
                <input 
                  type="range" min="1" max="30" step="1" 
                  value={Number(years) || 0} onChange={(e) => setYears(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>1 Yr</span>
                  <span>30 Yrs</span>
                </div>
              </div>
            </div>

            {/* Results & Chart Section */}
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 font-medium">Equated Monthly Installment (EMI)</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">{formatCurrency(results.emi)}</p>
              </div>

              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={results.chartData}
                      cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                      paddingAngle={5} dataKey="value"
                    >
                      {results.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatCurrency(Number(value) || 0)} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Total Principal</p>
                  <p className="font-bold text-blue-600">{formatCurrency(Number(principal) || 0)}</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Total Interest</p>
                  <p className="font-bold text-orange-500">{formatCurrency(results.interest)}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SEO Article Section for AdSense Approval */}
        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 prose prose-blue max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding Equated Monthly Installments (EMI)</h2>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            Taking a loan is a significant financial decision, whether it's for buying your dream home, a new car, or managing personal expenses. To ensure your finances remain stable, it is critical to understand your repayment schedule. This is where an <strong>Equated Monthly Installment (EMI)</strong> comes into play. Our free EMI Calculator at mydocready.com is designed to help you plan your monthly budget with precision.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">What is an EMI?</h3>
              <p className="text-gray-600 leading-relaxed">
                An EMI is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. Equated monthly installments are applied to both interest and principal each month so that over a specified number of years, the loan is paid off in full. In the initial years of your loan, a larger portion of the EMI goes toward paying the interest. As the loan matures, the principal repayment proportion increases.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">How is EMI Calculated?</h3>
              <p className="text-gray-600 leading-relaxed mb-2">The mathematical formula used to calculate EMI is:</p>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-center text-sm mb-2 text-blue-800">
                E = P × r × (1 + r)^n / ((1 + r)^n - 1)
              </div>
              <ul className="text-sm text-gray-600 list-disc pl-5">
                <li><strong>E:</strong> EMI Amount</li>
                <li><strong>P:</strong> Principal Loan Amount</li>
                <li><strong>r:</strong> Monthly Interest Rate (Annual Rate / 12 / 100)</li>
                <li><strong>n:</strong> Loan Tenure in Months</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Factors That Affect Your EMI</h3>
          <div className="space-y-4 text-gray-600 mb-8">
            <p><strong>1. The Principal Amount:</strong> This is the total amount you borrow. A higher principal amount naturally leads to a higher monthly EMI.</p>
            <p><strong>2. Interest Rate:</strong> The rate at which the bank lends you money. Even a slight reduction in the interest rate can significantly lower your total payable interest over the loan tenure.</p>
            <p><strong>3. Loan Tenure:</strong> The duration over which you choose to repay the loan. A longer tenure reduces your monthly EMI burden but increases the total interest paid over the life of the loan.</p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Use the mydocready.com EMI Calculator?</h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li><strong>Instant Results:</strong> Complex mathematical calculations are resolved in milliseconds.</li>
            <li><strong>Visual Data:</strong> Our interactive pie chart helps you visually differentiate between the principal amount and the interest burden.</li>
            <li><strong>Financial Planning:</strong> By adjusting the range sliders, you can find the perfect balance between loan amount, tenure, and an EMI you can comfortably afford.</li>
            <li><strong>Accuracy:</strong> Eliminates human error in manual calculations.</li>
          </ul>
        </article>

      </div>
    </div>
  );
}