"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

const DocumentsPage = () => {
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  const handleCreate = () => {
    const promise = create({
      title: "Untitled",
    })

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create new note."
    })
  }
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image src={"/empty.png"} height={300} width={300} alt="Empty" />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos; Jotion
      </h2>
      <Button onClick={handleCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPage;
