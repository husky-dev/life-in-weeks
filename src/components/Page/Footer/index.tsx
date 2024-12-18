import { config } from '@/core/config';
import { mc, StyleProps } from '@/styles';
import { TestIdProps } from '@/utils';
import React, { FC } from 'react';

type Props = StyleProps & TestIdProps;

export const PageFooter: FC<Props> = ({ testId, className, style }) => {
  return (
    <footer data-testid={testId} className={mc('space-y-0.5', 'text-center text-xs', className)} style={style}>
      <div>
        <span>{'© 2023 '}</span>
        <a className="link" href="https://life.husky-dev.me">
          {'Your Life in Weeks'}
        </a>
      </div>
      <div>
        <span>{'Powered by '}</span>
        <a className="link" href="https://husky-dev.me" target="__blank">
          {'Husky Dev'}
        </a>
      </div>
      <div>{`v${config.version}`}</div>
    </footer>
  );
};

export default PageFooter;
