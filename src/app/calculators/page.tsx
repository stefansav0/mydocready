import Link from "next/link";
import Image from "next/image";
import {
  Landmark,
  PiggyBank,
  TrendingUp,
  Receipt,
  Target,
  Percent,
  Users,
  Scale,
  Calendar,
} from "lucide-react";

const calculators = [
  {
    id: "emi",
    title: "EMI Calculator",
    description:
      "Calculate monthly EMIs for home, car, and personal loans and compare repayment scenarios.",
    href: "/calculators/emi",
    icon: Landmark,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    id: "fd",
    title: "FD Calculator",
    description:
      "Estimate fixed deposit maturity amounts and returns based on your deposit, rate, and tenure.",
    href: "/calculators/fd",
    icon: PiggyBank,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    id: "sip",
    title: "SIP Calculator",
    description:
      "Estimate how your regular mutual fund investments may grow over time with different return assumptions.",
    href: "/calculators/sip",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    id: "gst",
    title: "GST Calculator",
    description:
      "Calculate GST amounts, add GST to a price, or separate GST from an inclusive amount.",
    href: "/calculators/gst",
    icon: Receipt,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: "tax",
    title: "Tax Calculator",
    description:
      "Compare estimated tax outcomes under different income tax scenarios for easier financial planning.",
    href: "/calculators/tax",
    icon: Scale,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    id: "split",
    title: "Bill Splitter",
    description:
      "Split shared expenses between people and optionally include a tip for quick group calculations.",
    href: "/calculators/split",
    icon: Users,
    color: "text-orange-400",
    bgColor: "bg-orange-50",
  },
  {
    id: "goal",
    title: "Goal Planner",
    description:
      "Estimate how much you may need to save regularly to reach a specific financial target.",
    href: "/calculators/goal",
    icon: Target,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
  {
    id: "percentage",
    title: "Percentage Calculator",
    description:
      "Calculate percentages, percentage changes, discounts, increases, and other everyday percentage problems.",
    href: "/calculators/percentage",
    icon: Percent,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
  },
  {
    id: "age",
    title: "Age Calculator",
    description:
      "Calculate your exact age in years, months, and days using your date of birth.",
    href: "/calculators/age",
    icon: Calendar,
    color: "text-teal-500",
    bgColor: "bg-teal-50",
  },
];

export default function CalculatorsLandingPage() {
  return (
    <div className="min-h-screen bg-[#f4f6fa] font-sans">
      {/* Hero Section */}
      <section className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 pb-16 pt-16 sm:px-6 lg:flex-row lg:px-8 lg:pt-24">
        {/* Hero Content */}
        <div className="w-full text-left lg:w-3/5">
          <div className="mb-5 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            Simple &amp; practical online calculators
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
            Simplify Your Finances.
            <br className="hidden md:block" />

            <span className="mt-2 inline-block border-b-4 border-purple-700 bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text pb-1 text-transparent">
              Calculate, Plan, Compare
            </span>

            <br className="hidden md:block" />
            in Seconds.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-500">
            Quickly calculate EMIs, savings, taxes, GST, percentages, age,
            shared expenses, and financial goals with easy-to-use online
            calculators.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/calculators/emi"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
            >
              Calculate EMI
            </Link>

            <Link
              href="#financial-tools"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Explore Calculators
            </Link>
          </div>
        </div>

        {/* Illustration */}
        <div className="relative mt-12 flex w-full items-center justify-center lg:mt-0 lg:w-2/5 lg:justify-end">
          <div
            aria-hidden="true"
            className="absolute h-56 w-56 rounded-full bg-gradient-to-tr from-indigo-200 to-purple-200 opacity-40 blur-3xl sm:h-72 sm:w-72"
          />

          <Image
            src="/calc.png"
            alt="Online financial calculator illustration"
            width={500}
            height={500}
            priority
            className="relative z-10 w-64 object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105 sm:w-80 lg:w-full"
          />
        </div>
      </section>

      {/* Calculator Grid */}
      <section
        id="financial-tools"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 sm:px-6 lg:px-8"
      >
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            MyDocReady Calculators
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#111827] sm:text-3xl">
            Financial &amp; Everyday Tools
          </h2>

          <p className="mt-2 max-w-2xl text-gray-500">
            Choose a calculator based on what you need to estimate, compare,
            or plan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {calculators.map((calculator) => {
            const Icon = calculator.icon;

            return (
              <Link
                key={calculator.id}
                href={calculator.href}
                className="group flex flex-col rounded-[2rem] border border-transparent bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {/* Icon */}
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${calculator.bgColor} ${calculator.color}`}
                >
                  <Icon
                    className="h-7 w-7 transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-xl font-bold text-[#111827] transition-colors group-hover:text-indigo-700">
                  {calculator.title}
                </h3>

                <p className="flex-1 pr-2 text-sm leading-relaxed text-gray-500">
                  {calculator.description}
                </p>

                <span className="mt-5 text-sm font-semibold text-indigo-600">
                  Open calculator →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SEO / Educational Content */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm sm:p-12 lg:p-16">
          <article className="mx-auto max-w-4xl text-gray-600">
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Calculator Guide
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Practical calculators for planning, comparison, and everyday
                math
              </h2>

              <p className="mt-5 text-lg leading-8">
                MyDocReady provides a collection of simple browser-based
                calculators designed to help you explore financial scenarios,
                compare options, and perform everyday calculations without
                complicated spreadsheets.
              </p>
            </div>

            <div className="space-y-10">
              <section>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  How these calculators can help
                </h3>

                <p className="leading-8">
                  Calculators make it easier to understand how different
                  numbers affect a result. By changing an interest rate, loan
                  amount, investment contribution, tax value, or time period,
                  you can quickly compare different scenarios.
                </p>

                <p className="mt-4 leading-8">
                  This can be useful when planning a loan, comparing savings
                  options, estimating GST, setting a savings goal, or checking
                  an everyday calculation.
                </p>
              </section>

              <section>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Choosing the right calculator
                </h3>

                <p className="leading-8">
                  Each calculator is designed for a particular type of
                  calculation. Use the EMI Calculator when estimating loan
                  payments, the SIP Calculator when exploring regular
                  investment scenarios, and the FD Calculator when estimating
                  fixed-deposit growth.
                </p>

                <p className="mt-4 leading-8">
                  For everyday calculations, the Percentage Calculator, Age
                  Calculator, and Bill Splitter can provide quick results
                  without requiring manual formulas.
                </p>
              </section>

              <section>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Understanding EMI calculations
                </h3>

                <p className="leading-8">
                  EMI stands for Equated Monthly Installment. An EMI generally
                  consists of both principal repayment and interest. The
                  monthly amount depends mainly on the loan amount, interest
                  rate, and repayment tenure.
                </p>

                <p className="mt-4 leading-8">
                  Comparing different loan terms can help you understand the
                  trade-off between monthly affordability and total interest
                  paid. Actual lender calculations may differ because of fees,
                  interest methods, and other loan conditions.
                </p>
              </section>

              <section>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Savings and investment calculators
                </h3>

                <p className="leading-8">
                  SIP and FD calculators can help you explore how money may
                  grow under different assumptions. You can change the
                  contribution amount, deposit amount, expected return or
                  interest rate, and investment period to compare scenarios.
                </p>

                <p className="mt-4 leading-8">
                  Investment calculations are estimates. Actual returns can
                  vary depending on market performance, product terms,
                  interest rates, taxes, fees, and other factors.
                </p>
              </section>

              <section>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  GST and tax calculations
                </h3>

                <p className="leading-8">
                  The GST Calculator can help you calculate GST on a product or
                  service and understand the relationship between the base
                  amount, tax amount, and total amount.
                </p>

                <p className="mt-4 leading-8">
                  Tax calculations can help with basic comparisons and
                  planning, but tax rules and rates can change. For official
                  tax filing or complex situations, verify the applicable
                  rules with official sources or a qualified professional.
                </p>
              </section>

              <section>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Goal planning and budgeting
                </h3>

                <p className="leading-8">
                  The Goal Planner can help estimate the regular savings needed
                  to work toward a target amount. This can be useful for
                  planning travel, purchases, emergency funds, education, or
                  other financial goals.
                </p>

                <p className="mt-4 leading-8">
                  The Bill Splitter is useful for shared expenses such as
                  meals, travel, group purchases, and other situations where a
                  total needs to be divided between multiple people.
                </p>
              </section>

              <section>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Common input mistakes to avoid
                </h3>

                <p className="leading-8">
                  Calculator results depend on the information entered. A
                  small difference in an interest rate, time period, or
                  contribution frequency can significantly change the result.
                </p>

                <ul className="mt-5 list-disc space-y-3 pl-6 leading-8">
                  <li>Check whether the rate is annual or monthly.</li>
                  <li>Use consistent time units such as months or years.</li>
                  <li>Check whether a percentage should be entered as a percentage value.</li>
                  <li>Review the amount and frequency of payments or contributions.</li>
                  <li>Consider applicable fees or taxes separately when required.</li>
                </ul>
              </section>

              <section>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Calculator results are estimates
                </h3>

                <p className="leading-8">
                  Calculator results should be treated as estimates based on
                  the values and assumptions entered. They are useful for
                  comparison and planning, but they are not guarantees of
                  future financial outcomes.
                </p>

                <p className="mt-4 leading-8">
                  Before making an important financial decision, review the
                  actual terms, rates, fees, and applicable rules associated
                  with the product or service.
                </p>
              </section>

              <section>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Using calculators on mobile devices
                </h3>

                <p className="leading-8">
                  MyDocReady calculators are designed to work across modern
                  desktop, tablet, and mobile browsers. This makes it possible
                  to perform quick calculations without installing a separate
                  application.
                </p>
              </section>
            </div>

            {/* FAQ */}
            <div className="mt-16 border-t border-gray-200 pt-12">
              <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>

              <div className="space-y-5">
                <div className="rounded-2xl bg-gray-50 p-6">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    Are these calculators free to use?
                  </h3>

                  <p className="leading-7 text-gray-600">
                    Yes. The calculators are provided as free online tools for
                    calculations, comparison, and planning.
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-6">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    How accurate are the calculator results?
                  </h3>

                  <p className="leading-7 text-gray-600">
                    Results are generated using the formulas and inputs
                    provided by the calculator. They are intended as estimates
                    and should be verified against official figures when
                    accuracy is critical.
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-6">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    Can I use the calculators on my phone?
                  </h3>

                  <p className="leading-7 text-gray-600">
                    Yes. The calculator pages are designed to work on modern
                    mobile browsers, tablets, and desktop computers.
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-6">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    Can I rely on these calculators for financial decisions?
                  </h3>

                  <p className="leading-7 text-gray-600">
                    They are useful for estimates and comparisons, but they
                    should not be treated as professional financial, tax, or
                    investment advice. Always review actual product terms and
                    consult an appropriate professional when necessary.
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-6">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    What should I do if the result looks incorrect?
                  </h3>

                  <p className="leading-7 text-gray-600">
                    First, check the values you entered, including the amount,
                    rate, frequency, and time period. If the inputs are
                    correct, compare the result with the applicable formula or
                    official calculation method.
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-6">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    Which calculator should I use for a loan?
                  </h3>

                  <p className="leading-7 text-gray-600">
                    Use the EMI Calculator to estimate monthly loan payments.
                    You can change the loan amount, interest rate, and tenure
                    to compare different repayment scenarios.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h3 className="mb-2 text-lg font-bold text-amber-900">
                Important Disclaimer
              </h3>

              <p className="text-sm leading-7 text-amber-800">
                MyDocReady calculators are provided for informational,
                educational, and planning purposes only. Results may differ
                from actual figures because of product-specific terms, fees,
                taxes, interest methods, market conditions, or changes in
                applicable rules. Always verify important financial
                information with the relevant institution or official source.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}