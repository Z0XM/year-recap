'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { accent_color: string }
>(({ className, accent_color, ...props }, ref) => (
    <SliderPrimitive.Root ref={ref} className={cn('relative flex w-full touch-none select-none items-center', className)} {...props}>
        <SliderPrimitive.Track
            style={{ backgroundColor: `hsl(from ${accent_color} h s l / 0.2)` }}
            className="relative h-1.5 w-full grow overflow-hidden rounded-full"
        >
            <SliderPrimitive.Range style={{ backgroundColor: accent_color }} className="absolute h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
            style={{ borderColor: `hsl(from ${accent_color} h s l / 0.5)` }}
            className="block h-4 w-4 rounded-full border bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        />
    </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
