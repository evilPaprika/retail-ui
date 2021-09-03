import React from 'react';
import PropTypes from 'prop-types';

import { theme } from '../../lib/theming/decorators';
import { locale } from '../../lib/locale/decorators';
import { Theme } from '../../lib/theming/Theme';
import { SpinnerIcon } from '../../internal/icons/SpinnerIcon';
import { CommonProps, CommonWrapper } from '../../internal/CommonWrapper';
import { cx } from '../../lib/theming/Emotion';

import { styles } from './Spinner.styles';
import { SpinnerLocale, SpinnerLocaleHelper } from './locale';

const types: Record<SpinnerType, SpinnerType> = {
  big: 'big',
  mini: 'mini',
  normal: 'normal',
};

export type SpinnerType = 'mini' | 'normal' | 'big';

export interface SpinnerProps extends CommonProps {
  caption?: React.ReactNode;
  dimmed?: boolean;
  /**
   * Тип спиннера
   * @default normal
   */
  type: SpinnerType;
}

/**
 * DRAFT - инлайн-лоадер
 */

@locale('Spinner', SpinnerLocaleHelper)
@theme
export class Spinner extends React.Component<SpinnerProps> {
  public static __KONTUR_REACT_UI__ = 'Spinner';

  public static propTypes = {
    /**
     * Текст рядом с мини-лоадером.
     *
     * 'Загрузка' - значение по-умолчанию
     */
    caption: PropTypes.node,

    dimmed: PropTypes.bool,

    /**
     * Тип спиннера: mini, normal, big
     *
     * Значение по-умолчанию - normal
     *
     * Spinner.types - все доступные типы
     */
    type: PropTypes.oneOf(Object.keys(types)),
  };

  public static defaultProps: SpinnerProps = {
    type: 'normal',
  };

  public static Types: typeof types = types;
  private readonly theme!: Theme;
  private readonly locale!: SpinnerLocale;

  constructor(props: SpinnerProps) {
    super(props);
  }

  public render() {
    const { type, caption = this.locale.loading, dimmed } = this.props;

    return (
      <CommonWrapper {...this.props}>
        <div className={styles.spinner()}>
          <span className={styles.inner()}>{this.renderSpinner(type, dimmed)}</span>
          {caption && this.renderCaption(type, caption)}
        </div>
      </CommonWrapper>
    );
  }

  private renderSpinner = (type: SpinnerType, dimmed?: boolean) => {
    const circleClassName = dimmed ? styles.circleDimmed(this.theme) : styles.circle(this.theme);

    return <SpinnerIcon size={type} className={circleClassName} dimmed={dimmed} />;
  };

  private renderCaption = (type: SpinnerType, caption: React.ReactNode) => (
    <span className={cx(styles[type](this.theme), styles.captionColor(this.theme))}>{caption}</span>
  );
}
