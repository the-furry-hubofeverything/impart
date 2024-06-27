import React, { useEffect, useState } from "react";

export interface ArtistryProps {}

export function Artistry({}: ArtistryProps) {
  const [imageData, setImageData] = useState<string>();

  useEffect(() => {
    (async () => {
      const f = await window.fileApi.getImage();
      setImageData(f);
    })();
  }, []);

  return (
    <div>
      <div>Hello World!</div>
      <div>Check out this cool image</div>
      {imageData && <img src={`data:image/png;base64,${imageData}`} />}
    </div>
  );
}
