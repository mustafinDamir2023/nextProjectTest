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
import { ClientForm } from './client-form' // Импортируем форму прямо сюда
import type { Client } from '@/types/db'

interface ClientsDialogProps {
  client?: Client
  triggerText?: string // Текст для кнопки
}

export function ClientsDialog({ client, triggerText }: ClientsDialogProps) {
  const [open, setOpen] = useState(false)

  // Эта функция сработает, когда форма успешно сохранится
  const handleSuccess = () => {
    setOpen(false) // Закрываем диалог
    // Опционально: здесь можно добавить toast-уведомление "Успешно!"
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={(props: any) => (
          <Button
            variant={client ? 'ghost' : 'default'}
            size='sm'
            {...props} // Передаем внутренние пропсы триггера в кнопку
          >
            {triggerText || (client ? 'Редактировать' : 'Добавить клиента')}
          </Button>
        )}
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {client ? `Редактирование: ${client.name}` : 'Новый клиент'}
          </DialogTitle>
        </DialogHeader>

        {/* Передаем форму напрямую, без функций-оберток */}
        <ClientForm client={client} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
