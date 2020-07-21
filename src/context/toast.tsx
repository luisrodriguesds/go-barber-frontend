import React, { createContext, useContext, useCallback, useState } from 'react';
import { uuid } from 'uuidv4'
import Toast from '../components/ToastContainer'

interface ToastContextData {
  addToast(obj: Omit<ToastMessage, 'id'>): void
  removeToast(id: string): void
}

export interface ToastMessage {
  id: string
  type?: 'success' | 'error' | 'info'
  title: string
  description?: string
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC = ({ children }) => {
  const [message, setMessage] = useState<ToastMessage[]>([])

  const addToast = useCallback(({ type, title, description }: Omit<ToastMessage, 'id'>): void => {
    const id = uuid()
    const toast = {
      id,
      type,
      title,
      description
    }
    setMessage(state => [...state , toast])
    
  }, [])

  const removeToast = useCallback((id: string) => {
    setMessage(state => state.filter(message => message.id !== id) )
  }, [])
  return (
    <ToastContext.Provider value={{addToast, removeToast}}>
      {children}
      <Toast messages={message} />
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextData => {
  const context = useContext(ToastContext)

  if (!context) {
    throw Error('useToast must be used whithin a ToastProvider')
  }

  return context
}