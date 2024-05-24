import cx from 'clsx';

type CalloutProps =  {
  children: React.ReactNode
  variant?: 'info' | 'warning' | 'error' | 'success'
}

export const Callout = ({ children, variant = 'info' }: CalloutProps) => {
  return (
    <div className={cx('callout', `callout--${variant}`)}>
      {children}
    </div>
  )
}