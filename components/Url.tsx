import React from 'react'

export const Url = ({ children }: React.HTMLProps<HTMLSpanElement>) => {
  return <>
    <span>
      {children}
    </span>
    <style jsx>{`
      span {
        text-decoration: none;
        cursor: pointer;
      }
      span:hover {
        text-decoration: underline;
      }
    `}</style>
  </>
}