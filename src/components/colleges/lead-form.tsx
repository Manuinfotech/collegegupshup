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
    <Card className="border-blue-200 shadow-md">
      <CardHeader className="bg-blue-50 border-b border-blue-100">
        <CardTitle className="text-lg text-blue-900">
          Interested in {collegeName}?
        </CardTitle>
        <p className="text-sm text-blue-700">Fill in your details to get more information</p>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" {...register('name')} placeholder="Enter your name" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" {...register('email')} placeholder="Enter your email" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input id="phone" {...register('phone')} placeholder="Enter phone number" />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register('city')} placeholder="Your city" />
          </div>
          <div>
            <Label htmlFor="course_interest">Course Interest</Label>
            <Input id="course_interest" {...register('course_interest')} placeholder="e.g., MBA, Engineering" />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
