"use client";
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function GSTCalculator() {
  const [amount, setAmount] = useState<number | string>(10000);
  const [rate, setRate] = useState<number>(18);
  const [mode, setMode] = useState<'add' | 'remove'>('add');

  // GST specifically needs decimal precision for paise
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const calculateGST = () => {
    const a = parseFloat(amount.toString()) || 0;
    const r = parseFloat(rate.toString()) || 0;
    
    if (!a || !r) return { net: 0, gst: 0, gross: 0, cgst: 0, sgst: 0, chartData: [] };

    let net = 0;
    let gst = 0;
    let gross = 0;

    if (mode === 'add') {
      net = a;
      gst = (a * r) / 100;
      gross = net + gst;
    } else {
      gross = a;
      net = a / (1 + r / 100);
      gst = gross - net;
    }

    return { 
      net, 
      gst, 
      gross,
      cgst: gst / 2,
      sgst: gst / 2,
      chartData: [
        { name: 'Net Amount', value: net },
        { name: 'Total GST', value: gst }
      ]
    };
  };

  const results = calculateGST();
  const COLORS = ['#64748b', '#ea580c']; // Slate for Net Amount, Orange for GST
  const GST_SLABS = [3, 5, 12, 18, 28];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Calculator Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-orange-600 px-6 py-8 sm:px-10 text-center text-white">
            <h1 className="text-3xl font-extrabold sm:text-4xl">GST Calculator</h1>
            <p className="mt-2 text-orange-100">Easily calculate Goods and Services Tax for your invoices and purchases.</p>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Input Section */}
            <div className="space-y-8">
              
              {/* Mode Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setMode('add')} 
                  className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${mode === 'add' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  + Add GST
                </button>
                <button 
                  onClick={() => setMode('remove')} 
                  className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${mode === 'remove' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  - Remove GST
                </button>
              </div>

              {/* Amount Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    {mode === 'add' ? 'Base Amount' : 'Total Amount (Incl. GST)'}
                  </label>
                  <div className="relative flex items-center bg-orange-50 rounded-md focus-within:ring-2 focus-within:ring-orange-500 transition-all overflow-hidden border border-orange-100">
                    <span className="pl-3 text-orange-600 font-bold">₹</span>
                    <input 
                      type="text"
                      value={amount ? Number(amount).toLocaleString('en-IN') : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setAmount(val ? Number(val) : '');
                      }}
                      className="w-32 sm:w-40 bg-transparent text-lg font-bold text-orange-600 text-right py-2 pr-3 outline-none"
                    />
                  </div>
                </div>
                <input 
                  type="range" min="100" max="1000000" step="100" 
                  value={Number(amount) || 0} onChange={(e) => setAmount(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600" 
                />
              </div>

              {/* Tax Slab Selection */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Select GST Slab</label>
                <div className="flex flex-wrap gap-3">
                  {GST_SLABS.map((slab) => (
                    <button
                      key={slab}
                      onClick={() => setRate(slab)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm border transition-all duration-200 ${
                        rate === slab 
                        ? 'bg-orange-600 border-orange-600 text-white shadow-md' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      {slab}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results & Chart Section */}
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500 font-medium">Total Billed Amount</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">{formatCurrency(results.gross)}</p>
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
                    <Tooltip formatter={(value: string | number | readonly (string | number)[] | undefined) => {
                      const numericValue = Array.isArray(value) ? value[0] : value;
                      return formatCurrency(Number(numericValue ?? 0));
                    }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Breakdown */}
              <div className="w-full mt-2 grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 col-span-2 flex justify-between px-6">
                  <span className="text-sm font-medium text-gray-500">Net Amount:</span>
                  <span className="font-bold text-gray-900">{formatCurrency(results.net)}</span>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">CGST ({rate / 2}%)</p>
                  <p className="font-bold text-orange-600">{formatCurrency(results.cgst)}</p>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">SGST ({rate / 2}%)</p>
                  <p className="font-bold text-orange-600">{formatCurrency(results.sgst)}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SEO Article Section for AdSense Approval */}
        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 prose prose-orange max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding Goods and Services Tax (GST)</h2>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            The <strong>Goods and Services Tax (GST)</strong> is a comprehensive, multi-stage, destination-based tax that is levied on every value addition. In India, GST has replaced many indirect taxes, simplifying the taxation system. Whether you are a business owner generating invoices or a consumer calculating the final price of a product, our free GST Calculator at mydocready.com ensures you get precise numbers instantly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Adding vs. Removing GST</h3>
              <p className="text-gray-600 leading-relaxed">
                <strong>Adding GST:</strong> This calculates the final price of an item when you only know the base cost. For example, if a service costs ₹1,000 and the GST rate is 18%, the calculator adds ₹180, making the final bill ₹1,180.
                <br /><br />
                <strong>Removing GST:</strong> This is a reverse calculation. If an item is sold for ₹1,180 (inclusive of 18% GST), removing the GST reveals that the original base price was ₹1,000 and the tax paid was ₹180.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">GST Calculation Formulas</h3>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm mb-4 text-orange-800 border border-orange-100">
                <p className="mb-2"><strong>To Add GST:</strong></p>
                <p>GST = (Base Amount × GST Rate) / 100</p>
                <p>Total = Base Amount + GST</p>
                <hr className="my-2 border-orange-200" />
                <p className="mb-2"><strong>To Remove GST:</strong></p>
                <p>Base = Total Amount / [1 + (GST Rate / 100)]</p>
                <p>GST = Total Amount - Base</p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Components of GST in India</h3>
          <div className="space-y-4 text-gray-600 mb-8">
             <p><strong>CGST (Central GST):</strong> The tax collected by the Central Government on an intra-state (within the same state) sale. Our calculator automatically divides the total GST to show the CGST component.</p>
             <p><strong>SGST (State GST):</strong> The tax collected by the State Government on an intra-state sale. It is usually exactly equal to the CGST amount.</p>
             <p><strong>IGST (Integrated GST):</strong> The tax collected by the Central Government for inter-state (between two different states) sales. The total GST calculated by our tool can be treated as IGST if the transaction is out-of-state.</p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Use the mydocready.com GST Calculator?</h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li><strong>Invoice Ready:</strong> Provides an exact breakdown of Net Amount, CGST, and SGST needed for generating compliant invoices.</li>
            <li><strong>Precision:</strong> Financial rounding can cause headaches. Our tool calculates down to the exact paisa to prevent accounting discrepancies.</li>
            <li><strong>Time-Saving:</strong> The easy-to-use toggle lets you flip between forward and reverse tax calculations with a single click.</li>
          </ul>
        </article>

      </div>
    </div>
  );
}