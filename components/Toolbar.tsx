"use client";

import { Doc } from "@/convex/_generated/dataModel";
import IconPicker from "./IconPicker";
import { Button } from "./ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextAreaAutoSize from "react-textarea-autosize";

const Toolbar = ({
  initData,
  preview,
}: {
  initData: Doc<"documents">;
  preview?: boolean;
}) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState(initData.title);

  const update = useMutation(api.documents.update);

  const enableInput = () => {
    if (preview) return;

    setIsEdit(true);
    setTimeout(() => {
      setValue(initData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEdit(false);

  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initData._id,
      title: value || "Untitled",
    });
  };

  const onKeyDown = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      disableInput();
    }
  };

  return (
    <div className="pl-[54px] group relative">
      {!!initData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={() => {}}>
            <p className="text-6xl hover:opacity-75 transition">
              {initData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={() => {}}
            className="rounded-full opacity-0 group-hover/icon:opacity-0 transition text-muted-foreground text-xs"
            variant={"outline"}
            size={"icon"}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initData.icon && preview && (
        <p className="text-6xl pt-6">{initData.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initData.icon && !preview && (
          <IconPicker asChild onChange={() => {}}>
            <Button
              size={"sm"}
              className="text-muted-foreground text-xs"
              variant={"outline"}
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initData.coverImage && !preview && (
          <Button
            className="text-muted-foreground text-xs"
            size={"sm"}
            variant={"outline"}
            onClick={() => {}}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>

      {isEdit && !preview ? (
        <TextAreaAutoSize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] resize-none"
        />
      ) : (
        <div
          className="pb-[12px] text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f]"
          onClick={enableInput}
        >
          {initData.title}
        </div>
      )}
    </div>
  );
};

export default Toolbar;
