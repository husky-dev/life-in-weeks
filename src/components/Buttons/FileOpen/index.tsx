import { mc, StyleProps } from '@styles';
import { TestIdProps } from '@utils';
import React, { ChangeEvent, FC, ReactNode } from 'react';

interface Props extends StyleProps, TestIdProps {
  children?: ReactNode;
  accept?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const FileOpenBtn: FC<Props> = ({ testId, className, style, children, accept, onChange }) => {
  return (
    <span
      data-testid={testId}
      className={mc(
        'block relative',
        'px-3.5',
        'bg-white-smoke',
        'cursor-pointer',
        'border border-soft-peach rounded-md',
        'text-dove-gray text-center text-sm leading-8',
        'hover:opacity-70 transition-opacity',
        className,
      )}
      style={style}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept={accept}
        onChange={onChange}
      />
      {children}
    </span>
  );
};

export default FileOpenBtn;
