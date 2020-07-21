import React from 'react';
import { useTransition } from 'react-spring';

import { Container } from './styles';

import { ToastMessage } from '../../context/toast'
import Toast from './Toast'

interface ToastProps{
  messages: ToastMessage[]
}

const ToastContainer: React.FC<ToastProps> = ({ messages }) => {
  const messageWithTransitions = useTransition(
    messages,
    (message) => message.id,
    {
      from: { right: '-120%', opacity: 0 },
      enter: { right: '0%', opacity:1 },
      leave: { right: '-120%', opacity: 0}
    }
  )
  return (
    <Container>
      {messageWithTransitions.map(({ item, key, props }) => (
        <Toast key={key} style={props} message={item} />
      ))}
      
    </Container>
    );
}

export default ToastContainer;