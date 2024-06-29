import React, { useEffect, useState } from "react";
import { ImageDisplay } from "./ImageDisplay";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { theme } from "./theme";

export interface ImpartProps {}

export function Impart({}: ImpartProps) {
  const [files, setFiles] = useState<string[]>();

  useEffect(() => {
    (async () => {
      const f = await window.fileApi.getFiles();
      setFiles(f);
    })();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Stack direction="row" p={2} gap={2} height="calc(100vh - 40px)">
        <Box flex={1} overflow="auto">
          <Grid container spacing={1}>
            {files?.map((f) => (
              <Grid item key={f} xs={true}>
                <ImageDisplay fileName={f} />
              </Grid>
            ))}
          </Grid>
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
