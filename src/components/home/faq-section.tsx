import { HelpCircle, Smartphone, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const faqs = [
  {
    question: "How do I apply for colleges through College Gupshup?",
    answer: "Our unified application system allows you to apply to multiple partner colleges with a single form. Simply create your profile, select your target colleges, and submit your application online. Our AI engine will also suggest colleges that best match your profile."
  },
  {
    question: "Are the college rankings authentic and verified?",
    answer: "Yes! Our rankings are aggregated using a proprietary algorithm that combines official NIRF data, verified alumni reviews, placement statistics, and infrastructure audits to give you the most accurate picture of any institution."
  },
  {
    question: "Do you offer education loan assistance?",
    answer: "Absolutely. We have partnered with 15+ top banks and NBFCs to offer zero-processing-fee education loans. Once your admission is confirmed, you can check your loan eligibility and apply directly through your student dashboard."
  },
  {
    question: "How can I connect with current students or alumni?",
    answer: "Every college profile features a 'Community' tab where verified current students and alumni answer questions. You can also join our Discord community to interact directly with peers and seniors from your target colleges."
  },
  {
    question: "Is the counseling service free?",
    answer: "We offer both free AI-driven counseling and premium 1-on-1 expert counseling. The free tier gives you personalized college recommendations based on your scores, while premium gives you a dedicated mentor throughout your admission journey."
  }
];

export function FaqSection() {
  return (
    <section className="py-12 md:py-16 relative overflow-hidden bg-white">
      {/* Decorative Background Elements */}
      <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-rose-50/50 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start max-w-7xl mx-auto">
          
          {/* Left Column - FAQ */}
          <div className="lg:col-span-3">
            <div className="text-left mb-10">
              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 mb-4 px-4 py-1.5 rounded-full shadow-sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                Got Questions?
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-500 text-lg md:text-xl">Everything you need to know about admissions, counseling, and college life.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 p-6 md:p-10">
              <Accordion className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border border-gray-100 rounded-2xl px-6 bg-gray-50/50 data-[state=open]:bg-white data-[state=open]:shadow-md transition-all duration-300"
                  >
                    <AccordionTrigger className="text-left font-bold text-gray-900 hover:text-[#bce600] py-6 hover:no-underline [&>svg]:text-indigo-500">
                      <span className="text-lg">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-500 leading-relaxed pb-6 pt-0 text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Right Column - App Download CTA */}
          <div className="lg:col-span-2 lg:sticky lg:top-32 mt-6 lg:mt-0">
            <div className="bg-[#0A0A0B] rounded-[2.5rem] pt-14 pb-10 px-10 md:pt-16 md:pb-12 md:px-12 relative overflow-hidden flex flex-col items-center justify-center border border-white/10 shadow-2xl text-center">
              {/* Decorative gradients */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/30 rounded-full blur-[80px]" />
              
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.4)] mb-8 relative z-10 border-4 border-indigo-500/30">
                <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=400&auto=format&fit=crop" alt="Mobile App" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
              
              <h3 className="text-3xl font-extrabold text-white mb-4 relative z-10 tracking-tight leading-tight">
                Your Dream College in Your Pocket
              </h3>
              
              <p className="text-slate-400 mb-10 text-lg relative z-10">
                Download the College Gupshup app for instant alerts, personalized AI counseling, and one-tap applications.
              </p>
              
              <div className="flex flex-col w-full gap-4 relative z-10">
                <button className="flex items-center justify-center w-full h-14 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold transition-all duration-300 backdrop-blur-md">
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                  </svg>
                  Google Play
                </button>
                <button className="flex items-center justify-center w-full h-14 bg-white hover:bg-gray-100 text-gray-900 rounded-2xl font-bold transition-all duration-300 shadow-lg">
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  App Store
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
