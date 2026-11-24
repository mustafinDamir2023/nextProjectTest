'use client'

import { useState } from 'react'
import {
  Client,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared'
import { ClientForm } from './client-form'
import { UserPenIcon, UserPlus } from 'lucide-react'

interface ClientsDialogProps {
  client?: Client
}

export function ClientsDialog({ client }: ClientsDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type='button'
            className='inline-flex items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] [&_svg]:size-3.5 hover:bg-muted hover:text-foreground'
          >
            {client ? <UserPenIcon /> : <UserPlus />}
          </button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {client ? `Редактирование: ${client.name}` : 'Новый клиент'}
          </DialogTitle>
        </DialogHeader>

        <ClientForm client={client} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
