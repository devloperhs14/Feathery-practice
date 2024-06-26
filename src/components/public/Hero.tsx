
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import HeroCards  from "@/components/public/HeroCard";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export const Hero = () => {
  return (
    <div className="container  grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              Document,{" "}
            </span>
            Create,{" "}
          </h1>
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              and Connect.
            </span>{" "}
            
          </h2>
          <p className="text-xl mt-2">Your Journey Starts Here</p>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3"><Link href={'/sign-up'}>Get Started</Link></Button>

         
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </div>
  );
};
