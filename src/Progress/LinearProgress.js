// @flow

import React from 'react';
import classNames from 'classnames';
import warning from 'warning';
import withStyles from '../styles/withStyles';

const TRANSITION_DURATION = 4; // 400ms

export const styles = (theme: Object) => ({
  root: {
    position: 'relative',
    overflow: 'hidden',
    height: 5,
  },
  primaryColor: {
    backgroundColor: theme.palette.primary[100],
  },
  primaryColorBar: {
    backgroundColor: theme.palette.primary[500],
  },
  primaryDashed: {
    background: `radial-gradient(${theme.palette.primary[100]} 0%, ${
      theme.palette.primary[100]
    } 16%, transparent 42%)`,
    backgroundSize: '10px 10px',
    backgroundPosition: '0px -23px',
  },
  accentColor: {
    backgroundColor: theme.palette.secondary.A100,
  },
  accentColorBar: {
    backgroundColor: theme.palette.secondary.A400,
  },
  accentDashed: {
    background: `radial-gradient(${theme.palette.secondary.A100} 0%, ${
      theme.palette.secondary.A100
    } 16%, transparent 42%)`,
    backgroundSize: '10px 10px',
    backgroundPosition: '0px -23px',
  },
  bar: {
    width: '100%',
    position: 'absolute',
    left: 0,
    bottom: 0,
    top: 0,
    transition: 'transform 0.2s linear',
    transformOrigin: 'left',
  },
  dashed: {
    position: 'absolute',
    marginTop: 0,
    height: '100%',
    width: '100%',
    animation: 'buffer 3s infinite linear',
  },
  bufferBar2: {
    transition: `transform .${TRANSITION_DURATION}s linear`,
  },
  rootBuffer: {
    backgroundColor: 'transparent',
  },
  rootQuery: {
    transform: 'rotate(180deg)',
  },
  indeterminateBar1: {
    width: 'auto',
    willChange: 'left, right',
    animation: 'mui-indeterminate1 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite',
  },
  indeterminateBar2: {
    width: 'auto',
    willChange: 'left, right',
    animation: 'mui-indeterminate2 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite',
    animationDelay: '1.15s',
  },
  determinateBar1: {
    willChange: 'transform',
    transition: `transform .${TRANSITION_DURATION}s linear`,
  },
  bufferBar1: {
    zIndex: 1,
    transition: `transform .${TRANSITION_DURATION}s linear`,
  },
  bufferBar2Primary: {
    transition: `transform .${TRANSITION_DURATION}s linear`,
    backgroundColor: theme.palette.primary[100],
  },
  bufferBar2Accent: {
    transition: `transform .${TRANSITION_DURATION}s linear`,
    backgroundColor: theme.palette.secondary.A100,
  },
  // Legends:
  // || represents the viewport
  // -  represents a light background
  // x  represents a dark background
  '@keyframes mui-indeterminate1': {
    //  |-----|---x-||-----||-----|
    '0%': {
      left: '-35%',
      right: '100%',
    },
    //  |-----|-----||-----||xxxx-|
    '60%': {
      left: '100%',
      right: '-90%',
    },
    '100%': {
      left: '100%',
      right: '-90%',
    },
  },
  '@keyframes mui-indeterminate2': {
    //  |xxxxx|xxxxx||-----||-----|
    '0%': {
      left: '-200%',
      right: '100%',
    },
    //  |-----|-----||-----||-x----|
    '60%': {
      left: '107%',
      right: '-8%',
    },
    '100%': {
      left: '107%',
      right: '-8%',
    },
  },
  '@keyframes buffer': {
    '0%': {
      opacity: 1,
      backgroundPosition: '0px -23px',
    },
    '50%': {
      opacity: 0,
      backgroundPosition: '0px -23px',
    },
    '100%': {
      opacity: 1,
      backgroundPosition: '-200px -23px',
    },
  },
});

type Color = 'primary' | 'accent';
type Mode = 'determinate' | 'indeterminate' | 'buffer' | 'query';

type ProvidedProps = {
  classes: Object,
  /**
   * @ignore
   */
  theme?: Object,
};

export type Props = {
  /**
   * Other base element props.
   */
  [otherProp: string]: any,
  /**
   * Useful to extend the style applied to components.
   */
  classes?: Object,
  /**
   * @ignore
   */
  className?: string,
  /**
   * The color of the component. It's using the theme palette when that makes sense.
   */
  color: Color,
  /**
   * The mode of show your progress, indeterminate
   * for when there is no value for progress.
   */
  mode: Mode,
  /**
   * The value of progress, only works in determinate and buffer mode.
   * Value between 0 and 100.
   */
  value?: number,
  /**
   * The value of buffer, only works in buffer mode.
   * Value between 0 and 100.
   */
  valueBuffer?: number,
};

class LinearProgress extends React.Component<ProvidedProps & Props> {
  static defaultProps = {
    color: 'primary',
    mode: 'indeterminate',
  };

  render() {
    const { classes, className, color, mode, value, valueBuffer, ...other } = this.props;

    const dashedClass = classNames(classes.dashed, {
      [classes.primaryDashed]: color === 'primary',
      [classes.accentDashed]: color === 'accent',
    });

    const rootClassName = classNames(
      classes.root,
      {
        [classes.primaryColor]: color === 'primary',
        [classes.accentColor]: color === 'accent',
        [classes.rootBuffer]: mode === 'buffer',
        [classes.rootQuery]: mode === 'query',
      },
      className,
    );
    const primaryClassName = classNames(classes.bar, {
      [classes.primaryColorBar]: color === 'primary',
      [classes.accentColorBar]: color === 'accent',
      [classes.indeterminateBar1]: mode === 'indeterminate' || mode === 'query',
      [classes.determinateBar1]: mode === 'determinate',
      [classes.bufferBar1]: mode === 'buffer',
    });
    const secondaryClassName = classNames(classes.bar, {
      [classes.bufferBar2]: mode === 'buffer',
      [classes.primaryColorBar]: color === 'primary' && mode !== 'buffer',
      [classes.primaryColor]: color === 'primary' && mode === 'buffer',
      [classes.accentColorBar]: color === 'accent' && mode !== 'buffer',
      [classes.accentColor]: color === 'accent' && mode === 'buffer',
      [classes.indeterminateBar2]: mode === 'indeterminate' || mode === 'query',
    });
    const inlineStyles = { primary: {}, secondary: {} };
    const rootProps = {};

    if (mode === 'determinate') {
      if (value !== undefined) {
        inlineStyles.primary.transform = `scaleX(${value / 100})`;
        rootProps['aria-valuenow'] = Math.round(value);
      } else {
        warning(
          false,
          'Material-UI: you need to provide a value property ' +
            'when LinearProgress is in determinate mode.',
        );
      }
    } else if (mode === 'buffer') {
      if (value !== undefined) {
        inlineStyles.primary.transform = `scaleX(${value / 100})`;
        inlineStyles.secondary.transform = `scaleX(${(valueBuffer || 0) / 100})`;
      } else {
        warning(
          false,
          'Material-UI: you need to provide a value property when LinearProgress is ' +
            'in buffer mode.',
        );
      }
    }

    return (
      <div className={rootClassName} {...rootProps} {...other}>
        {mode === 'buffer' ? <div className={dashedClass} /> : null}
        <div className={primaryClassName} style={inlineStyles.primary} />
        {mode === 'determinate' ? null : (
          <div className={secondaryClassName} style={inlineStyles.secondary} />
        )}
      </div>
    );
  }
}

export default withStyles(styles, { name: 'MuiLinearProgress' })(LinearProgress);
