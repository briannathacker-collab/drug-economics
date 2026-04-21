'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { MethodologyModalContent } from './MethodologyModal';

interface EstBadgeProps {
  confidence?: 'high' | 'medium' | 'low';
  className?: string;
}

export function EstBadge({ confidence = 'medium', className }: EstBadgeProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium font-mono',
            'bg-[#FFFBEB] text-[#b8860b] border border-[#b8860b]/20',
            'hover:bg-[#b8860b]/10 transition-colors cursor-pointer',
            className
          )}
          title={`Confidence: ${confidence}. Click for methodology details.`}
        >
          est.
          {confidence === 'low' && <span className="text-[10px]">⚠</span>}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-8 max-w-3xl w-[92vw] max-h-[85vh] overflow-y-auto shadow-xl z-50">
          <MethodologyModalContent />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
