"use client";
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calculator, CheckCircle2, TrendingDown, Scale } from 'lucide-react';

export default function TaxCalculator() {
  // Inputs accept string or number for smooth clearing
  const [income, setIncome] = useState<number | string>(1200000);
  const [deductions, setDeductions] = useState<number | string>(150000); // Common 80C deduction

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTax = () => {
    const grossIncome = parseFloat(income.toString()) || 0;
    const totalDeductions = parseFloat(deductions.toString()) || 0;

    // Standard Deduction is ₹50,000 for both regimes
    const standardDeduction = 50000;

    // --- OLD REGIME CALCULATION ---
    // Under old regime, you get standard deduction + user specified deductions (80C, HRA, etc.)
    const oldTaxableIncome = Math.max(0, grossIncome - standardDeduction - totalDeductions);
    let oldTax = 0;

    if (oldTaxableIncome > 250000) {
      if (oldTaxableIncome <= 500000) oldTax = (oldTaxableIncome - 250000) * 0.05;
      else if (oldTaxableIncome <= 1000000) oldTax = 12500 + (oldTaxableIncome - 500000) * 0.2;
      else oldTax = 12500 + 100000 + (oldTaxableIncome - 1000000) * 0.3;
    }
    // Rebate u/s 87A for Old Regime (Up to ₹5L income)
    if (oldTaxableIncome <= 500000) oldTax = 0;

    // --- NEW REGIME CALCULATION ---
    // Under new regime, generally only standard deduction applies (no 80C, HRA, etc.)
    const newTaxableIncome = Math.max(0, grossIncome - standardDeduction);
    let newTax = 0;

    if (newTaxableIncome > 300000) {
      if (newTaxableIncome <= 600000) newTax = (newTaxableIncome - 300000) * 0.05;
      else if (newTaxableIncome <= 900000) newTax = 15000 + (newTaxableIncome - 600000) * 0.1;
      else if (newTaxableIncome <= 1200000) newTax = 15000 + 30000 + (newTaxableIncome - 900000) * 0.15;
      else if (newTaxableIncome <= 1500000) newTax = 15000 + 30000 + 45000 + (newTaxableIncome - 1200000) * 0.2;
      else newTax = 15000 + 30000 + 45000 + 60000 + (newTaxableIncome - 1500000) * 0.3;
    }
    // Rebate u/s 87A for New Regime (Up to ₹7L income)
    if (newTaxableIncome <= 700000) newTax = 0;

    // Add 4% Health & Education Cess
    oldTax = Math.round(oldTax * 1.04);
    newTax = Math.round(newTax * 1.04);

    const isNewBetter = newTax < oldTax;
    const difference = Math.abs(oldTax - newTax);

    return {
      oldTax,
      newTax,
      isNewBetter,
      difference,
      chartData: [
        {
          name: 'Old Tax Regime',
          Tax: oldTax,
          'Take Home': grossIncome - oldTax,
        },
        {
          name: 'New Tax Regime',
          Tax: newTax,
          'Take Home': grossIncome - newTax,
        }
      ]
    };
  };

  const results = calculateTax();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Calculator Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-teal-700 px-6 py-8 sm:px-10 text-center text-white">
            <h1 className="text-3xl font-extrabold sm:text-4xl flex items-center justify-center gap-3">
              <Scale size={36} /> Income Tax Calculator (FY 26-27)
            </h1>
            <p className="mt-3 text-teal-100 text-lg">Compare Old vs. New Tax Regime and maximize your take-home salary.</p>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Input Section */}
            <div className="space-y-8 flex flex-col justify-center">
              
              {/* Annual Income Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Gross Annual Income</label>
                  <div className="relative flex items-center bg-teal-50 rounded-md focus-within:ring-2 focus-within:ring-teal-500 transition-all overflow-hidden border border-teal-100">
                    <span className="pl-3 text-teal-700 font-bold">₹</span>
                    <input 
                      type="text"
                      value={income ? Number(income).toLocaleString('en-IN') : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setIncome(val ? Number(val) : '');
                      }}
                      className="w-32 sm:w-44 bg-transparent text-lg font-bold text-teal-700 text-right py-2 pr-3 outline-none"
                    />
                  </div>
                </div>
                <input 
                  type="range" min="300000" max="50000000" step="50000" 
                  value={Number(income) || 0} onChange={(e) => setIncome(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600" 
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>₹3L</span>
                  <span>₹5Cr</span>
                </div>
              </div>

              {/* Deductions Input (Old Regime) */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700">Total Deductions</label>
                    <span className="text-[10px] text-gray-400">(80C, HRA, 80D - For Old Regime only)</span>
                  </div>
                  <div className="relative flex items-center bg-teal-50 rounded-md focus-within:ring-2 focus-within:ring-teal-500 transition-all overflow-hidden border border-teal-100">
                    <span className="pl-3 text-teal-700 font-bold">₹</span>
                    <input 
                      type="text"
                      value={deductions ? Number(deductions).toLocaleString('en-IN') : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setDeductions(val ? Number(val) : '');
                      }}
                      className="w-32 sm:w-44 bg-transparent text-lg font-bold text-teal-700 text-right py-2 pr-3 outline-none"
                    />
                  </div>
                </div>
                <input 
                  type="range" min="0" max="1000000" step="10000" 
                  value={Number(deductions) || 0} onChange={(e) => setDeductions(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600" 
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>₹0</span>
                  <span>₹10L</span>
                </div>
                <p className="text-xs text-teal-600 mt-2 font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} /> Standard Deduction of ₹50,000 is auto-applied to both regimes.
                </p>
              </div>

            </div>

            {/* Results & Chart Section */}
            <div className="flex flex-col bg-gray-50 p-6 rounded-2xl border border-gray-100">
              
              {/* Recommendation Banner */}
              <div className={`p-4 rounded-xl mb-6 border flex items-center justify-between shadow-sm ${results.difference === 0 ? 'bg-slate-100 border-slate-200' : (results.isNewBetter ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-blue-50 border-blue-200 text-blue-800')}`}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">Recommendation</p>
                  <p className="text-lg font-black">
                    {results.difference === 0 
                      ? "Both regimes are equal" 
                      : (results.isNewBetter ? "New Regime is Better!" : "Old Regime is Better!")}
                  </p>
                </div>
                {results.difference > 0 && (
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">You Save</p>
                    <p className="text-2xl font-black">{formatCurrency(results.difference)}</p>
                  </div>
                )}
              </div>

              {/* Tax Breakdowns */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Old Regime Tax</p>
                  <p className="text-2xl font-black text-gray-800">{formatCurrency(results.oldTax)}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">New Regime Tax</p>
                  <p className="text-2xl font-black text-teal-600">{formatCurrency(results.newTax)}</p>
                </div>
              </div>

              {/* Comparison Chart */}
              <div className="w-full h-56 mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600, fill: '#4b5563' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      formatter={(value) => typeof value === 'number' ? formatCurrency(value) : value ? String(value) : ''}
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="Tax" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    <Bar dataKey="Take Home" fill="#14b8a6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>

          </div>
        </div>

        {/* SEO Article Section for AdSense Approval */}
        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 prose prose-teal max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Deep Dive: Understanding Income Tax in India (FY 2026-27)</h2>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            Navigating the Indian tax system can feel overwhelming, especially with the introduction of multiple tax structures. As we move through <strong>Financial Year (FY) 2026-27 (Assessment Year 2027-28)</strong>, the debate between choosing the Old Tax Regime versus the New Tax Regime is more critical than ever. Making the wrong choice at the beginning of the year can result in losing thousands of rupees from your hard-earned take-home salary. The <strong>mydocready.com Tax Calculator</strong> cuts through the confusion by providing an instant, side-by-side mathematical comparison.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 mt-10">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">The Old Tax Regime</h3>
              <p className="text-gray-600 leading-relaxed">
                The Old Tax Regime rewards individuals who actively invest their money into specified government and financial instruments. Under this regime, you can claim significant deductions to lower your taxable income. This includes Section 80C (up to ₹1.5 Lakhs for PF, LIC, ELSS), Section 80D (Health Insurance), House Rent Allowance (HRA), and Home Loan Interest. However, the base tax rates in higher income brackets are steeper.
              </p>
            </div>
            <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100">
              <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">The New Tax Regime</h3>
              <p className="text-gray-600 leading-relaxed">
                The New Tax Regime was introduced to simplify taxes. It offers significantly lower tax slab rates, making it highly attractive. However, there is a catch: <strong>you must let go of almost all major tax deductions and exemptions</strong> (like HRA, LTA, 80C, and 80D). As of recent updates, the New Regime is the <em>default</em> tax regime, and it offers a standard deduction of ₹50,000, along with a full tax rebate for incomes up to ₹7 Lakhs.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">How Our Calculator Makes the Decision for You</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Choosing the right regime isn't about guessing; it is pure mathematics based on your specific salary structure and investment habits. Our engine processes the following steps:
          </p>
          
          <div className="space-y-5 text-gray-600 mb-8">
            <div className="flex gap-4 items-start">
              <div className="bg-teal-100 p-2 rounded-lg text-teal-700 shrink-0"><Calculator size={20} /></div>
              <div>
                <strong className="text-gray-800 block mb-1">1. Gross Income Processing:</strong> We take your total annual income and immediately apply the ₹50,000 Standard Deduction across both regimes, as this is universally applicable to salaried employees.
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-teal-100 p-2 rounded-lg text-teal-700 shrink-0"><TrendingDown size={20} /></div>
              <div>
                <strong className="text-gray-800 block mb-1">2. Deduction Subtraction (Old Regime):</strong> We subtract your manually entered deductions (like your 80C investments, HRA, etc.) strictly from the Old Regime calculation. 
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-teal-100 p-2 rounded-lg text-teal-700 shrink-0"><Scale size={20} /></div>
              <div>
                <strong className="text-gray-800 block mb-1">3. Slab & Cess Application:</strong> We run the remaining taxable income through the respective tax slabs (0%, 5%, 10%, 15%, 20%, 30%), apply the Section 87A rebate if applicable, and finally add the mandatory 4% Health and Education Cess to give you the exact final liability.
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4">When Should You Choose Which Regime?</h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-3 mb-6">
            <li><strong>You Should Choose the New Regime If:</strong> You are a young earner, you do not have significant investments (like PPF, ELSS, or Life Insurance), you live in a rent-free accommodation (so no HRA), and your income is relatively straightforward. It provides more liquidity and less paperwork.</li>
            <li><strong>You Should Choose the Old Regime If:</strong> You are paying hefty EMIs on a home loan, you maximize your ₹1.5 Lakh 80C limit, you pay premium health insurance, and you have substantial HRA to claim. The cumulative effect of these deductions often out-weighs the benefit of the lower slabs in the new regime.</li>
          </ul>
        </article>

      </div>
    </div>
  );
}