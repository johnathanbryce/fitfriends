
import LandingPageRouter from "./landing";
// Internal components
import LayoutHomePage from "@/layouts/LayoutHomePage/LayoutHomePage";
import HeaderHomePage from "@/components/Headers/HeaderHomePage/HeaderHomePage";
import Hero from "./(home)/Hero/Hero";
import HowItWorks from "./(home)/HowItWorks/HowItWorks";

export default function Home() {
  return (
    <LayoutHomePage>
      <HeaderHomePage />
      <Hero />
      <HowItWorks />
    </LayoutHomePage>
  )
}
