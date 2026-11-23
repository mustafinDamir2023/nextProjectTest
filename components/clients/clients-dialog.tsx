'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { ClientForm } from './client-form'
import type { Client } from '@/types/db'
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
        render={() => (
          <Button variant={client ? 'ghost' : 'secondary'} size='sm'>
            {client ? <UserPenIcon /> : <UserPlus />}
          </Button>
        )}
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
