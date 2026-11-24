import { deleteDeal } from '@/entities/deal'
import { DealFormDialog } from '@/features/deals'
import {
  Button,
  Deal,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  SelectClient
} from '@/shared'
import { PencilLine, Trash } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'

export interface ActionsCellProps {
  clients: SelectClient[]
  deal: Deal
  deleteId: number | null
  setDeleteId: Dispatch<SetStateAction<number | null>>
}

export function ActionsCell({
  clients,
  deal,
  deleteId,
  setDeleteId
}: ActionsCellProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteDeal(deleteId)
      setDeleteId(null)
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className='p-2 text-right space-x-2 whitespace-nowrap pr-6'>
      <DealFormDialog
        mode='edit'
        clients={clients}
        deal={deal}
        trigger={
          <Button variant='ghost'>
            <PencilLine />
          </Button>
        }
      />

      <Dialog
        open={deleteId === deal.id}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogTrigger
          render={
            <Button
              disabled={isDeleting}
              variant='ghost'
              className='text-red-600'
              onClick={() => setDeleteId(deal.id)}
            >
              <Trash />
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить сделку?</DialogTitle>
            <DialogDescription>
              Сделка №{deal.number} на сумму{' '}
              {Number(deal.amount).toLocaleString('ru-RU')} будет удалена
              безвозвратно.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteId(null)}>
              Отмена
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Удаление…' : 'Удалить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
