import React, { useEffect } from 'react';
import { Container } from './styles';
import { FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiXCircle } from 'react-icons/fi'

import { useToast, ToastMessage } from '../../../context/toast'

interface ToastMessageProps {
  message: ToastMessage
  style: object
}

const icons = {
  success: <FiCheckCircle size={24} />,
  info: <FiAlertCircle size={24} />,
  error: <FiAlertTriangle size={24} />
}

const Toast: React.FC<ToastMessageProps> = ({ message, style }) => {
  
  const { removeToast } = useToast()

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id)
    }, 3000)

    // Dispera quando este componente é removido da tela - não esquecer!!!!
    return () => {
      clearTimeout(timer)
    }
  })

  return (
    <Container hasDescription={!!message.description} type={message.type} style={style}>
      {icons && icons[message.type || 'info']}
      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button onClick={() => removeToast(message.id)}>
        <FiXCircle size={18} />
      </button>
    </Container>
  );
}

export default Toast;