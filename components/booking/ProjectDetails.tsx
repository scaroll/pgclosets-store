'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { BookingData } from '@/app/book/page';

interface ProjectDetailsFormData {
  projectType: string;
  roomWidth: number;
  roomHeight: number;
  roomDepth: number;
  budget: string;
  timeline: string;
  additionalNotes: string;
}

interface ProjectDetailsProps {
  data: BookingData;
  onUpdate: (data: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function ProjectDetails({
  data,
  onUpdate,
  onNext,
  onBack,
  isSubmitting,
}: ProjectDetailsProps) {
  const [budgetValue, setBudgetValue] = useState<number>(
    data.budget ? parseInt(data.budget.replace(/\D/g, '')) : 3000
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<ProjectDetailsFormData>({
    defaultValues: {
      projectType: data.projectType || '',
      roomWidth: data.roomDimensions?.width || 0,
      roomHeight: data.roomDimensions?.height || 8,
      roomDepth: data.roomDimensions?.depth || 0,
      budget: data.budget || '',
      timeline: data.timeline || '',
      additionalNotes: data.additionalNotes || '',
    },
  });

  const onSubmit = (formData: ProjectDetailsFormData) => {
    onUpdate({
      projectType: formData.projectType,
      roomDimensions: {
        width: formData.roomWidth,
        height: formData.roomHeight,
        depth: formData.roomDepth,
      },
      budget: `$${budgetValue}`,
      timeline: formData.timeline,
      additionalNotes: formData.additionalNotes,
    });
    onNext();
  };

  const formatBudgetDisplay = (value: number) => {
    if (value >= 10000) return '$10,000+';
    return `$${value.toLocaleString()}`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Project Type */}
      <div>
        <Label>What type of closet project are you planning? *</Label>
        <RadioGroup
          defaultValue={watch('projectType')}
          onValueChange={(value) => setValue('projectType', value)}
          className="grid md:grid-cols-2 gap-3 mt-2"
        >
          <div className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="reach-in" id="reach-in" />
            <div>
              <Label htmlFor="reach-in" className="font-normal cursor-pointer">
                Reach-In Closet
              </Label>
              <p className="text-xs text-gray-600">Standard closet with doors</p>
            </div>
          </div>

          <div className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="walk-in" id="walk-in" />
            <div>
              <Label htmlFor="walk-in" className="font-normal cursor-pointer">
                Walk-In Closet
              </Label>
              <p className="text-xs text-gray-600">Room-sized closet space</p>
            </div>
          </div>

          <div className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="pantry" id="pantry" />
            <div>
              <Label htmlFor="pantry" className="font-normal cursor-pointer">
                Pantry
              </Label>
              <p className="text-xs text-gray-600">Kitchen storage solution</p>
            </div>
          </div>

          <div className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="garage" id="garage" />
            <div>
              <Label htmlFor="garage" className="font-normal cursor-pointer">
                Garage Storage
              </Label>
              <p className="text-xs text-gray-600">Garage organization system</p>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Room Dimensions */}
      <div>
        <Label>Approximate Room Dimensions (feet)</Label>
        <p className="text-sm text-gray-600 mb-3">
          Don't worry about being exact - we'll measure precisely during the consultation
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="roomWidth" className="text-sm">Width</Label>
            <Input
              id="roomWidth"
              type="number"
              {...register('roomWidth', { valueAsNumber: true })}
              placeholder="0"
              min="0"
              step="0.5"
            />
          </div>
          <div>
            <Label htmlFor="roomHeight" className="text-sm">Height</Label>
            <Input
              id="roomHeight"
              type="number"
              {...register('roomHeight', { valueAsNumber: true })}
              placeholder="8"
              min="0"
              step="0.5"
            />
          </div>
          <div>
            <Label htmlFor="roomDepth" className="text-sm">Depth</Label>
            <Input
              id="roomDepth"
              type="number"
              {...register('roomDepth', { valueAsNumber: true })}
              placeholder="0"
              min="0"
              step="0.5"
            />
          </div>
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <Label>Approximate Budget</Label>
        <p className="text-sm text-gray-600 mb-3">
          This helps us provide options that fit your budget
        </p>
        <div className="space-y-3">
          <Slider
            value={[budgetValue]}
            onValueChange={(value) => setBudgetValue(value?.[0] || 0)}
            min={1000}
            max={10000}
            step={250}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>$1,000</span>
            <span className="text-lg font-semibold text-blue-600">
              {formatBudgetDisplay(budgetValue)}
            </span>
            <span>$10,000+</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <Label htmlFor="timeline">When would you like the project completed?</Label>
        <Select
          defaultValue={watch('timeline')}
          onValueChange={(value) => setValue('timeline', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select timeline..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asap">As soon as possible</SelectItem>
            <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
            <SelectItem value="1-month">Within 1 month</SelectItem>
            <SelectItem value="2-months">Within 2 months</SelectItem>
            <SelectItem value="3-months">Within 3 months</SelectItem>
            <SelectItem value="flexible">I'm flexible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Additional Notes */}
      <div>
        <Label htmlFor="additionalNotes">
          Additional Information (Optional)
        </Label>
        <Textarea
          id="additionalNotes"
          {...register('additionalNotes')}
          placeholder="Tell us about any specific requirements, challenges, or questions you have..."
          rows={4}
          className="resize-none"
        />
      </div>

      {/* AI Cost Estimate */}
      {watch('projectType') && budgetValue && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Estimated Project Range
          </h3>
          <p className="text-sm text-blue-800">
            Based on your selections, similar {watch('projectType').replace('-', ' ')} projects
            typically range from{' '}
            <span className="font-semibold">
              ${Math.floor(budgetValue * 0.8).toLocaleString()}
            </span>
            {' to '}
            <span className="font-semibold">
              ${Math.floor(budgetValue * 1.2).toLocaleString()}
            </span>
            . Your designer will provide an exact quote during the consultation.
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || !watch('projectType')}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Booking...
            </>
          ) : (
            'Complete Booking'
          )}
        </Button>
      </div>
    </form>
  );
}