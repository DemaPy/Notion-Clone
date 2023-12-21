"use client";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import Toolbar from "@/components/Toolbar";
import Cover from "@/app/(main)/_components/Cover";
import Editor from "@/app/(main)/_components/Editor";
import { useMemo } from "react";
import dynamic from "next/dynamic";

type TDocPage = {
  params: {
    documentId: Id<"documents">;
  };
};

const DocPage = ({ params: { documentId } }: TDocPage) => {
  // const Editor = useMemo(
  //   () => dynamic(() => import("../../../_components/Editor"), { ssr: false }),
  //   []
  // );

  const document = useQuery(api.documents.getById, {
    documentId: documentId,
  });

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    update({
      id: documentId,
      content,
    });
  };

  if (document === undefined) {
    return <div>Loading...</div>;
  }

  if (document === null) {
    return <div>Not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl md:px-6 lg:max-w-4xl mx-auto">
        <Toolbar preview initData={document} />
        <Editor editable={false} onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
};

export default DocPage;
