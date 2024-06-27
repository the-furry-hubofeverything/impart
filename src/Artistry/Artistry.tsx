import React, { useEffect, useState } from "react";
import { fileApi } from "./fileApi";

export interface ArtistryProps {}

export function Artistry({}: ArtistryProps) {
  const [files, setFiles] = useState<string[]>();

  useEffect(() => {
    (async () => {
      const f = await fileApi.getFiles();
      setFiles(f);
    })();
  }, []);

  return <div>Hello World! Here are your files: {files?.join(", ")}</div>;
}
