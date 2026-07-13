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
  Scale,
  Calendar
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
      description: 'Compare Old vs New Tax Regimes (FY 26-27) for planning and comparison.',
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
      description: 'Estimate monthly savings needed to reach your goals.',
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
    {
      id: 'age',
      title: 'Age Calculator',
      description: 'Calculate age, years remaining, and more with a simple, easy-to-use tool.',
      href: '/calculators/age',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'hover:border-green-300'
    }
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
            Find financial and math calculators for investments, taxes, loans, and everyday budgeting. Our browser-based tools are designed to help you estimate outcomes and compare options with clear inputs and straightforward results.
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
              Practical calculators for planning, comparison, and everyday math
            </h2>
            <p className="mb-8 text-center text-lg">
              This collection of tools is intended to help you explore financial scenarios, compare options, and perform everyday mathematics with a clear, browser-friendly interface. Each calculator focuses on a specific problem so you can keep the inputs and outputs simple and easy to understand.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">How these calculators support better decision-making</h3>
            <p>
              The main value of a calculator is that it makes relationships between values visible. When you change the interest rate, tenure, or monthly contribution, the results update immediately. This helps you see which variables have the most influence on the outcome and can guide your next step.
            </p>
            <p>
              For example, the EMI Calculator shows how the monthly payment varies with the loan term. The Goal Planner shows how much needs to be saved each month to reach a target amount. When numbers are clear, it becomes easier to compare alternatives and choose the one that matches your priorities.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Selecting the right tool</h3>
            <p>
              Each tool is designed for a different type of question. The most useful calculator is the one that fits the question you are asking right now. If you need to estimate a loan installment, start with the EMI Calculator. If you are preparing an invoice, the GST Calculator is a better fit.
            </p>
            <p>
              Using the right tool helps avoid confusing inputs and helps you interpret the result more confidently. It also reduces the chance of using the wrong formula for your situation.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Entering values with confidence</h3>
            <p>
              Calculator results are only as useful as the numbers entered into them. For the best estimate, use actual values from the documents or offers you are comparing. When exact values are not available, make the best possible estimate and note that the result is for planning purposes.
            </p>
            <p>
              Important input considerations include the interest rate format, the frequency of contributions or payments, and whether a value is expressed monthly or annually. Keeping units consistent helps produce results that are easier to compare.
            </p>
            <ul>
              <li>Confirm whether the interest rate is annual or monthly.</li>
              <li>Use the same unit for time periods across inputs.</li>
              <li>Enter payment frequency consistently, such as monthly payments or yearly contributions.</li>
              <li>Include known fees when they are part of the calculation concept, such as invoice GST or loan processing charges.</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Understanding EMI and repayment schedules</h3>
            <p>
              EMI stands for Equated Monthly Installment. It is the fixed amount you pay each month for a loan, and it usually combines both the principal repayment and the interest charge. The EMI amount depends on three main inputs: the loan amount, the interest rate, and the loan term.
            </p>
            <p>
             When you use the EMI Calculator, the result helps you compare whether a shorter loan term with a higher payment or a longer term with a lower payment is more compatible with your budget. It can also make it easier to discuss options with a lender or financial planner.
            </p>
            <p>
             Keep in mind that the calculator is a planning aid. Actual bank offers may include additional fees, varying interest calculation methods, or reserve requirements that are not captured here.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">How savings calculators work</h3>
            <p>
             Savings and investment calculators such as the SIP Calculator and FD Calculator apply compound interest formulas to estimate how an amount may grow over time. These tools are helpful for comparing a regular investment schedule versus a one-time deposit.
            </p>
            <p>
             For a SIP, the calculator shows how periodic contributions can accumulate based on a chosen return rate. For an FD, it shows how a lump sum deposit may grow by the end of the tenure. These estimates help you understand the impact of changing the amount, term, or rate.
            </p>
            <p>
             If you are uncertain about the expected return rate, test multiple scenarios. That way, you can see a possible range of outcomes and decide which assumptions are most reasonable for your plan.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Comparing tax options and GST calculations</h3>
            <p>
             The Income Tax Calculator is useful for comparing different tax regimes and understanding how basic salary, deductions, and exemptions affect your net tax position. It helps you see how the same income can result in different tax obligations under different rule sets.
            </p>
            <p>
             The GST Calculator is helpful for calculating the amount of tax on goods or services, as well as for splitting a total amount into its base price and tax component. This can be useful when preparing invoices, estimating the cost of a purchase, or confirming the tax amount on a receipt.
            </p>
            <p>
             Because tax rules and rates can change, use the calculator as a starting point and verify the latest rates from official sources when accuracy is critical.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Everyday tools for shared costs and goal-setting</h3>
            <p>
             The Bill Splitter tool is designed for shared expenses, such as dining out with friends, travel costs, or group gifts. It helps you divide an amount fairly and optionally include a tip before splitting the total among participants.
            </p>
            <p>
             The Goal Planner helps you estimate how much to save each month to reach a specific target within a set timeframe. This can be useful for short-term goals such as a vacation fund or a larger purchase, as well as longer-term objectives.
            </p>
            <p>
             These practical calculators are helpful when you want clear numbers for planning and when you need to share the information with others, such as family members or teammates.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">How to interpret calculator outputs</h3>
            <p>
             Calculator outputs are estimates based on the values entered. They are not a guarantee of future results. Treat the result as a guide for comparison rather than a fixed promise.
            </p>
            <p>
             If the result differs from what you expected, review the inputs first. Often a small misunderstanding in the loan term, rate type, or contribution frequency is the cause. Adjust one value at a time to see how the result changes.
            </p>
            <p>
             Interpreting the output in context helps you apply it more effectively. For example, a higher monthly payment may still be acceptable if it yields a substantially shorter loan term and lower total interest. The calculator makes these trade-offs easier to see.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">How to avoid common input mistakes</h3>
            <p>
             Common calculator mistakes include mixing annual and monthly units, using a rate type incorrectly, and omitting important variables such as fees. Double-check these details before accepting the result.
            </p>
            <ul>
              <li>Convert yearly rates to monthly rates if the calculator expects monthly values.</li>
              <li>Use the same time unit for all fields, such as months or years.</li>
              <li>Review whether the calculator requires the rate in percentage format or decimal form.</li>
              <li>Include taxes or fees separately if they are part of the scenario being modeled.</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why browser-based calculators are useful</h3>
            <p>
             Browser-based calculators are convenient because they do not require installation and can be accessed from any modern device with a web browser. This makes it easier to use the tools at home, at work, or on the go.
            </p>
            <p>
             They are also a good option when you want a quick calculation without opening a spreadsheet or a dedicated app. The focus is on simple input fields and immediate results.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">How to use calculator results alongside other planning tools</h3>
            <p>
             Calculator results can be combined with notes, budget plans, and spreadsheets for deeper planning. After calculating a monthly payment or savings goal, you can record the numbers in a spreadsheet to compare several scenarios side by side.
            </p>
            <p>
             This practice can help you track progress over time and make adjustments as your situation changes. It also provides a useful record of the assumptions behind each plan.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Using multiple calculators together</h3>
            <p>
             Using multiple calculators in sequence can provide a broader picture. For example, calculate the EMI for a loan, then use the Goal Planner to estimate how much you would need to save each month to meet the same payment amount from your savings.
            </p>
            <p>
             This helps you compare borrowing with saving and understand the trade-offs between different approaches. It also highlights the relationship between cash flow, loan commitments, and long-term objectives.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Common scenarios where these tools help</h3>
            <p>
             These calculators are useful in a range of everyday situations:
            </p>
            <ul>
              <li>Estimating the monthly payment for a new car loan.</li>
              <li>Comparing fixed deposit tenures for a short-term savings goal.</li>
              <li>Calculating GST for a business invoice or a purchase receipt.</li>
              <li>Dividing a dinner bill fairly among friends and including tips.</li>
              <li>Planning a monthly savings target for a future expense.</li>
            </ul>
            <p>
             Having the numbers available can make these decisions faster and easier to discuss with others.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">How to keep calculator use safe and private</h3>
            <p>
             These tools are intended for numeric planning and estimation. Avoid entering personal details such as passwords, account numbers, or identification information. Keep the focus on financial values, rates, terms, and quantities.
            </p>
            <p>
             If you want to preserve a result, copy it into a separate document or note rather than leaving it on the calculator screen.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">How often to revisit your calculations</h3>
            <p>
             Financial conditions change over time. Whenever your income, expenses, interest rates, or savings goals change, revisit the calculator inputs. Regular updates help keep your planning aligned with your current reality.
            </p>
            <p>
             A periodic review can also help you identify when a previously chosen plan is no longer the best fit.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Interpreting sensitivity in the results</h3>
            <p>
             Some calculations are more sensitive to small changes than others. Loan payments and savings projections can both change noticeably when interest rates or time horizons shift. Running a few scenarios can show how robust a plan is and what assumptions matter most.
            </p>
            <p>
             If a small input change causes a large result difference, that can help you prioritize which parameter to review more carefully.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">How to use calculator results when talking with others</h3>
            <p>
             Calculator output can be a useful reference point in discussions with lenders, advisors, or family members. It helps everyone focus on the same numbers and compare options more clearly.
            </p>
            <p>
             Presenting the estimated monthly payment, savings requirement, or tax comparison can make the conversation more productive and less abstract.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">What to do if your result seems unexpected</h3>
            <p>
             If a calculator result seems surprisingly high or low, verify the inputs first. A small typo in the interest rate, duration, or amount is often the cause. Change one value at a time to see how the output responds.
            </p>
            <p>
             If the numbers still look unexpected after checking the inputs, use the result as a signal to review the underlying scenario with more detail.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Reasonable expectations for calculator results</h3>
            <p>
             Calculator estimates are most valuable when they are used as a planning tool rather than a final answer. They help you compare alternatives and test assumptions, but they should be combined with your own judgment and, when needed, expert guidance.
            </p>
            <p>
             This perspective keeps the tools useful without assigning them more certainty than they are meant to provide.
            </p>

            <hr className="my-12 border-gray-200" />

            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions (FAQs)</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Are these calculators free to use?</h4>
                <p className="text-gray-600">The calculators on mydocready.com are available as free planning tools. Core functionality does not require a paid subscription.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Is my financial data secure?</h4>
                <p className="text-gray-600">These tools run in your browser using client-side code, and the site does not store or track values entered during normal use.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-gray-900 mb-2">How accurate are the results?</h4>
                <p className="text-gray-600">Results are generated using standard formulas for EMI, savings, GST, and percentages. They are intended for informational estimates and do not replace professional or official calculations.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Can I use these tools on my mobile phone?</h4>
                <p className="text-gray-600">Yes. The calculators are designed to work on modern mobile browsers, tablets, and desktop computers.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Should I use a calculator for tax planning?</h4>
                <p className="text-gray-600">Calculator results can help you compare tax scenarios and estimate outcomes. For official guidance or complex cases, consult a qualified tax professional or official tax authority.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-gray-900 mb-2">What should I do with the results?</h4>
                <p className="text-gray-600">Use the results as a reference point for budgeting, comparison, and planning. Consider copying important results into a note or spreadsheet for future review.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}