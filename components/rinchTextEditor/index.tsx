"use client";
import React, { useEffect, useRef } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill, { Quill } from "react-quill";

type ImageHandlerProps = {
  onUpload?: (file: File) => Promise<string>;
};


const Image = Quill.import('formats/image');
Image.className = 'custom-class-to-image';
Quill.register(Image, true);

const RinchTextEditor: React.FC<ImageHandlerProps> = () => {
  const quillRef = useRef<ReactQuill | null>(null);
  const uploadToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    const data = await response.json();
    return data.imageUrl; // Sunucudan dönen görüntü URL'si
  };
  // Görüntü yükleme fonksiyonu
  const handleImageUpload = async () => {
    debugger;
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      debugger;
      const file = input.files ? input.files[0] : null;
      if (file) {
        // Dosya sunucuya yüklenir
        // const imageUrl = uploadToServer(file);
        const quill = quillRef.current?.getEditor();
        const range = quill?.getSelection();

        // Yüklenen görüntü URL'si editöre eklenir
        if (range) {
          quill?.insertEmbed(0, 'image', 'https://i.picsum.photos/id/211/200/300.jpg')
          quill?.insertEmbed(range.index, "image", 'https://i.picsum.photos/id/211/200/300.jpg');
        }
      }
    };
  };

  useEffect(() => {
    // Quill'e görüntü yükleme butonu ekleme
    const toolbar = quillRef.current?.getEditor()?.getModule("toolbar");
    toolbar?.addHandler("image", handleImageUpload);
  }, []);

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }],
            [{ font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            ["image"],
          ],
        }}
      />
    </div>
  );
};

export default RinchTextEditor;
