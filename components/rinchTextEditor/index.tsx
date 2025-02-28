"use client";
import React, { useMemo, useRef } from "react";
import { fileUploadAws } from "@/services/service/generalService";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
type ImageHandlerProps = {
  onUpload?: (file: File) => Promise<string>;
  content: string;
  setContent: (x: string) => void;
};

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});
const RinchTextEditor: React.FC<ImageHandlerProps> = ({
  content,
  setContent,
}) => {
  const editor = useRef<any>(null);
  const t = useTranslations("pages");
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: t("rinch-text-editor-placeholder"),
      extraButtons: [
        {
          name: "uploadToAws",
          iconURL: "/upload-icon.svg",
          tooltip: "Upload Image to AWS",
          exec: async (editor: any) => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async (event: any) => {
              const file = event.target.files[0];
              const formData = new FormData();
              formData.append("file", file);
              if (file) {
                try {
                  const imageUrl = await fileUploadAws(formData, "upload");
                  editor.selection.insertImage(imageUrl.data.url);
                } catch (error) {}
              }
            };
            input.click();
          },
        },
      ],
    }),
    []
  );

  return (
    <div>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={(newContent) => setContent(newContent)}
        onChange={(newContent) => {setContent(newContent)}}
      />
    </div>
  );
};

export default RinchTextEditor;
