import React, { ForwardedRef, forwardRef } from 'react';

export const Url = forwardRef(({ children, ...other }: React.HTMLProps<HTMLAnchorElement>, ref: ForwardedRef<HTMLAnchorElement>) => {
  return <>
    <a {...other} ref={ref}>
      {children}
    </a>
    <style jsx>{`
      a {
        color: black;
        text-decoration: none;
        cursor: pointer;
      }
      a:hover {
        text-decoration: underline;
      }
    `}</style>
  </>
});