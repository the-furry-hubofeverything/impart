import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

export interface ImageDisplayProps {
  fileName: string;
}

export function ImageDisplay({ fileName }: ImageDisplayProps) {
  const [image, setImage] = useState<ImageResult>();

  useEffect(() => {
    (async () => {
      const d = await window.fileApi.getImage(fileName);
      setImage(d);
    })();
  }, [fileName]);

  if (!image || !fileName.endsWith("png")) {
    return null;
  }

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      height="100%"
      width={250}
    >
      <Box
        component="img"
        src={`data:image/png;base64,${image.data}`}
        borderRadius={2}
        mb={0.5}
        maxWidth={240}
        maxHeight={200}
      />
      <Box maxWidth={image.width}>
        <Typography
          textAlign="center"
          variant="caption"
          sx={{ wordBreak: "break-all" }}
        >
          {fileName}
        </Typography>
      </Box>
    </Stack>
  );
}
