import React, { useEffect, useState } from "react";
import { ImageDisplay } from "./ImageDisplay";

export interface ArtistryProps {}

export function Artistry({}: ArtistryProps) {
  const [files, setFiles] = useState<string[]>();

  useEffect(() => {
    (async () => {
      const f = await window.fileApi.getFiles();
      setFiles(f);
    })();
  }, []);

  return (
    <div>
      <div>Hello World!</div>
      <div>Check out these cool images</div>
      {files?.map((f) => (
        <ImageDisplay key={f} fileName={f} />
      ))}
    </div>
  );
}
