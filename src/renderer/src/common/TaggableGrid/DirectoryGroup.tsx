import { useState } from 'react'
import { CommonTaggableGridProps, TaggableGrid } from './TaggableGrid'
import { Box, Card, ButtonBase, CardHeader, Collapse } from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export interface DirectoryGroupProps extends CommonTaggableGridProps {
  directory: string
}

export function DirectoryGroup({ directory, ...taggableGridProps }: DirectoryGroupProps) {
  const [showTaggables, setShowTaggables] = useState(true)

  return (
    <Box>
      <Box position="sticky" top={80} onClick={() => setShowTaggables(!showTaggables)}>
        <Card
          sx={{
            mx: 1,
            cursor: 'pointer',
            transition: '0.2s',
            opacity: 0.9,
            '&:hover': { opacity: 1 }
          }}
        >
          <ButtonBase sx={{ width: '100%' }}>
            <CardHeader
              title={directory}
              action={
                <Box p={1} lineHeight={1}>
                  {showTaggables ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
              }
              sx={{ p: 1, flex: 1, '& .MuiCardHeader-content': { textAlign: 'left' } }}
            />
          </ButtonBase>
        </Card>
      </Box>
      <Collapse in={showTaggables}>
        <TaggableGrid {...taggableGridProps} />
      </Collapse>
    </Box>
  )
}
