"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { useEdgeStore } from "@/lib/edgestore";

type TEditor = {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};

const Editor = ({ onChange, editable, initialContent }: TEditor) => {
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ file });

    return response.url;
  };
  const editor: BlockNoteEditor = useBlockNote({
    editable,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: handleUpload,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
  });

  return (
    <div>
      <BlockNoteView editor={editor}></BlockNoteView>
    </div>
  );
};

export default Editor;
