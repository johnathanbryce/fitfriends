'use client'
import { useEffect, useState } from 'react';
// Next.js
import { useRouter } from 'next/navigation';
// Internal Components
import Loading from './loading';
import LayoutHomePage from "@/layouts/LayoutHomePage/LayoutHomePage";
import HeaderHomePage from "@/components/Headers/HeaderHomePage/HeaderHomePage";
import Hero from "./(home)/Hero/Hero";
import HowItWorks from "./(home)/HowItWorks/HowItWorks";
import OurStory from "./(home)/OurStory/OurStory";
import GetStarted from "./(home)/GetStarted/GetStarted";
import FooterLoggedOut from "@/components/Footers/FooterLoggedOut/FooterLoggedOut";
// Custom Hook
import useAuthenticationRedirect from '@/hooks/useAuthenticationRedirect';

export default function Home() {
  useAuthenticationRedirect('/', 'challenges-dashboard');

  return (
    <LayoutHomePage>
      <HeaderHomePage />
      <Hero />
      <HowItWorks />
      <OurStory />
      <GetStarted />
      <FooterLoggedOut />
    </LayoutHomePage>
  )
}
