import React, { useEffect, useState } from "react";
import { ImageDisplay } from "./ImageDisplay";
import {
  Box,
  Button,
  Card,
  CardContent,
  CssBaseline,
  Grid,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { theme } from "./theme";
import { useAsyncData } from "./common/useAsyncData";
import CreateNewFolderIcon from "@mui/icons-material/Person";

export interface ImpartProps {}

export function Impart({}: ImpartProps) {
  const { data: files } = useAsyncData(() => window.fileApi.getFiles(), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack direction="row" p={2} gap={2} height="100vh">
        <Box flex={1} overflow="auto">
          {files && files.length === 0 && (
            <Stack
              justifyContent="center"
              alignItems="center"
              gap={2}
              height="100%"
            >
              <Typography textAlign="center" sx={{ opacity: 0.6 }}>
                Impart hasn't found any files yet! Add a folder to start
                organizing your gallery
              </Typography>
              <Button
                startIcon={<CreateNewFolderIcon />}
                variant="contained"
                onClick={() => window.fileApi.indexDirectory()}
              >
                Add Folder
              </Button>
            </Stack>
          )}
          {files && files.length > 0 && (
            <Grid container spacing={1}>
              {files?.map((f) => (
                <Grid item key={f} xs={true}>
                  <ImageDisplay fileName={f} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
        <Card>
          <CardContent>
            <Box width={300}>
              <Typography>Content goes here</Typography>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </ThemeProvider>
  );
}
