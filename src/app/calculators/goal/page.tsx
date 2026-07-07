"use client";
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function GoalCalculator() {
  // States accept string or number for smooth manual input clearing
  const [target, setTarget] = useState<number | string>(10000000); // 1 Crore default
  const [years, setYears] = useState<number | string>(10);
  const [rate, setRate] = useState<number | string>(12);

  // Formatting currency to Indian numbering system
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateGoal = () => {
    const t = parseFloat(target.toString()) || 0;
    const annualRate = parseFloat(rate.toString()) || 0;
    const r = annualRate / 12 / 100; // monthly interest rate
    const n = parseFloat(years.toString()) * 12 || 0; // total months
    
    if (!t || !r || !n) return { monthly: 0, invested: 0, wealth: 0, chartData: [] };
    
    // Inverse SIP Formula: Monthly Investment required for a Target Future Value
    const monthly = t / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const invested = monthly * n;
    const wealth = t - invested;

    return { 
      monthly: monthly,
      invested: invested, 
      wealth: wealth,
      chartData: [
        { name: 'Total Principal Invested', value: invested },
        { name: 'Wealth Gained (Returns)', value: wealth }
      ]
    };
  };

  const results = calculateGoal();
  const COLORS = ['#9333ea', '#d946ef']; // Purple for Invested, Fuchsia for Returns

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Calculator Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-purple-600 px-6 py-8 sm:px-10 text-center text-white">
            <h1 className="text-3xl font-extrabold sm:text-4xl">Financial Goal Planner</h1>
            <p className="mt-2 text-purple-100">Find out exactly how much you need to save monthly to achieve your dreams.</p>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Input Section */}
            <div className="space-y-8">
              
              {/* Target Amount Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Target Amount</label>
                  <div className="relative flex items-center bg-purple-50 rounded-md focus-within:ring-2 focus-within:ring-purple-500 transition-all overflow-hidden border border-purple-100">
                    <span className="pl-3 text-purple-600 font-bold">₹</span>
                    <input 
                      type="text"
                      value={target ? Number(target).toLocaleString('en-IN') : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setTarget(val ? Number(val) : '');
                      }}
                      className="w-32 sm:w-44 bg-transparent text-lg font-bold text-purple-600 text-right py-1 pr-3 outline-none"
                    />
                  </div>
                </div>
                <input 
                  type="range" min="100000" max="100000000" step="100000" 
                  value={Number(target) || 0} onChange={(e) => setTarget(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>₹1L</span>
                  <span>₹10Cr</span>
                </div>
              </div>

              {/* Time to Goal Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Time to Goal</label>
                  <div className="relative flex items-center bg-purple-50 rounded-md focus-within:ring-2 focus-within:ring-purple-500 transition-all overflow-hidden border border-purple-100">
                    <input 
                      type="text"
                      value={years}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setYears(val ? Number(val) : '');
                      }}
                      className="w-20 sm:w-24 bg-transparent text-lg font-bold text-purple-600 text-right py-1 pl-3 outline-none"
                    />
                    <span className="pr-3 pl-1 text-purple-600 font-bold text-sm">Years</span>
                  </div>
                </div>
                <input 
                  type="range" min="1" max="40" step="1" 
                  value={Number(years) || 0} onChange={(e) => setYears(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>1 Yr</span>
                  <span>40 Yrs</span>
                </div>
              </div>

              {/* Rate Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Expected Rate of Return (p.a.)</label>
                  <div className="relative flex items-center bg-purple-50 rounded-md focus-within:ring-2 focus-within:ring-purple-500 transition-all overflow-hidden border border-purple-100">
                    <input 
                      type="text"
                      value={rate}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        if ((val.match(/\./g) || []).length > 1) return;
                        setRate(val);
                      }}
                      className="w-20 sm:w-24 bg-transparent text-lg font-bold text-purple-600 text-right py-1 pl-3 outline-none"
                    />
                    <span className="pr-3 text-purple-600 font-bold">%</span>
                  </div>
                </div>
                <input 
                  type="range" min="1" max="30" step="0.1" 
                  value={Number(rate) || 0} onChange={(e) => setRate(e.target.value)} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>1%</span>
                  <span>30%</span>
                </div>
              </div>
            </div>

            {/* Results & Chart Section */}
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="text-center mb-6 w-full">
                <p className="text-sm text-gray-500 font-medium">Required Monthly Investment</p>
                <div className="bg-purple-100 py-3 rounded-xl mt-2 border border-purple-200">
                  <p className="text-4xl font-extrabold text-purple-700">{formatCurrency(results.monthly)}</p>
                </div>
              </div>

              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={results.chartData}
                      cx="50%" cy="50%" innerRadius={55} outerRadius={75}
                      paddingAngle={5} dataKey="value"
                    >
                      {results.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatCurrency(Number(Array.isArray(value) ? value[0] : value) || 0)} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full mt-4 grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Total Invested</p>
                  <p className="font-bold text-purple-600">{formatCurrency(results.invested)}</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Wealth Gained</p>
                  <p className="font-bold text-fuchsia-500">{formatCurrency(results.wealth)}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SEO Article Section for AdSense Approval */}
        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 prose prose-purple max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Financial Goal Planning: Reverse Engineering Your Wealth</h2>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            Whether you want to buy a house, fund your child's higher education, or build a comfortable retirement corpus, having a specific financial goal is the first step toward wealth creation. But knowing what you want isn't enough; you need to know exactly how to get there. The <strong>mydocready.com Goal Planner</strong> uses reverse mathematics to tell you precisely how much you need to invest every month to hit your target.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">What is a Reverse SIP?</h3>
              <p className="text-gray-600 leading-relaxed">
                A standard SIP (Systematic Investment Plan) calculator takes your monthly investment amount and tells you what your final corpus will be. A Goal Planner (or Reverse SIP Calculator) does the exact opposite. You input your desired final amount (e.g., ₹1 Crore for retirement), and the calculator works backward, factoring in compounding interest, to determine the monthly EMI required to reach that corpus.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">The Mathematics of Goal Planning</h3>
              <p className="text-gray-600 leading-relaxed mb-2">Our tool utilizes the inverse Future Value of an Annuity formula:</p>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-center text-sm mb-2 text-purple-800 border border-purple-100">
                Monthly = Target / [ ((1 + i)^n - 1) / i * (1 + i) ]
              </div>
              <ul className="text-sm text-gray-600 list-disc pl-5">
                <li><strong>Target:</strong> The future financial goal you wish to achieve.</li>
                <li><strong>i:</strong> Monthly interest rate (Expected Annual Rate / 12 / 100).</li>
                <li><strong>n:</strong> Total number of months (Years × 12).</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Crucial Factors in Goal Planning</h3>
          <div className="space-y-4 text-gray-600 mb-8">
             <p><strong>1. Time Horizon:</strong> Time is your greatest asset in investing. Because of the power of compounding, extending your investment period by just 3 to 5 years can drastically reduce the monthly amount you need to save.</p>
             <p><strong>2. Expected Rate of Return:</strong> Different asset classes offer different returns. Equity mutual funds might historically offer 10-12%, while debt funds or FDs might offer 6-8%. Be realistic with your expected returns based on your risk appetite.</p>
             <p><strong>3. Inflation (The Silent Wealth Killer):</strong> Always aim for a target amount slightly higher than what you think you need today. A car that costs ₹10 Lakhs today will likely cost significantly more 10 years from now due to inflation.</p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Use the mydocready.com Goal Planner?</h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li><strong>Clarity and Actionability:</strong> It translates vague financial dreams into concrete, actionable monthly steps.</li>
            <li><strong>Visualizing Compounding:</strong> Our interactive chart shows you the heavy lifting done by compound interest, revealing that a massive portion of your final goal is actually generated by returns, not just your principal.</li>
            <li><strong>Instant Adjustments:</strong> Play with the timeline sliders to see how delaying your goal by a few years can significantly lower your required monthly investment.</li>
          </ul>
        </article>

      </div>
    </div>
  );
}