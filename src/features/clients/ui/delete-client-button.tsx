'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Client
} from '@/shared'
import { deleteClient } from '@/entities/client'
import { TrashIcon } from 'lucide-react'

export function DeleteClientButton({ client }: { client: Client }) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setBusy(true)
    await deleteClient(client.id)
    router.refresh()
    setBusy(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type='button'
            className='inline-flex items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] hover:bg-muted hover:text-foreground [&_svg]:size-3.5 text-red-600'
          >
            <TrashIcon />
          </button>
        }
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить клиента?</DialogTitle>
          <DialogDescription>
            Клиент «{client.name}» и все его сделки будут удалены безвозвратно.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button variant='destructive' onClick={handleDelete} disabled={busy}>
            {busy ? 'Удаление…' : 'Удалить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
