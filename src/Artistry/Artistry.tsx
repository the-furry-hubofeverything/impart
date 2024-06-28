import React, { useEffect, useState } from "react";
import { ImageDisplay } from "./ImageDisplay";
import { Box, Button, Grid, ThemeProvider } from "@mui/material";
import { theme } from "./theme";

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
    <ThemeProvider theme={theme}>
      <Grid container spacing={1} p={2}>
        {files?.map((f) => (
          <Grid item key={f}>
            <ImageDisplay fileName={f} />
          </Grid>
        ))}
      </Grid>
    </ThemeProvider>
  );
}
