import React from 'react';

import { Container } from './styles';

interface ToolTipProps{
  title: string;
  className?: string; //Para que eu posso estilizar no styles.ts do input importando lá
}

const Tooltip: React.FC<ToolTipProps> = ({ title, children, className = ''}) => {
  return (
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>
    );
}

export default Tooltip;