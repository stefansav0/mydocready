"use client";
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function PercentageCalculator() {
  // States accept string or number for smooth manual input clearing
  const [percent, setPercent] = useState<number | string>(15);
  const [value, setValue] = useState<number | string>(15000);

  // Formatting numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
    }).format(num);
  };

  const calculateResult = () => {
    const p = parseFloat(percent.toString()) || 0;
    const v = parseFloat(value.toString()) || 0;
    
    if (isNaN(p) || isNaN(v) || v === 0) return { result: 0, remaining: 0, chartData: [] };
    
    const result = (p / 100) * v;
    const remaining = v - result;

    let chartData = [];
    // Only show a split pie chart if percentage is between 0 and 100
    if (p >= 0 && p <= 100) {
      chartData = [
        { name: 'Calculated Value', value: result },
        { name: 'Remaining Value', value: remaining }
      ];
    } else {
      // If it's over 100%, just show the result block
      chartData = [
        { name: 'Calculated Value', value: result }
      ];
    }

    return { 
      result, 
      remaining,
      chartData 
    };
  };

  const results = calculateResult();
  const COLORS = ['#e11d48', '#fca5a5']; // Rose for Result, Light Red for Remaining

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Calculator Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-rose-600 px-6 py-8 sm:px-10 text-center text-white">
            <h1 className="text-3xl font-extrabold sm:text-4xl">Advanced Percentage Calculator</h1>
            <p className="mt-2 text-rose-100">Quickly solve percentage calculations for discounts, tips, margins, and more.</p>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Input Section */}
            <div className="space-y-8 flex flex-col justify-center">
              
              {/* Percentage Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">What is (%)</label>
                  <div className="relative flex items-center bg-rose-50 rounded-md focus-within:ring-2 focus-within:ring-rose-500 transition-all overflow-hidden border border-rose-100">
                    <input 
                      type="text"
                      value={percent}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        if ((val.match(/\./g) || []).length > 1) return;
                        setPercent(val);
                      }}
                      className="w-20 sm:w-24 bg-transparent text-lg font-bold text-rose-600 text-right py-2 pl-3 outline-none"
                    />
                    <span className="pr-3 pl-1 text-rose-600 font-bold">%</span>
                  </div>
                </div>
                <input 
                  type="range" min="0" max="100" step="1" 
                  value={Number(percent) || 0} onChange={(e) => setPercent(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-600" 
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Value Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Of Value</label>
                  <div className="relative flex items-center bg-rose-50 rounded-md focus-within:ring-2 focus-within:ring-rose-500 transition-all overflow-hidden border border-rose-100">
                    <input 
                      type="text"
                      value={value ? Number(value).toLocaleString('en-IN') : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setValue(val ? Number(val) : '');
                      }}
                      className="w-32 sm:w-44 bg-transparent text-lg font-bold text-rose-600 text-right py-2 pr-3 outline-none"
                    />
                  </div>
                </div>
                <input 
                  type="range" min="10" max="1000000" step="10" 
                  value={Number(value) || 0} onChange={(e) => setValue(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-600" 
                />
              </div>

            </div>

            {/* Results & Chart Section */}
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="text-center mb-6 w-full">
                <p className="text-sm text-gray-500 font-medium">Result</p>
                <div className="bg-rose-100 py-4 rounded-xl mt-2 border border-rose-200">
                  <p className="text-4xl sm:text-5xl font-extrabold text-rose-700">{formatNumber(results.result)}</p>
                </div>
              </div>

              {results.chartData.length > 0 && Number(percent) >= 0 && Number(percent) <= 100 && (
                <div className="w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={results.chartData}
                        cx="50%" cy="50%" innerRadius={50} outerRadius={70}
                        paddingAngle={2} dataKey="value"
                      >
                        {results.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: string | number | readonly (string | number)[] | undefined) => {
                        const value = Array.isArray(val) ? val[0] : val;
                        return formatNumber(Number(value ?? 0));
                      }} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* SEO Article Section for AdSense Approval */}
        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 prose prose-rose max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding Percentages: Formulas and Real-life Applications</h2>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            The word <strong>percentage</strong> comes from the Latin word <em>per centum</em>, meaning "by the hundred." In mathematics, a percentage is a number or ratio expressed as a fraction of 100. It is one of the most frequently used mathematical concepts in our daily lives, used for everything from calculating store discounts and restaurant tips to evaluating financial returns and interest rates. Our free Percentage Calculator at mydocready.com is built to give you accurate results without the mental gymnastics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">How to Calculate a Percentage?</h3>
              <p className="text-gray-600 leading-relaxed">
                The most basic percentage formula is asking "What is X% of Y?". To solve this manually, you convert the percentage into a decimal by dividing it by 100, and then multiply that decimal by your base number.
                <br /><br />
                <strong>Example:</strong> What is 15% of 2,000?
                <br />
                Convert 15% to a decimal: 15 ÷ 100 = 0.15
                <br />
                Multiply by the base: 0.15 × 2000 = 300.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">The Mathematical Formula</h3>
              <p className="text-gray-600 leading-relaxed mb-2">The formula utilized by our calculator is:</p>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-center text-sm mb-2 text-rose-800 border border-rose-100">
                Result = ( P / 100 ) × V
              </div>
              <ul className="text-sm text-gray-600 list-disc pl-5">
                <li><strong>Result:</strong> The final calculated value</li>
                <li><strong>P:</strong> The Percentage you wish to find</li>
                <li><strong>V:</strong> The Base Value</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Everyday Uses for a Percentage Calculator</h3>
          <div className="space-y-4 text-gray-600 mb-8">
             <p><strong>1. Shopping Discounts:</strong> If a ₹3,500 jacket is on sale for 30% off, you can quickly find out that your discount is ₹1,050. This means you will only pay ₹2,450.</p>
             <p><strong>2. Taxes and Tipping:</strong> Whether adding an 18% GST to an invoice or calculating a 15% tip on a restaurant bill, percentages dictate how much extra you need to pay over the base amount.</p>
             <p><strong>3. Business Profit Margins:</strong> Business owners constantly use percentages to calculate gross margins, net profit margins, and markups to ensure they are pricing their goods correctly.</p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Use the mydocready.com Percentage Calculator?</h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li><strong>Interactive UI:</strong> The dynamic slider allows you to visualize how changing the percentage impacts the final result in real-time.</li>
            <li><strong>Visual Clarity:</strong> The built-in pie chart instantly demonstrates the proportion of your result relative to the total value.</li>
            <li><strong>Speed & Accuracy:</strong> Stop using complicated spreadsheet formulas or error-prone mental math. Get your exact answer in milliseconds.</li>
          </ul>
        </article>

      </div>
    </div>
  );
}