"use client";
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function FDCalculator() {
  // States accept string or number for smooth manual input clearing
  const [principal, setPrincipal] = useState<number | string>(100000);
  const [rate, setRate] = useState<number | string>(6.5);
  const [years, setYears] = useState<number | string>(5);

  // Formatting currency to Indian numbering system
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateFD = () => {
    const p = parseFloat(principal.toString()) || 0;
    const r = parseFloat(rate.toString()) / 100 || 0;
    const t = parseFloat(years.toString()) || 0;
    
    if (!p || !r || !t) return { maturity: 0, interest: 0, chartData: [] };
    
    // Indian banks typically compound FD interest quarterly
    const maturity = p * Math.pow(1 + r / 4, 4 * t);
    const interest = maturity - p;

    return { 
      maturity: maturity, 
      interest: interest,
      chartData: [
        { name: 'Total Investment', value: p },
        { name: 'Total Returns', value: interest }
      ]
    };
  };

  const results = calculateFD();
  const COLORS = ['#10b981', '#f59e0b']; // Emerald for Investment, Amber for Returns

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Calculator Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-emerald-600 px-6 py-8 sm:px-10 text-center text-white">
            <h1 className="text-3xl font-extrabold sm:text-4xl">Fixed Deposit (FD) Calculator</h1>
            <p className="mt-2 text-emerald-100">Calculate your wealth growth and maturity value accurately.</p>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Input Section */}
            <div className="space-y-8">
              
              {/* Principal Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Total Investment</label>
                  <div className="relative flex items-center bg-emerald-50 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 transition-all overflow-hidden border border-emerald-100">
                    <span className="pl-3 text-emerald-600 font-bold">₹</span>
                    <input 
                      type="text"
                      value={principal ? Number(principal).toLocaleString('en-IN') : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setPrincipal(val ? Number(val) : '');
                      }}
                      className="w-32 sm:w-40 bg-transparent text-lg font-bold text-emerald-600 text-right py-1 pr-3 outline-none"
                    />
                  </div>
                </div>
                <input 
                  type="range" min="10000" max="50000000" step="10000" 
                  value={Number(principal) || 0} onChange={(e) => setPrincipal(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>₹10K</span>
                  <span>₹5Cr</span>
                </div>
              </div>

              {/* Rate Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Interest Rate (p.a.)</label>
                  <div className="relative flex items-center bg-emerald-50 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 transition-all overflow-hidden border border-emerald-100">
                    <input 
                      type="text"
                      value={rate}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        if ((val.match(/\./g) || []).length > 1) return; // Prevent multiple decimals
                        setRate(val);
                      }}
                      className="w-20 sm:w-24 bg-transparent text-lg font-bold text-emerald-600 text-right py-1 pl-3 outline-none"
                    />
                    <span className="pr-3 text-emerald-600 font-bold">%</span>
                  </div>
                </div>
                <input 
                  type="range" min="1" max="15" step="0.1" 
                  value={Number(rate) || 0} onChange={(e) => setRate(e.target.value)} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>1%</span>
                  <span>15%</span>
                </div>
              </div>

              {/* Tenure Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Time Period</label>
                  <div className="relative flex items-center bg-emerald-50 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 transition-all overflow-hidden border border-emerald-100">
                    <input 
                      type="text"
                      value={years}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setYears(val ? Number(val) : '');
                      }}
                      className="w-20 sm:w-24 bg-transparent text-lg font-bold text-emerald-600 text-right py-1 pl-3 outline-none"
                    />
                    <span className="pr-3 pl-1 text-emerald-600 font-bold text-sm">Years</span>
                  </div>
                </div>
                <input 
                  type="range" min="1" max="25" step="1" 
                  value={Number(years) || 0} onChange={(e) => setYears(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>1 Yr</span>
                  <span>25 Yrs</span>
                </div>
              </div>
            </div>

            {/* Results & Chart Section */}
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 font-medium">Total Maturity Value</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">{formatCurrency(results.maturity)}</p>
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
                    <Tooltip formatter={(value) => typeof value === 'number' ? formatCurrency(value) : ''} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Total Investment</p>
                  <p className="font-bold text-emerald-600">{formatCurrency(Number(principal) || 0)}</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Estimated Returns</p>
                  <p className="font-bold text-amber-500">{formatCurrency(results.interest)}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SEO Article Section for AdSense Approval */}
        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 prose prose-emerald max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding Fixed Deposits (FD)</h2>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            A <strong>Fixed Deposit (FD)</strong> is one of the safest and most popular investment instruments offered by banks and non-banking financial companies (NBFCs). It allows investors to deposit a lump sum amount for a predetermined tenure at a fixed interest rate. Our mydocready.com FD Calculator helps you accurately predict your wealth accumulation so you can plan your financial goals with certainty.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">How Do Fixed Deposits Work?</h3>
              <p className="text-gray-600 leading-relaxed">
                When you open an FD, you lock in your money for a specific period ranging from a few days to several years. In return, the financial institution guarantees a fixed interest rate, which is generally higher than that of a standard savings account. Because the rate is locked in at the time of deposit, market fluctuations do not impact your returns, making it an excellent hedge against market volatility.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">How is FD Interest Calculated?</h3>
              <p className="text-gray-600 leading-relaxed mb-2">Most banks compound FD interest quarterly. The formula used is:</p>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-center text-sm mb-2 text-emerald-800">
                A = P(1 + r/n)^(n*t)
              </div>
              <ul className="text-sm text-gray-600 list-disc pl-5">
                <li><strong>A:</strong> Maturity Amount</li>
                <li><strong>P:</strong> Principal Investment Amount</li>
                <li><strong>r:</strong> Annual Interest Rate (in decimal)</li>
                <li><strong>n:</strong> Number of times interest is compounded per year (usually 4)</li>
                <li><strong>t:</strong> Tenure of the deposit in years</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Benefits of Investing in an FD</h3>
          <div className="space-y-4 text-gray-600 mb-8">
            <p><strong>1. Guaranteed Returns:</strong> Unlike mutual funds or stocks, your returns are not subject to market risks. You know exactly what you will receive at maturity.</p>
            <p><strong>2. Power of Compounding:</strong> By choosing a cumulative FD, your earned interest is reinvested along with the principal, accelerating your wealth growth over time.</p>
            <p><strong>3. High Liquidity:</strong> While FDs have a lock-in period, you can usually withdraw your money prematurely in case of emergencies (though a small penalty may apply).</p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Use the mydocready.com FD Calculator?</h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li><strong>Precision Planning:</strong> Instantly view your maturity amount based on current bank rates.</li>
            <li><strong>Visual Insights:</strong> Our interactive chart clearly displays the ratio of your investment to your wealth gained.</li>
            <li><strong>Goal Alignment:</strong> Experiment with different tenures and principal amounts to see what it takes to reach your financial milestones.</li>
          </ul>
        </article>

      </div>
    </div>
  );
}