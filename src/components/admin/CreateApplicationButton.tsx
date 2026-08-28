'use client';

import { useState, useTransition } from 'react';
import { Plus } from 'lucide-react';
import { createApplicationAction } from '@/app/actions/crm';
import { Button } from '@/components/ui/button';

export function CreateApplicationButton({
  leadId,
  universityId,
}: {
  leadId: string;
  universityId?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function handleCreate() {
    if (!universityId) return;
    startTransition(async () => {
      const result = await createApplicationAction({
        leadId,
        universityId,
      });
      if (result.ok) {
        setDone(true);
      }
    });
  }

  if (done) {
    return (
      <span className="text-xs text-green-600">Application created</span>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleCreate}
      disabled={pending || !universityId}
    >
      <Plus className="mr-1 h-3 w-3" />
      {pending ? 'Creating…' : 'Create Application'}
    </Button>
  );
}
