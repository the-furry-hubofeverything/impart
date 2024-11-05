import { Tooltip, ToggleButton } from '@mui/material'
import { StyledToggleButtonGroup } from './StyledToggleButtonGroup'
import SortByAlphaIcon from '@mui/icons-material/SortByAlphaRounded'
import ClockIcon from '@mui/icons-material/AccessTimeRounded'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'

export interface SortButtonsProps {}

export function SortButtons({}: SortButtonsProps) {
  const {
    fetchOptions: { order },
    setFetchOptions
  } = useTaggables()

  return (
    <StyledToggleButtonGroup
      value={order}
      size="small"
      exclusive
      onChange={(e, value) => {
        if (value) {
          setFetchOptions({ order: value })
        }
      }}
    >
      <Tooltip title="Sort Alphabetically">
        <ToggleButton value={'alpha'}>
          <SortByAlphaIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Sort by Last Modified">
        <ToggleButton value={'date'}>
          <ClockIcon />
        </ToggleButton>
      </Tooltip>
    </StyledToggleButtonGroup>
  )
}
