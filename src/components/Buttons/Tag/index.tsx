import { mc, ms, StyleProps } from '@styles';
import { TestIdProps } from '@utils';
import React, { FC, MouseEvent, ReactNode } from 'react';

interface Props extends StyleProps, TestIdProps {
  children?: ReactNode;
  href?: string;
  size?: 'sm' | 'xs';
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export const TagBtn: FC<Props> = ({ testId, className, style, children, href, size = 'sm', onClick }) => {
  return (
    <a
      data-testid={testId}
      className={mc('block', 'badge badge-primary', className)}
      style={ms(style)}
      role={!href ? 'button' : undefined}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default TagBtn;
