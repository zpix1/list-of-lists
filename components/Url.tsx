import React from 'react'

export const Url = ({ children, ...other }: React.HTMLProps<HTMLAnchorElement>) => {
  return <>
    <a {...other}>
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
}