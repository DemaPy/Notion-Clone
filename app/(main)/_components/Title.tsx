"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ChangeEvent, useRef, useState } from "react";

const Title = ({ initialData }: { initialData: Doc<"documents"> }) => {
  const update = useMutation(api.documents.update);
  const ref = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState<string>(initialData.title || "Untitled");
  const [isEditing, setIsEditing] = useState(false);

  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      ref.current?.focus();
      ref.current?.setSelectionRange(0, ref.current.validationMessage.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setTitle(ev.target.value);
    update({
      id: initialData._id,
      title: ev.target.value || "Untitled",
    });
  };

  const onKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          value={title}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          ref={ref}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant={"ghost"}
          size={"sm"}
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{initialData.title}</span>
        </Button>
      )}
    </div>
  );
};

export default Title;
