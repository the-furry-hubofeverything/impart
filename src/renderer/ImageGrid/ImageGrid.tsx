import { Stack, Typography, Button, Grid } from "@mui/material";
import React from "react";
import { ImageDisplay } from "./ImageDisplay";
import { useAsyncData } from "../common/useAsyncData";
import CreateNewFolderIcon from "@mui/icons-material/Person";

export interface ImageGridProps {}

export function ImageGrid({}: ImageGridProps) {
  const { data: files, isLoading } = useAsyncData(
    () => window.fileApi.getFiles(),
    []
  );

  if (files === undefined || isLoading) {
    return null;
  }

  if (files.length === 0) {
    return (
      <Stack justifyContent="center" alignItems="center" gap={2} height="100%">
        <Typography textAlign="center" sx={{ opacity: 0.6 }}>
          Impart hasn't found any files yet! Add a folder to start organizing
          your gallery
        </Typography>
        <Button
          startIcon={<CreateNewFolderIcon />}
          variant="contained"
          onClick={() => window.fileApi.selectAndIndexDirectory()}
        >
          Add Folder
        </Button>
      </Stack>
    );
  }

  return (
    <Grid container spacing={1}>
      {files?.map((f) => (
        <Grid item key={f} xs={true}>
          <ImageDisplay fileName={f} />
        </Grid>
      ))}
    </Grid>
  );
}
