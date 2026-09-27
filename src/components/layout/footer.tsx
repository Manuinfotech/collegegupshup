import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';

const footerData = [
  {
    title: 'MBA',
    links: [
      'MBA', 'Top MBA Colleges', 'MBA Colleges', 'Executive MBA Colleges', 
      'MBA Exams', 'CAT', 'MAT', 'Online MBA', 'MBA College Predictors'
    ]
  },
  {
    title: 'Engineering',
    links: [
      'Engineering', 'Top Engineering Colleges', 'Engineering Colleges', 
      'Engineering Exams', 'JEE Main', 'JEE Advanced', 'Engineering College Predictors'
    ]
  },
  {
    title: 'Medicine',
    links: [
      'NEET UG', 'NEET PG', 'NEET SS', 'NEET MDS', 'INI CET', 'FMGE', 
      'AIAPGET', 'Top Medical Colleges', 'Medical Colleges', 'Medical Exams'
    ]
  },
  {
    title: 'Other Courses',
    links: [
      'Animation', 'B.Com', 'B.Sc', 'BBA', 'CA', 'Fashion Designing', 
      'Hotel Management', 'Law', 'Mass Communication & Media', 'MBBS'
    ]
  },
  {
    title: 'Sarkari Exams',
    links: [
      'RRB Group D', 'RRB NTPC', 'CTET', 'UPTET', 'UGC NET', 'DSSSB', 
      'SSC CGL', 'SSC CHSL', 'SSC GD', 'NDA'
    ]
  }
];

const footerDataRow2 = [
  {
    title: 'Resources',
    links: [
      'Careers after 12th', 'Courses After 12th', 'Ask a Question', 'Write a college review', 
      'Articles', 'Law College Predictors', 'Hospitality College Predictor', 
      'NCERT Solutions', 'NCERT Solutions Class 12 Maths', 'NCERT Solutions Class 12 Physics'
    ]
  },
  {
    title: 'Important Updates',
    links: [
      'Re NEET 2026 Result Date', 'XAT 2027', 'MH CET LAW 2026', 'CAT 2025 Question Paper', 
      'NEET College Predictor', 'NEET Rank Predictor', 'CAT 2026', 'BITSAT 2026', 
      'MHT CET 2026', 'NIFT 2026'
    ]
  },
  {
    title: 'Study Abroad',
    links: [
      'Study Abroad Home', 'BTech abroad', 'MBA abroad', 'MS abroad', 
      'GRE', 'GMAT', 'SAT', 'IELTS', 'TOEFL'
    ]
  }
];

function getFooterLinkHref(link: string): string {
  const l = link.toLowerCase();
  if (l === 'online mba') return '/colleges?goal=online-mba';
  if (l === 'mba' || l === 'top mba colleges' || l === 'mba colleges') return '/colleges?goal=mba';
  if (l === 'engineering' || l === 'top engineering colleges' || l === 'engineering colleges') return '/colleges?goal=engineering';
  if (l === 'medical colleges' || l === 'top medical colleges') return '/colleges?goal=medical';
  if (l === 'bba') return '/colleges?goal=bba';
  if (l === 'bca') return '/colleges?goal=bca';
  if (l === 'mca') return '/colleges?goal=mca';
  if (l === 'b.com') return '/colleges?goal=commerce';
  if (l === 'law') return '/colleges?goal=law';
  return `/colleges?q=${encodeURIComponent(link)}`;
}

export function Footer() {
  return (
    <footer className="bg-[#0A0A0B] text-gray-300 mt-auto border-t border-white/5 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        

        {/* MIDDLE SECTION: Mega Navigation Links */}
        <div className="py-16 space-y-16 lg:px-12 xl:px-24">
          
          {/* Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:justify-between gap-8 lg:gap-4">
            {footerData.map((column) => (
              <div key={column.title} className="col-span-1">
                <h3 className="font-semibold text-white mb-6 text-base tracking-tight">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link
                        href={getFooterLinkHref(link)}
                        className="text-[13px] text-gray-400 hover:text-indigo-400 transition-colors font-medium leading-tight block"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:justify-between gap-8 lg:gap-4 pt-10 border-t border-white/5">
            {footerDataRow2.map((column) => (
              <div key={column.title} className="col-span-1">
                <h3 className="font-semibold text-white mb-6 text-base tracking-tight">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link
                        href={getFooterLinkHref(link)}
                        className="text-[13px] text-gray-400 hover:text-indigo-400 transition-colors font-medium leading-tight block"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            {/* Get App Section */}
            <div className="col-span-2 md:col-span-3 lg:w-auto">
              <h3 className="font-semibold text-white mb-6 text-base tracking-tight">Get App, It's faster and better</h3>
              <div className="flex flex-col gap-4 max-w-[200px]">
                <a href="#" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2.5 px-4 transition-all group">
                  <svg className="w-6 h-6 text-[#34A853]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 0 1-.36-.457C3.088 21.372 3 20.89 3 20.25V3.75c0-.64.088-1.122.25-1.479.117-.26.242-.395.359-.457z" fill="#4285F4"/>
                    <path d="M17.41 15.617l-3.618-3.617 3.618-3.617L20.8 10.3c.75.433 1.2 1.096 1.2 1.7 0 .604-.45 1.267-1.2 1.7l-3.39 1.917z" fill="#FBBC04"/>
                    <path d="M13.792 12l-10.183 10.186c.304.148.665.234 1.141.234.62 0 1.341-.219 2.18-.703l10.48-5.934L13.792 12z" fill="#EA4335"/>
                    <path d="M3.61 1.814c.303-.148.664-.234 1.14-.234.62 0 1.341.219 2.181.703l10.48 5.934L13.792 12 3.61 1.814z" fill="#34A853"/>
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-medium leading-none mb-1">GET IT ON</span>
                    <span className="text-sm text-white font-semibold leading-none">Google Play</span>
                  </div>
                </a>
                
                <a href="#" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2.5 px-4 transition-all group">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.09 2.31-.86 3.63-.72 1.53.1 2.89.8 3.66 2.05-3.2 1.75-2.65 5.98.53 7.23-.74 1.76-1.57 3.53-2.9 4.61zm-4.32-13.6c-.23-2.64 2.22-5.01 4.79-4.68.26 2.72-2.65 5.09-4.79 4.68z"/>
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-medium leading-none mb-1">Download on the</span>
                    <span className="text-sm text-white font-semibold leading-none">App Store</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Legal & Social */}
        <div className="border-t border-white/10 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#D4FF00] hover:text-black hover:border-[#D4FF00] transition-all shadow-sm">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#D4FF00] hover:text-black hover:border-[#D4FF00] transition-all shadow-sm">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3 8h-1.35c-.538 0-.65.221-.65.778V10h2l-.209 2H13v7h-3v-7H8v-2h2V7.692C10 5.923 10.931 5 13.029 5H15v3z"/></svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#D4FF00] hover:text-black hover:border-[#D4FF00] transition-all shadow-sm">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#D4FF00] hover:text-black hover:border-[#D4FF00] transition-all shadow-sm">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-gray-500 font-medium">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <span className="hidden sm:inline text-gray-700">•</span>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <span className="hidden sm:inline text-gray-700">•</span>
            <p>&copy; {new Date().getFullYear()} College Gupshup. All rights reserved.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
