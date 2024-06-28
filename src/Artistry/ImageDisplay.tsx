import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

export interface ImageDisplayProps {
  fileName: string;
}

export function ImageDisplay({ fileName }: ImageDisplayProps) {
  const [imageData, setImageData] = useState<string>();

  useEffect(() => {
    (async () => {
      const f = await window.fileApi.getImage(fileName);
      setImageData(f);
    })();
  }, [fileName]);

  if (!imageData || !fileName.endsWith("png")) {
    return null;
  }

  return (
    <Stack alignItems="center">
      <Typography textAlign="center" variant="caption">
        {fileName}
      </Typography>
      <img src={`data:image/png;base64,${imageData}`} />
    </Stack>
  );
}
