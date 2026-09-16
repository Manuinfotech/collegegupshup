'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle2, X, Mail } from 'lucide-react';

export function VerificationPopup() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get('verified') === 'pending') {
      setVisible(true);
      // Auto-dismiss after 8 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  function handleClose() {
    setVisible(false);
    // Clean URL without the query param
    router.replace('/', { scroll: false });
  }

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
        onClick={handleClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-500">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200 animate-in zoom-in duration-500 delay-200">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-md animate-in zoom-in duration-500 delay-500">
                <Mail className="h-3.5 w-3.5 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Account Created Successfully!
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to activate your account.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4">
              <p className="text-sm text-amber-800 font-medium">
                💡 Don&apos;t forget to check your spam folder if you don&apos;t see the email within a few minutes.
              </p>
            </div>
          </div>

          {/* Action */}
          <button
            onClick={handleClose}
            className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 active:scale-[0.98]"
          >
            Got it, thanks!
          </button>

          {/* Progress bar auto-dismiss indicator */}
          <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              style={{
                animation: 'shrink 8s linear forwards',
              }}
            />
          </div>
          <style jsx>{`
            @keyframes shrink {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
