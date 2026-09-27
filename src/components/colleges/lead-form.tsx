'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  city: z.string().optional(),
  course_interest: z.string().optional(),
  message: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  collegeId: string;
  collegeName: string;
  source: string;
  onSuccess?: () => void;
}

export function LeadForm({ collegeId, collegeName, source, onSuccess }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, college_id: collegeId, source }),
      });

      if (res.ok) {
        toast.success('Your enquiry has been submitted successfully!');
        reset();
        onSuccess?.();
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl w-full p-2 md:p-6">
      <div className="mb-6 text-center space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Interested in {collegeName}?
        </h2>
        <p className="text-[15px] text-slate-500 font-medium">
          Fill in your details to get more information
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name *</Label>
          <Input 
            id="name" 
            {...register('name')} 
            placeholder="e.g. Rahul Sharma" 
            className="h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-xl bg-slate-50 hover:bg-white transition-colors"
          />
          {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>}
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address *</Label>
          <Input 
            id="email" 
            type="email" 
            {...register('email')} 
            placeholder="e.g. rahul@example.com" 
            className="h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-xl bg-slate-50 hover:bg-white transition-colors"
          />
          {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>}
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">Mobile Number *</Label>
          <Input 
            id="phone" 
            {...register('phone')} 
            placeholder="e.g. 9876543210" 
            className="h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-xl bg-slate-50 hover:bg-white transition-colors"
          />
          {errors.phone && <p className="text-xs text-rose-500 font-medium">{errors.phone.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-sm font-semibold text-slate-700">City</Label>
            <Input 
              id="city" 
              {...register('city')} 
              placeholder="e.g. Mumbai" 
              className="h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-xl bg-slate-50 hover:bg-white transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="course_interest" className="text-sm font-semibold text-slate-700">Course Interest</Label>
            <Input 
              id="course_interest" 
              {...register('course_interest')} 
              placeholder="e.g. MBA, B.Tech" 
              className="h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-xl bg-slate-50 hover:bg-white transition-colors"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 font-semibold text-[15px]" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
        </Button>
      </form>
    </div>
  );
}
