import Link from 'next/link';
import { 
  Landmark, 
  PiggyBank, 
  TrendingUp, 
  Receipt, 
  Target, 
  Percent,
  CheckCircle2,
  Users,
  Scale
} from 'lucide-react';

export default function CalculatorsLandingPage() {
  const calculators = [
    {
      id: 'emi',
      title: 'EMI Calculator',
      description: 'Calculate Equated Monthly Installments for home, car, or personal loans.',
      href: '/calculators/emi',
      icon: Landmark,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'hover:border-blue-300'
    },
    {
      id: 'fd',
      title: 'FD Calculator',
      description: 'Estimate your returns and maturity amount on Fixed Deposits safely.',
      href: '/calculators/fd',
      icon: PiggyBank,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      borderColor: 'hover:border-emerald-300'
    },
    {
      id: 'sip',
      title: 'SIP Calculator',
      description: 'Plan your mutual fund investments and calculate wealth accumulation.',
      href: '/calculators/sip',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      borderColor: 'hover:border-indigo-300'
    },
    {
      id: 'gst',
      title: 'GST Calculator',
      description: 'Easily add or remove Goods and Services Tax for your invoices.',
      href: '/calculators/gst',
      icon: Receipt,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      borderColor: 'hover:border-orange-300'
    },
    {
      id: 'tax',
      title: 'Income Tax Calculator',
      description: 'Compare Old vs New Tax Regimes (FY 26-27) and maximize take-home salary.',
      href: '/calculators/tax',
      icon: Scale,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      borderColor: 'hover:border-teal-300'
    },
    {
      id: 'split',
      title: 'Bill Splitter',
      description: 'Divide expenses among friends, calculate tips, and download summaries.',
      href: '/calculators/split',
      icon: Users,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      borderColor: 'hover:border-cyan-300'
    },
    {
      id: 'goal',
      title: 'Goal Planner',
      description: 'Find out exactly how much you need to save monthly to reach your dreams.',
      href: '/calculators/goal',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'hover:border-purple-300'
    },
    {
      id: 'percentage',
      title: 'Percentage Calculator',
      description: 'Quickly solve percentage changes, retail discounts, and fractions.',
      href: '/calculators/percentage',
      icon: Percent,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      borderColor: 'hover:border-pink-300'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 to-blue-700 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl tracking-tight mb-6">
            Smart Financial & Math Calculators
          </h1>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Take control of your finances with <strong>mydocready.com</strong>. Use our suite of free, highly accurate tools to plan your investments, calculate taxes, and manage your loans with confidence.
          </p>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 pb-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Link 
                key={calc.id} 
                href={calc.href}
                className={`group bg-white rounded-2xl shadow-md border-2 border-transparent p-6 hover:shadow-xl ${calc.borderColor} transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-4 rounded-xl ${calc.bgColor} ${calc.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {calc.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed min-h-[3rem] text-sm sm:text-base">
                  {calc.description}
                </p>
                <div className={`mt-6 flex items-center font-bold text-sm ${calc.color}`}>
                  Open Tool 
                  <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SEO / AdSense Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 lg:p-16">
          <div className="max-w-4xl mx-auto prose prose-lg text-gray-600">
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Empower Your Financial Journey
            </h2>
            <p className="mb-8 text-center text-lg">
              Whether you are an individual planning for retirement, a student figuring out percentage discounts, or a business owner calculating GST for invoices, accuracy is everything. At <strong>mydocready.com</strong>, we provide a complete suite of financial and mathematical calculators designed to simplify complex formulas into actionable insights.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 mb-12">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-2" /> Investment Planning
                </h3>
                <p>
                  Growing your wealth requires strategic planning. Our <strong>SIP Calculator</strong> and <strong>FD Calculator</strong> utilize compound interest formulas to show you exactly how your money will grow over time. By visualizing your returns, you can make informed decisions about where to park your hard-earned money.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-500 mr-2" /> Loan & Debt Management
                </h3>
                <p>
                  Before committing to a home or car loan, it's crucial to understand your monthly obligations. The <strong>EMI Calculator</strong> breaks down your principal and interest over your loan tenure, ensuring you never borrow more than you can comfortably repay.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-teal-500 mr-2" /> Tax Planning & Utility
                </h3>
                <p>
                  Taxes do not have to be confusing. Use our <strong>Income Tax Calculator</strong> to compare the Old vs. New tax regimes for FY 26-27, or generate quick, compliant invoices down to the exact paisa with our dynamic <strong>GST Calculator</strong>.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-cyan-500 mr-2" /> Daily Life & Goals
                </h3>
                <p>
                  Avoid the awkwardness of group outings by utilizing the <strong>Bill Splitter</strong> to divide expenses, add tips, and share text summaries. Or, if you have a dream retirement figure in mind, let our <strong>Goal Planner</strong> reverse-engineer the math to find your required monthly savings.
                </p>
              </div>
            </div>

            <hr className="my-12 border-gray-200" />

            {/* FAQ Section - Excellent for SEO & AdSense */}
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions (FAQs)</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Are these calculators free to use?</h4>
                <p className="text-gray-600">Yes! All the financial and mathematical tools provided by mydocready.com are 100% free to use with no usage limits or hidden fees.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Is my financial data secure?</h4>
                <p className="text-gray-600">Absolutely. Our calculators run directly in your web browser using client-side JavaScript. We do not store, track, or save any of the numbers or personal financial data you enter on our servers.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-gray-900 mb-2">How accurate are the results?</h4>
                <p className="text-gray-600">The calculators use standard financial formulas utilized by global banks and institutions (such as compound interest and amortization formulas). However, they are for informational purposes, and actual bank figures may vary slightly due to minor rounding differences or processing fees.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Can I use these tools on my mobile phone?</h4>
                <p className="text-gray-600">Yes, the entire suite of mydocready.com calculators is fully responsive and optimized for seamless use on smartphones, tablets, and desktop computers.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}