"use client";
import React, { useMemo, useRef } from "react";
import JoditEditor from "jodit-react";
import { fileUploadAws } from "@/services/service/generalService";
type ImageHandlerProps = {
  onUpload?: (file: File) => Promise<string>;
  content: string;
  setContent: (x: string) => void;
};

const RinchTextEditor: React.FC<ImageHandlerProps> = ({
  content,
  setContent,
}) => {
  const editor = useRef<any>(null);
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typings...",
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
                } catch (error) {
                  console.error("Image upload failed", error);
                }
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
        onChange={(newContent) => {}}
      />
    </div>
  );
};

export default RinchTextEditor;
