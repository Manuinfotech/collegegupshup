import { Card, CardContent } from '@/components/ui/card';
import { Hammer, Rocket, ArrowRight } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export function ComingSoon({ title, description, returnPath = '/dashboard' }: { title: string, description: string, returnPath?: string }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur opacity-30 animate-pulse"></div>
        <div className="relative h-24 w-24 rounded-full bg-white border border-indigo-100 flex items-center justify-center shadow-sm">
          <Rocket className="h-10 w-10 text-indigo-600" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-8 mb-2 text-center">{title}</h1>
      <p className="text-slate-500 max-w-md text-center text-base mb-8">
        {description}
      </p>

      <div className="flex gap-4 mt-8">
        <Link href={returnPath} className={buttonVariants({ variant: 'default', className: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 px-6 flex items-center" })}>
          Go Back
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
