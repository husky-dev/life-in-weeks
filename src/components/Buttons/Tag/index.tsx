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
      className={mc(
        'block',
        size === 'sm' && 'text-sm px-2.5 py-0.5 font-medium',
        size === 'xs' && 'text-xs px-1.5 py-0.5 font-normal',
        'rounded-md',
        'text-dove-gray text-center',
        'hover:opacity-70 transition-opacity',
        'bg-white-smoke',
        className,
      )}
      style={ms(style)}
      role={!href ? 'button' : undefined}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default TagBtn;
