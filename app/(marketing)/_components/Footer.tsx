import React from "react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <div className="flex items-center p-6 bg-background z-50 w-full">
      <Logo />
      <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2">
        <Button variant={"ghost"} size={"sm"}>
          Privacy policy
        </Button>
        <Button variant={"ghost"} size={"sm"}>
          Terms & conditions
        </Button>
      </div>
    </div>
  );
};

export default Footer;
