"use client";

import { Button, Card, Link } from "@nextui-org/react";
import { FaGithub, FaTwitter, FaSlack } from "react-icons/fa";
import { siteConfig } from "../../../config/site";

export const Footer = ({ backgroundColor }: { backgroundColor?: string }) => {
  return (
    <Card
      className={` ${backgroundColor} fixed bottom-0 flex w-full flex-row items-center justify-between rounded-none px-4 py-4 md:px-20`}
    >
      <div className="flex w-full items-center justify-start space-x-4 md:block md:w-auto">
       
      </div>
      <div className="flex w-full items-center justify-end space-x-4 md:block md:w-auto">
        <Button color="primary" size="md" variant="flat">
          Privacy Policy
        </Button>
        <Button color="primary" size="md" variant="flat">
          Terms of Service
        </Button>
      </div>
    </Card>
  );
};
