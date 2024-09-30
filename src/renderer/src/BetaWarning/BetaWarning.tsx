import { Box, Button, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material'
import React from 'react'
import betaImage from './beta.png'
import ThumbsUpIcon from '@mui/icons-material/ThumbUp'

export interface BetaWarningProps {
  onClose?: () => void
}

export function BetaWarning({ onClose }: BetaWarningProps) {
  return (
    <Stack width="100vw" height="100vh" alignItems="center" justifyContent="center">
      <Card elevation={8}>
        <CardContent>
          <Stack direction="row" gap={2}>
            <Box>
              <Box component="img" src={betaImage} alt="Beta Warning" width={540} />
            </Box>
            <Stack py={4} pr={5} gap={2} maxWidth={620}>
              <Typography variant="h3">Under Construction!</Typography>
              <Typography>
                Thanks for participating in the Impart beta! While Impart is technically feature
                complete, it is still missing a number of quality of life features and is still
                under active development. If you notice any bugs or have any general feature ideas,
                please contact Arastryx!
              </Typography>
              <Box>
                <Typography>Before you get started, two important notes:</Typography>
                <ul>
                  <Typography component="li">
                    <Typography component="span" fontWeight={'bold'} fontSize={18}>
                      A future update will reset your app
                    </Typography>{' '}
                    (approximately Oct/Nov 2024). Feel free to try things out, but keep in mind that
                    you will need to start over when the app releases.
                  </Typography>
                  <Typography component="li">
                    <Typography component="span" fontWeight={'bold'} fontSize={18}>
                      Auto-updating is <i>not</i> implemented.
                    </Typography>{' '}
                    If you'd like to try the latest version of the app, you can find it over at the{' '}
                    <a href="https://github.com/Arastryx/impart/releases" target="_blank">
                      Impart Releases
                    </a>
                    !
                  </Typography>
                </ul>
              </Box>
              <Box alignSelf="flex-end">
                <Button startIcon={<ThumbsUpIcon />} variant="contained" onClick={onClose}>
                  I understand
                </Button>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
