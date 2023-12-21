"use client";

import { useEffect, useState } from "react";

import SettingsModal from "@/components/SettingsModal";
import CoverImageModal from "../CoverImageModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CoverImageModal />
      <SettingsModal />
    </>
  );
};

export default ModalProvider;
