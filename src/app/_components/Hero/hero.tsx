import { Button, Link } from "@nextui-org/react";
import Container from "$/src/app/_components/Container/container";
import { SignedOut } from "@clerk/nextjs";
import { siteConfig } from "$/src/config/site";


const Hero = () => {
 return (
   <Container className="flex h-screen flex-col items-center text-center">
     <div className="w-9/12 md:w-6/12">
       <h1 className="mb-5 text-2xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
         NSFAS - Agile, Responsive, Student-Centric
       </h1>
       <p className="text-body-color dark:text-body-color-dark mb-12 text-base !leading-relaxed sm:text-lg md:text-xl">
       The National Student Financial Aid Scheme (NSFAS) in South Africa provides financial aid to eligible students at public universities and TVET colleges to help cover the cost of their education. NSFAS aims to increase access to higher education for students from disadvantaged backgrounds by offering loans and bursaries that cover tuition fees, accommodation, and other educational expenses. The scheme plays a crucial role in supporting the academic journey of many South African students, ensuring they have the necessary resources to succeed in their studies.
       </p>
       <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
         <SignedOut>
           <Button
             className="rounded-sm px-8 py-4 text-base font-semibold"
             size="lg"
             color="primary"
           >
             Sign Up
           </Button>
         </SignedOut>
         <Button
           className="rounded-sm px-8 py-4 text-base font-semibold"
           size="lg"
           color="secondary"
         >
           <Link
             isExternal
             href="https://www.nsfas.org.za/content/mission.html"
             className="text-base font-semibold text-white"
           >
             Learn More About NSFAS
           </Link>
         </Button>
       </div>
     </div>
   </Container>
 
   );
};


export default Hero;