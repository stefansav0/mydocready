"use client";
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function SIPCalculator() {
  // States accept string or number for smooth manual input clearing
  const [monthly, setMonthly] = useState<number | string>(25000);
  const [rate, setRate] = useState<number | string>(12);
  const [years, setYears] = useState<number | string>(10);

  // Formatting currency to Indian numbering system
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateSIP = () => {
    const p = parseFloat(monthly.toString()) || 0;
    const annualRate = parseFloat(rate.toString()) || 0;
    const r = annualRate / 12 / 100; // monthly rate
    const n = parseFloat(years.toString()) * 12 || 0; // total months
    
    if (!p || !r || !n) return { invested: 0, maturity: 0, wealth: 0, chartData: [] };
    
    // SIP Formula: P × ({[1 + i]n – 1} / i) × (1 + i)
    const maturity = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = p * n;
    const wealth = maturity - invested;

    return { 
      invested: invested, 
      maturity: maturity, 
      wealth: wealth,
      chartData: [
        { name: 'Invested Amount', value: invested },
        { name: 'Est. Returns', value: wealth }
      ]
    };
  };

  const results = calculateSIP();
  const COLORS = ['#818cf8', '#c084fc']; // Indigo for Investment, Purple for Returns

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Calculator Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-indigo-600 px-6 py-8 sm:px-10 text-center text-white">
            <h1 className="text-3xl font-extrabold sm:text-4xl">Advanced SIP Calculator</h1>
            <p className="mt-2 text-indigo-100">Plan your mutual fund investments and calculate your wealth accumulation.</p>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Input Section */}
            <div className="space-y-8">
              
              {/* Monthly Investment Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Monthly Investment</label>
                  <div className="relative flex items-center bg-indigo-50 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 transition-all overflow-hidden border border-indigo-100">
                    <span className="pl-3 text-indigo-600 font-bold">₹</span>
                    <input 
                      type="text"
                      value={monthly ? Number(monthly).toLocaleString('en-IN') : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setMonthly(val ? Number(val) : '');
                      }}
                      className="w-32 sm:w-40 bg-transparent text-lg font-bold text-indigo-600 text-right py-1 pr-3 outline-none"
                    />
                  </div>
                </div>
                <input 
                  type="range" min="500" max="1000000" step="500" 
                  value={Number(monthly) || 0} onChange={(e) => setMonthly(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>₹500</span>
                  <span>₹10L</span>
                </div>
              </div>

              {/* Rate Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Expected Return Rate (p.a.)</label>
                  <div className="relative flex items-center bg-indigo-50 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 transition-all overflow-hidden border border-indigo-100">
                    <input 
                      type="text"
                      value={rate}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        if ((val.match(/\./g) || []).length > 1) return;
                        setRate(val);
                      }}
                      className="w-20 sm:w-24 bg-transparent text-lg font-bold text-indigo-600 text-right py-1 pl-3 outline-none"
                    />
                    <span className="pr-3 text-indigo-600 font-bold">%</span>
                  </div>
                </div>
                <input 
                  type="range" min="1" max="30" step="0.1" 
                  value={Number(rate) || 0} onChange={(e) => setRate(e.target.value)} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>1%</span>
                  <span>30%</span>
                </div>
              </div>

              {/* Tenure Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Time Period</label>
                  <div className="relative flex items-center bg-indigo-50 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 transition-all overflow-hidden border border-indigo-100">
                    <input 
                      type="text"
                      value={years}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setYears(val ? Number(val) : '');
                      }}
                      className="w-20 sm:w-24 bg-transparent text-lg font-bold text-indigo-600 text-right py-1 pl-3 outline-none"
                    />
                    <span className="pr-3 pl-1 text-indigo-600 font-bold text-sm">Years</span>
                  </div>
                </div>
                <input 
                  type="range" min="1" max="40" step="1" 
                  value={Number(years) || 0} onChange={(e) => setYears(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>1 Yr</span>
                  <span>40 Yrs</span>
                </div>
              </div>
            </div>

            {/* Results & Chart Section */}
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 font-medium">Total Value</p>
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
                    <Tooltip formatter={(value) => formatCurrency(Number(value) || 0)} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Invested Amount</p>
                  <p className="font-bold text-indigo-500">{formatCurrency(results.invested)}</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Est. Returns</p>
                  <p className="font-bold text-purple-500">{formatCurrency(results.wealth)}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SEO Article Section for AdSense Approval */}
        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 prose prose-indigo max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding Systematic Investment Plans (SIP)</h2>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            A <strong>Systematic Investment Plan (SIP)</strong> is a smart, hassle-free method of investing in mutual funds. Instead of investing a large lump sum all at once, SIP allows you to invest a fixed amount regularly (usually monthly). Our free SIP Calculator at mydocready.com is designed to help you project your future wealth and see the magic of compounding over time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">The Magic of Compounding</h3>
              <p className="text-gray-600 leading-relaxed">
                Albert Einstein reportedly called compound interest the "eighth wonder of the world." In a SIP, the returns you earn on your investments start generating returns of their own. Over a long period, typically 10 to 20 years, this snowball effect can grow even modest monthly investments into a substantial corpus. The earlier you start, the more time your money has to compound.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Rupee Cost Averaging</h3>
              <p className="text-gray-600 leading-relaxed">
                Market timing is notoriously difficult. SIPs solve this through "Rupee Cost Averaging." Because you invest a fixed amount every month, you automatically buy more units when the market is down (prices are low) and fewer units when the market is high (prices are high). This averages out the cost of your investments over time, reducing the impact of market volatility.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">How is SIP Calculated?</h3>
          <div className="space-y-4 text-gray-600 mb-8">
             <p className="mb-2">The mathematical formula used to calculate SIP returns is based on the future value of an annuity due:</p>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-center text-sm mb-4 text-indigo-800">
                FV = P × [ (1 + i)^n - 1 ] / i × (1 + i)
              </div>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li><strong>FV:</strong> Future Value (Maturity Amount)</li>
                <li><strong>P:</strong> Amount you invest at regular intervals (Monthly Investment)</li>
                <li><strong>i:</strong> Periodic rate of return (Annual Rate / 12 / 100)</li>
                <li><strong>n:</strong> Total number of payments (Years × 12)</li>
              </ul>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Use the mydocready.com SIP Calculator?</h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li><strong>Visualize Your Goals:</strong> The interactive pie chart helps you see exactly how much of your final corpus is your hard-earned money versus the wealth generated by the market.</li>
            <li><strong>Interactive Planning:</strong> Use the sliders to play out different scenarios. See how increasing your SIP by just ₹1,000 can drastically change your retirement corpus.</li>
            <li><strong>Accurate & Instant:</strong> Complex calculations that would take hours manually are performed accurately in milliseconds.</li>
          </ul>
        </article>

      </div>
    </div>
  );
}