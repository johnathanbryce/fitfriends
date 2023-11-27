'use client'

// Next.js
import Head from 'next/head';
// Internal Components
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
  useAuthenticationRedirect('challenges-dashboard', '/');
  return (
    <LayoutHomePage>
      <Head>
        <title>FitFriends - Home | Begin Your Fitness Challenge Journey</title>
        <meta name="description" content="Join FitFriends to participate in exciting fitness challenges. Stay fit, connect with friends, and enjoy a healthy lifestyle." />
        <meta name="keywords" content="fitness, challenges, health, community, engage, friends" />
      </Head>
      <HeaderHomePage />
      <Hero />
      <HowItWorks />
      {/* <OurStory /> */}
      <GetStarted />
      <FooterLoggedOut />
    </LayoutHomePage>
  )
}
