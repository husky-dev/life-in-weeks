import { mc, StyleProps } from '@/styles';
import { TestIdProps } from '@/utils';
import React, { ChangeEvent, FC, ReactNode } from 'react';

interface Props extends StyleProps, TestIdProps {
  children?: ReactNode;
  accept?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const FileOpenBtn: FC<Props> = ({ testId, className, style, children, accept, onChange }) => {
  return (
    <div data-testid={testId} className={mc('relative', 'btn btn-primary', className)} style={style}>
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept={accept}
        onChange={onChange}
      />
      {children}
    </div>
  );
};

export default FileOpenBtn;
