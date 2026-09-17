'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { OWNERSHIP_TYPES, GOALS } from '@/lib/constants';
import { useCallback } from 'react';

interface CollegeFiltersProps {
  hideGoalFilter?: boolean;
}

const STATES = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh'];

export function CollegeFilters({ hideGoalFilter = false }: CollegeFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentGoal = searchParams.get('goal')?.toLowerCase() || '';
  const currentState = searchParams.get('state')?.toLowerCase() || '';
  const currentCity = searchParams.get('city')?.toLowerCase() || '';
  const currentOwnership = searchParams.get('ownership')?.toLowerCase() || '';

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete('page'); // Reset page when filtering
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (key: string, value: string) => {
    // If the value is already selected, unselect it by passing empty string
    const currentValue = searchParams.get(key)?.toLowerCase() || '';
    const newValue = currentValue === value.toLowerCase() ? '' : value;
    router.push(pathname + '?' + createQueryString(key, newValue));
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('goal');
    params.delete('state');
    params.delete('city');
    params.delete('ownership');
    params.delete('page');
    router.push(pathname + '?' + params.toString());
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

        {/* Stream / Goal */}
        {!hideGoalFilter && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Stream / Course</h4>
            <div className="space-y-2">
              {GOALS.map((goal) => (
                <label key={goal.slug} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox 
                    checked={currentGoal === goal.slug.toLowerCase()} 
                    onCheckedChange={() => handleFilterChange('goal', goal.slug)}
                  />
                  <span className="text-sm text-gray-600">{goal.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* State */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">State</h4>
          <div className="space-y-2">
            {STATES.map((state) => (
              <label key={state} className="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  checked={currentState === state.toLowerCase()} 
                  onCheckedChange={() => handleFilterChange('state', state)}
                />
                <span className="text-sm text-gray-600">{state}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ownership Type */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Ownership Type</h4>
          <div className="space-y-2">
            {OWNERSHIP_TYPES.map((type) => (
              <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  checked={currentOwnership === type.value.toLowerCase()} 
                  onCheckedChange={() => handleFilterChange('ownership', type.value)}
                />
                <span className="text-sm text-gray-600">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleClearFilters}>
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
}
