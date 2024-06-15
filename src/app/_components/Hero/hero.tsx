// Import necessary components and modules from their respective libraries
import { Button, Link } from "@nextui-org/react";
import Container from "$/src/app/_components/Container/container";
import { SignedOut } from "@clerk/nextjs";
import { siteConfig } from "$/src/config/site";

// Define a functional component named Hero
const Hero = () => {
  // The component returns a Container component with certain styling
  return (
    <Container className="flex h-screen flex-col items-center text-center">
      {/* A div to contain the main content with responsive width settings */}
      <div className="w-9/12 md:w-6/12">
        {/* A heading with responsive text sizes */}
        <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
          Meow
        </h1>
        {/* A paragraph with responsive text sizes and custom styles */}
        <p className="text-body-color dark:text-body-color-dark mb-12 text-base !leading-relaxed sm:text-lg md:text-xl">
          Accept support through Open Payments. Start a campaign. Setup a
          campaign monetary goal. It is easier than you think.
        </p>
        {/* A div to arrange buttons with specific styling */}
        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          {/* Only render the Sign Up button if the user is signed out */}
          <SignedOut>
            <Button
              className="rounded-sm px-8 py-4 text-base font-semibold"
              size="lg"
              color="primary"
            >
              Sign Up
            </Button>
          </SignedOut>
          {/* A secondary button linking to an external site */}
          <Button
            className="rounded-sm px-8 py-4 text-base font-semibold"
            size="lg"
            color="secondary"
          >
            <Link
              isExternal
              href={siteConfig.links.openPayments}
              className="text-base font-semibold text-white"
            >
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
};

// Export the Hero component as the default export
export default Hero;