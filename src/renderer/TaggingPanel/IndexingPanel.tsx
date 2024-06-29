import React from "react";
import { useFileIndexStatus } from "../FileIndexStatusProvider";
import { Card, CardContent, LinearProgress, Typography } from "@mui/material";
import { c } from "vite/dist/node/types.d-aGj9QkWt";

export interface IndexingPanelProps {}

export function IndexingPanel({}: IndexingPanelProps) {
  const { filesIndexed, total } = useFileIndexStatus();

  console.log("Progress:", (filesIndexed / total) * 100);

  return (
    <Card>
      <CardContent>
        <Typography variant="body2">Indexing...</Typography>
        {total != 0 && (
          <LinearProgress
            value={(filesIndexed / total) * 100}
            variant="determinate"
          />
        )}
      </CardContent>
    </Card>
  );
}
