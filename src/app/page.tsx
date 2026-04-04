'use client';

import Link from 'next/link';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight, DollarSign, Clock, Calculator, Building2, ShieldAlert, Shield } from 'lucide-react';

const APPS = [
  {
    number: 1,
    name: 'Priced Out',
    href: '/priced-out',
    question: 'What does this drug really cost vs. what they charge?',
    description: 'Manufacturer profiler, drug pricing explorer, cost-to-make vs. list price, profit waterfall, price history timeline.',
    icon: <DollarSign className="w-6 h-6" />,
    color: 'bg-[#C41E3A]',
  },
  {
    number: 2,
    name: 'Pipeline Watch',
    href: '/pipeline-watch',
    question: 'When will there be a cheaper version of my drug?',
    description: 'Patent cliff timeline, biosimilar entry tracker, delay tactic encyclopedia, clinical trials pipeline.',
    icon: <Clock className="w-6 h-6" />,
    color: 'bg-[#0B6B3A]',
  },
  {
    number: 3,
    name: 'What It Costs Me',
    href: '/what-it-costs-me',
    question: 'What will I personally pay for my medication?',
    description: 'Out-of-pocket calculator, insurance type selector, international price comparison, coupon trap explainer.',
    icon: <Calculator className="w-6 h-6" />,
    color: 'bg-[#B45309]',
  },
  {
    number: 4,
    name: 'Follow the Money',
    href: '/follow-the-money',
    question: 'Where does every dollar of my premium actually go?',
    description: 'Insurer & PBM profit tracker, rebate flow diagram, spread pricing explainer, vertical integration map.',
    icon: <Building2 className="w-6 h-6" />,
    color: 'bg-[#0B6B3A]',
  },
  {
    number: 5,
    name: 'The Generic Gap',
    href: '/the-generic-gap',
    question: "Why isn't there a cheaper version yet?",
    description: 'Patent thicket tracker, pay-for-delay registry, delay cost calculator, years-stolen visualizer.',
    icon: <ShieldAlert className="w-6 h-6" />,
    color: 'bg-[#7C3AED]',
  },
  {
    number: 6,
    name: 'The IRA Effect',
    href: '/the-ira-effect',
    question: 'What did Medicare actually negotiate?',
    description: 'IRA negotiated prices vs. manufacturer list prices. See the discount, the savings, and what patients were paying before.',
    icon: <Shield className="w-6 h-6" />,
    color: 'bg-[#1E3A5F]',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      <TopNav />

      {/* Hero */}
      <section id="main-content" className="bg-[#0B6B3A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight leading-tight">
            Drug Economics
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-[#E6F2EC] font-body max-w-2xl leading-relaxed">
            Five investigative apps that expose how pharmaceutical manufacturers,
            insurance companies, and pharmacy benefit managers profit from the
            American drug pricing system — at the direct expense of patients.
          </p>
          <p className="mt-6 text-sm text-[#6B7771] font-body">
            For patients, families, caregivers, journalists, and policymakers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/priced-out"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B6B3A] text-white rounded-lg text-sm font-semibold hover:bg-[#236B44] transition-colors border border-[#E6F2EC]/20 font-body"
            >
              Start Exploring
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* App Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-[#1F2A24] font-display mb-8">The Suite</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {APPS.map(app => (
            <Link
              key={app.number}
              href={app.href}
              className="group bg-white rounded-xl border border-[#E5ECE8] p-6 shadow-sm hover:shadow-md hover:border-[#0B6B3A]/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className={`${app.color} text-white w-10 h-10 rounded-lg flex items-center justify-center`}>
                  {app.icon}
                </div>
                <span className="text-xs font-mono text-[#6B7771]">App {app.number}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#1F2A24] font-display group-hover:text-[#07542D] transition-colors">
                {app.name}
              </h3>
              <p className="mt-1 text-sm font-accent text-[#C41E3A]">{app.question}</p>
              <p className="mt-3 text-sm text-[#6B7771] font-body leading-relaxed">{app.description}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#0B6B3A] group-hover:gap-2 transition-all font-body">
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-white border-t border-[#E5ECE8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-lg font-accent text-[#0B6B3A] leading-relaxed">
            The data tells a story. The story is: the American drug pricing system
            is structured to extract maximum profit at every layer, and patients
            pay the cost.
          </p>
          <p className="mt-4 text-sm text-[#6B7771] font-body">
            Every figure is sourced. Every estimate is labeled. Every number is verifiable.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
