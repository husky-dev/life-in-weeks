import { mc, StyleProps } from '@styles';
import { TestIdProps } from '@utils';
import React, { FC, ReactNode, MouseEvent } from 'react';

interface Props extends StyleProps, TestIdProps {
  children?: ReactNode;
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export const ContainedBtn: FC<Props> = ({ testId, className, style, children, href, onClick }) => {
  return (
    <a
      data-testid={testId}
      className={mc(
        'block',
        'px-3.5',
        'bg-white-smoke',
        'border border-soft-peach rounded-md',
        'text-dove-gray text-center text-sm leading-8',
        'hover:opacity-70 transition-opacity',
        className,
      )}
      style={style}
      role={!href ? 'button' : undefined}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default ContainedBtn;
