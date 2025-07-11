import React from 'react';

import classNames from 'classnames';

import Spinner from './Spinner';

interface ButtonLinkProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({
  children,
  className = '',
  href = '#',
  target = '_self',
  rel = 'noopener noreferrer',
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (loading) {
      e.preventDefault(); // Prevent navigation if already loading
      return;
    }

    setLoading(true); // Set loading state to true to prevent further clicks
    //Allow default anchor behaviour to take effect
  };

  return (
    <a
      className={classNames(className, 'hover:cursor-pointer', { 'opacity-50 cursor-not-allowed': loading })}
      target={target}
      rel={rel}
      href={href}
      onClick={handleClick}
    >
      {loading ? <Spinner className="position-absolute" /> : children}
    </a>
  );
};
export interface ButtonProps {
  children: React.ReactNode;
  color?: 'primary' | 'danger' | 'accent' | 'secondary';
  outline?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset' | 'link';
  block?: boolean;
  className?: string;
  onSubmit?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  color = 'accent',
  outline = false,
  disabled = false,
  onClick,
  href,
  target,
  rel,
  type,
  block,
  className,
  onSubmit,
}) => {
  const classes = classNames(
    className,
    'px-2 py-1 rounded focus:outline-none font-semibold transition-colors duration-300 ease-in-out border focus:border-button-text',
    {
      'text-button-text': ['primary', 'danger', 'accent', 'secondary'].includes(color) && !outline,
      'text-button-text-secondary': !['primary', 'danger', 'accent', 'secondary'].includes(color) && !outline,
      'text-button-primary bg-transparent border border-button-primary hover:bg-button-primary hover:text-button-text':
        outline && color === 'primary',
      'bg-button-primary border-button-primary hover:bg-button-primary-active hover:border-button-primary-active':
        !outline && color === 'primary',
      'text-button-danger bg-transparent border border-button-danger hover:bg-button-danger hover:text-button-text':
        outline && color === 'danger',
      'bg-button-danger border-button-danger hover:bg-button-danger-active hover:border-button-danger-active':
        !outline && color === 'danger',
      'text-button-accent bg-transparent border border-button-accent hover:bg-button-accent hover:text-button-text':
        outline && color === 'accent',
      'bg-button-accent border-button-accent hover:bg-button-accent-active hover:border-button-accent-active':
        !outline && color === 'accent',
      'text-button-secondary bg-transparent border border-button-secondary hover:bg-button-secondary hover:text-button-text':
        outline && color === 'secondary',
      'bg-button-secondary border-button-secondary hover:bg-button-secondary-active': !outline && color === 'secondary',
      'opacity-50 cursor-not-allowed': disabled,
      'focus:ring-2 focus:ring-focus-ring focus:ring-opacity-50 focus:border-focus-ring': true,
      'w-full': block,
      'flex flex-row justify-center items-center': type === 'link',
    },
  );

  if (type === 'link') {
    return (
      <ButtonLink className={classes} href={href} target={target} rel={rel}>
        {children}
      </ButtonLink>
    );
  }

  return (
    <button
      className={classes}
      onClick={(e) => {
        if (type !== 'submit') {
          e.preventDefault();
        }

        if (onClick) {
          onClick(e);
        }
      }}
      disabled={disabled}
      type={type}
      onSubmit={onSubmit}
    >
      {children}
    </button>
  );
};

export default Button;
