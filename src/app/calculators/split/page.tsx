"use client";
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Download, Receipt, Users, CheckCircle2, Plus, Trash2, MessageCircle } from 'lucide-react';

interface Friend {
  id: number;
  name: string;
}

export default function SplitCalculator() {
  const [eventName, setEventName] = useState<string>('Weekend Dinner');
  const [amount, setAmount] = useState<number | string>(5000);
  const [tax, setTax] = useState<number | string>(5); // 5% GST
  const [tip, setTip] = useState<number | string>(0);
  
  // Dynamic Friends List instead of just a number
  const [friends, setFriends] = useState<Friend[]>([
    { id: 1, name: 'Me (Paying)' },
    { id: 2, name: 'Rahul' },
    { id: 3, name: 'Priya' },
    { id: 4, name: 'Amit' }
  ]);

  const addFriend = () => {
    const newId = friends.length > 0 ? Math.max(...friends.map(f => f.id)) + 1 : 1;
    setFriends([...friends, { id: newId, name: `Friend ${friends.length + 1}` }]);
  };

  const removeFriend = (id: number) => {
    if (friends.length > 1) {
      setFriends(friends.filter(f => f.id !== id));
    }
  };

  const updateFriendName = (id: number, newName: string) => {
    setFriends(friends.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  // Formatting currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const calculateSplit = () => {
    const baseAmount = parseFloat(amount.toString()) || 0;
    const taxRate = parseFloat(tax.toString()) || 0;
    const tipRate = parseFloat(tip.toString()) || 0;
    const numPeople = Math.max(1, friends.length);

    if (!baseAmount) {
      return { baseAmount: 0, taxAmount: 0, tipAmount: 0, grandTotal: 0, perPerson: 0 };
    }

    const taxAmount = (baseAmount * taxRate) / 100;
    const tipAmount = (baseAmount * tipRate) / 100;
    const grandTotal = baseAmount + taxAmount + tipAmount;
    const perPerson = grandTotal / numPeople;

    return { baseAmount, taxAmount, tipAmount, grandTotal, perPerson, numPeople };
  };

  const results = calculateSplit();

  // Feature 1: Send personalized WhatsApp message
  const shareToWhatsApp = (friendName: string) => {
    const actualName = friendName.trim() === '' || friendName.includes('Friend') ? 'there' : friendName;
    const event = eventName || 'our outing';
    
    const text = `Hey ${actualName}! 👋\nHere is the breakdown for *${event}*.\n\n*Total Bill:* ${formatCurrency(results.grandTotal)}\n*Split among:* ${results.numPeople} people\n\n👉 *Your Share:* ${formatCurrency(results.perPerson)} 💸\n\nPlease UPI me when you can! Thanks! \n\n_(Calculated via mydocready.com)_`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Feature 2: Download overall Summary as Text Receipt
  const handleDownloadReceipt = () => {
    const date = new Date().toLocaleDateString('en-IN');
    const namesList = friends.map(f => f.name).join(', ');
    
    const receiptText = `
==================================
      MYDOCREADY BILL SPLIT
==================================
Event : ${eventName || 'Group Expense'}
Date  : ${date}
----------------------------------
Base Bill    : ${formatCurrency(results.baseAmount)}
Tax (${tax}%)     : ${formatCurrency(results.taxAmount)}
Tip (${tip}%)     : ${formatCurrency(results.tipAmount)}
----------------------------------
GRAND TOTAL  : ${formatCurrency(results.grandTotal)}
Split Among  : ${results.numPeople} People
(${namesList})
==================================
EACH PERSON OWES : ${formatCurrency(results.perPerson)}
==================================
Generated via mydocready.com
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventName.replace(/\s+/g, '_')}_Split.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Calculator Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-cyan-600 px-6 py-8 sm:px-10 text-center text-white">
            <h1 className="text-3xl font-extrabold sm:text-4xl flex items-center justify-center gap-3">
              <Users size={36} /> Personalized Bill Splitter
            </h1>
            <p className="mt-2 text-cyan-100 text-lg">Add your friends by name and send them their exact share instantly.</p>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Input Section */}
            <div className="space-y-6">
              
              {/* Event Name Input */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">What was the occasion?</label>
                <input 
                  type="text"
                  placeholder="e.g. Friday Dinner, Goa Trip..."
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
                />
              </div>

              {/* Amount Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">Total Base Bill</label>
                  <div className="relative flex items-center bg-cyan-50 rounded-md focus-within:ring-2 focus-within:ring-cyan-500 transition-all overflow-hidden border border-cyan-100">
                    <span className="pl-3 text-cyan-600 font-bold">₹</span>
                    <input 
                      type="text"
                      value={amount ? Number(amount).toLocaleString('en-IN') : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setAmount(val ? Number(val) : '');
                      }}
                      className="w-32 sm:w-44 bg-transparent text-lg font-bold text-cyan-600 text-right py-2 pr-3 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tax & Tip Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Tax / GST (%)</label>
                  <div className="relative flex items-center bg-cyan-50 rounded-md focus-within:ring-2 focus-within:ring-cyan-500 transition-all overflow-hidden border border-cyan-100">
                    <input 
                      type="text"
                      value={tax}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        setTax(val);
                      }}
                      className="w-full bg-transparent text-lg font-bold text-cyan-600 text-center py-2 outline-none"
                    />
                    <span className="pr-3 text-cyan-600 font-bold">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Tip / Gratuity (%)</label>
                  <div className="relative flex items-center bg-cyan-50 rounded-md focus-within:ring-2 focus-within:ring-cyan-500 transition-all overflow-hidden border border-cyan-100">
                    <input 
                      type="text"
                      value={tip}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        setTip(val);
                      }}
                      className="w-full bg-transparent text-lg font-bold text-cyan-600 text-center py-2 outline-none"
                    />
                    <span className="pr-3 text-cyan-600 font-bold">%</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Friends List */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Users size={18} className="text-cyan-600" /> Who is splitting the bill?
                  </label>
                  <span className="text-xs font-bold bg-cyan-100 text-cyan-700 px-2 py-1 rounded-md">
                    Total: {friends.length}
                  </span>
                </div>
                
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  {friends.map((friend, index) => (
                    <div key={friend.id} className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-400 text-xs font-bold">{index + 1}.</span>
                        </div>
                        <input 
                          type="text"
                          value={friend.name}
                          onChange={(e) => updateFriendName(friend.id, e.target.value)}
                          placeholder="Friend's Name"
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                        />
                      </div>
                      <button 
                        onClick={() => removeFriend(friend.id)}
                        disabled={friends.length === 1}
                        className={`p-2 rounded-lg transition-colors ${friends.length === 1 ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'text-red-500 bg-red-50 hover:bg-red-100'}`}
                        title="Remove friend"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={addFriend}
                  className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 py-3 rounded-lg border border-dashed border-cyan-300 transition-colors"
                >
                  <Plus size={16} /> Add Another Person
                </button>
              </div>

            </div>

            {/* Results & Receipt Section */}
            <div className="flex flex-col bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 relative h-full">
              
              {/* Digital Receipt Design */}
              <div className="w-full bg-white border-2 border-dashed border-cyan-200 rounded-xl p-5 mb-6 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-50 px-2 text-cyan-500">
                  <Receipt size={24} />
                </div>
                
                <h3 className="text-center font-black text-gray-800 tracking-wider uppercase mt-2 mb-4">{eventName || 'Group Expense'}</h3>
                
                <div className="space-y-2 text-sm font-medium text-gray-600 border-b border-dashed border-gray-200 pb-4 mb-4">
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span>{formatCurrency(results.baseAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes ({tax}%):</span>
                    <span>{formatCurrency(results.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tip ({tip}%):</span>
                    <span>{formatCurrency(results.tipAmount)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800 text-lg">Grand Total:</span>
                  <span className="font-black text-gray-900 text-xl">{formatCurrency(results.grandTotal)}</span>
                </div>
              </div>

              {/* Per Person Highlight */}
              <div className="text-center w-full mb-6">
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Each Person Owes</p>
                <div className="bg-gradient-to-r from-cyan-500 to-sky-500 py-4 rounded-xl mt-2 shadow-md">
                  <p className="text-4xl font-extrabold text-white">{formatCurrency(results.perPerson)}</p>
                </div>
              </div>

              {/* Send to Friends Action List */}
              <div className="w-full bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Request Money via WhatsApp</h4>
                <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                  {friends.map((friend, idx) => (
                    // Don't show WhatsApp button for the first person assuming it's "Me"
                    idx === 0 && friend.name.toLowerCase().includes('me') ? null : (
                      <div key={friend.id} className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                        <span className="text-sm font-bold text-gray-700 truncate max-w-[120px]">{friend.name}</span>
                        <button 
                          onClick={() => shareToWhatsApp(friend.name)}
                          className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1DA851] text-white text-xs font-bold py-1.5 px-3 rounded-md transition-colors"
                        >
                          <MessageCircle size={14} /> Send Link
                        </button>
                      </div>
                    )
                  ))}
                  {/* Fallback if all are "Me" or empty */}
                  {friends.length <= 1 && (
                    <p className="text-xs text-center text-gray-400 py-2">Add friends on the left to send them messages.</p>
                  )}
                </div>
              </div>

              {/* Download Button */}
              <button 
                onClick={handleDownloadReceipt}
                className="w-full mt-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-95"
              >
                <Download size={18} />
                Download Group Summary
              </button>

            </div>

          </div>
        </div>

        {/* SEO Article Section for AdSense Approval */}
        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 prose prose-cyan max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Split Group Bills Without the Awkwardness</h2>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            We've all been there: the check arrives after a fantastic group dinner, a weekend trip to Goa, or a shared cab ride, and suddenly, everyone is pulling out their phone calculators. Factoring in the base cost, government taxes (GST), and a service tip can turn a fun outing into a stressful math exam. The <strong>mydocready.com Personalized Expense Splitter</strong> is designed to solve this exact problem instantly by calculating the math and doing the asking for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-cyan-500 w-5 h-5" /> Say Goodbye to Awkward Texts
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Asking friends to pay you back is always a little uncomfortable. Our unique <strong>WhatsApp Integration</strong> removes the friction entirely. By entering your friends' names into the calculator, the tool generates a pre-written, polite, and completely accurate WhatsApp message for each specific person. With one click, they receive a breakdown of the bill and exactly how much they owe you.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-cyan-500 w-5 h-5" /> Handling Hidden Taxes and Tips
              </h3>
              <p className="text-gray-600 leading-relaxed">
                In places like India, restaurant bills often come with a 5% GST on food, and occasionally a voluntary service charge (tip). If you just split the base price shown on the menu, the person paying the bill ends up covering the taxes and tips out of their own pocket! Our calculator ensures you add these percentages on top of the base bill before dividing it.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">The Mathematical Formula Behind the Split</h3>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 font-mono text-sm text-gray-700">
            <p className="mb-2">1. <strong>Tax Amount</strong> = Base Bill × (Tax % / 100)</p>
            <p className="mb-2">2. <strong>Tip Amount</strong> = Base Bill × (Tip % / 100)</p>
            <p className="mb-2">3. <strong>Grand Total</strong> = Base Bill + Tax Amount + Tip Amount</p>
            <hr className="border-gray-300 my-3" />
            <p className="font-bold text-cyan-700 text-base">Per Person Share = Grand Total ÷ Total Number of Friends</p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Best Practices for Managing Group Finances</h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li><strong>Settle Immediately:</strong> The longer you wait to ask for a split amount, the more awkward it becomes. Generate the summary and send the WhatsApp messages before everyone heads home from the restaurant.</li>
            <li><strong>Designate a "Banker":</strong> Have one person pay the final restaurant or hotel bill using a credit card (great for maximizing reward points!), and let the group immediately UPI/transfer them their exact calculated share.</li>
            <li><strong>Transparency is Key:</strong> In addition to sending individual texts, use our "Download Group Summary" feature to drop a text receipt of the entire bill into your main group chat so everyone has a record of the transaction.</li>
          </ul>
        </article>

      </div>
    </div>
  );
}