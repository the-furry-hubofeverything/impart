import { Box, Skeleton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAsyncData } from "./common/useAsyncData";

export interface ImageDisplayProps {
  fileName: string;
}

export function ImageDisplay({ fileName }: ImageDisplayProps) {
  const { data: image, isLoading } = useAsyncData(
    () => window.imageApi.getImage(fileName),
    []
  );

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      height="100%"
      width={250}
    >
      {isLoading && <Skeleton width={200} height={200} variant="rounded" />}
      {!isLoading && (
        <Box
          component="img"
          src={`data:image/png;base64,${image?.data}`}
          borderRadius={2}
          maxWidth={240}
          maxHeight={200}
        />
      )}
      <Box maxWidth={image?.width}>
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
