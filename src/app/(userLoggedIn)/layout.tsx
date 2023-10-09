
import React from 'react';
import styles from './layout.module.css'
// Next.js
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'FitFriends',
  description: "Login to access your FitFriends account and challenges!",
}

/* all logged in pages receive this layout */
export default function LoggedInLayout({
  children,
} : {
  children: React.ReactNode
}) {
  return (
    <>
    {/* header logged in */}
    <h1>HEADER LOGGED IN</h1>
     {children}
    {/* footer logged in */}
    </>
  )
}