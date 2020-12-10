import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { Override } from '../../typings/utility-types';
import { ThemeContext } from '../../lib/theming/ThemeContext';
import { Theme } from '../../lib/theming/Theme';

import { jsStyles } from './Radio.styles';

export type RadioProps<T> = Override<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
  {
    /** Состояние ошибки */
    error?: boolean;
    /** Состояние Предупреждения */
    warning?: boolean;
    /** Состояние фокуса */
    focused?: boolean;
    /** Состояние нажатия */
    pressed?: boolean;
    /** Состояние hover */
    hovered?: boolean;
    /** Состояние active */
    active?: boolean;
    /** Вызывается при изменении `value` */
    onValueChange?: (value: T) => void;
    onMouseEnter?: React.MouseEventHandler<HTMLLabelElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLLabelElement>;
    onMouseOver?: React.MouseEventHandler<HTMLLabelElement>;
    /** Значение */
    value: T;
    'data-tid'?: string;
    'data-testid'?: string;
  }
>;

export class Radio<T> extends React.Component<RadioProps<T>> {
  public static __KONTUR_REACT_UI__ = 'Radio';

  public static contextTypes = {
    activeItem: PropTypes.any,
    onSelect: PropTypes.func,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    warning: PropTypes.bool,
  };

  public static defaultProps = {
    focused: false,
  };

  private theme!: Theme;
  private inputEl = React.createRef<HTMLInputElement>();

  public render() {
    return (
      <ThemeContext.Consumer>
        {theme => {
          this.theme = theme;
          return this.renderMain();
        }}
      </ThemeContext.Consumer>
    );
  }

  /**
   * @public
   */
  public focus() {
    this.inputEl.current?.focus();
  }

  /**
   * @public
   */
  public blur() {
    this.inputEl.current?.blur();
  }

  public renderMain() {
    const {
      active,
      children,
      disabled = this.context.disabled,
      warning = this.context.warning,
      error = this.context.error,
      focused,
      pressed,
      hovered,
      onMouseOver,
      onMouseEnter,
      onMouseLeave,
      onValueChange,

      className,
      style,

      'data-tid': datatid,
      'data-testid': datatestid,
      ...rest
    } = this.props;

    let radioClassNames = cn({
      [jsStyles.radio(this.theme)]: true,
      [jsStyles.checked(this.theme)]: this.props.checked,
      [jsStyles.focus(this.theme)]: this.props.focused,
      [jsStyles.error(this.theme)]: error,
      [jsStyles.warning(this.theme)]: warning,
      [jsStyles.disabled(this.theme)]: disabled,
    });

    let value: string | number | undefined;
    if (typeof this.props.value === 'string' || typeof this.props.value === 'number') {
      value = this.props.value;
    }

    const inputProps = {
      ...rest,
      type: 'radio',
      className: jsStyles.input(),
      disabled,
      value,
      ref: this.inputEl,
      onChange: this.handleChange,
    };

    const labelProps = {
      className: cn(className, jsStyles.root(this.theme)),
      onMouseOver,
      onMouseEnter,
      onMouseLeave,
      style,
      'data-tid': datatid,
      'data-testid': datatestid,
    };

    if (this._isInRadioGroup()) {
      const checked = this.props.value === this.context.activeItem;
      inputProps.checked = checked;
      inputProps.name = this.context.name;
      radioClassNames = cn(radioClassNames, checked && jsStyles.checked(this.theme));
    }

    return (
      <label {...labelProps}>
        <input {...inputProps} />
        <span className={radioClassNames}>
          <span className={jsStyles.placeholder()} />
        </span>
        {this.props.children && this.renderLabel()}
      </label>
    );
  }

  private _isInRadioGroup = () => Boolean(this.context.name);

  private renderLabel() {
    const labelClassNames = cn({
      [jsStyles.label(this.theme)]: true,
      [jsStyles.labelDisabled()]: !!(this.props.disabled || this.context.disabled),
    });

    return <div className={labelClassNames}>{this.props.children}</div>;
  }

  private handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    this.props.onValueChange?.(this.props.value);

    if (this._isInRadioGroup()) {
      this.context.onSelect(this.props.value);
    }

    this.props.onChange?.(e);
  };
}
