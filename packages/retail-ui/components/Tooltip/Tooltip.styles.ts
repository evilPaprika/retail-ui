import { css } from 'emotion';
import { ITheme } from '../../lib/ThemeManager';

const jsStyles = {
  cross(t: ITheme) {
    return css`
      color: ${t.tooltipCloseBtnColor};

      &:hover {
        color: ${t.tooltipCloseBtnHoverColor};
      }
    `;
  },
};

export default jsStyles;
