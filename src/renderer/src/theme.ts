import { PaletteOptions, createTheme } from '@mui/material'

const seafoam: PaletteOptions = {
  background: {
    default: '#c6dcd8',
    paper: '#e0f5f1'
  },
  text: {
    primary: '#294541',
    secondary: '#5c7e79'
  },
  primary: {
    main: '#30947b'
  },
  secondary: {
    main: '#a7deda'
  },
  info: {
    main: '#80b5cc'
  },
  success: {
    main: '#56d899'
  },
  warning: {
    main: '#9ac64d'
  },
  error: {
    main: '#c1867e'
  }
}

const paletteTheme = createTheme({ palette: seafoam })

export const theme = createTheme(
  {
    cssVariables: true,
    palette: seafoam,
    components: {
      MuiList: {
        styleOverrides: {
          root: {
            display: 'flex',
            flexDirection: 'column',
            gap: 5
          }
        }
      },

      MuiListItem: {
        styleOverrides: {
          root: {
            backgroundColor: '#ffffff',
            borderRadius: 10,
            border: `1px solid ${paletteTheme.palette.secondary.main}`
          }
        }
      },

      MuiButton: {
        styleOverrides: {
          sizeSmall: {
            borderRadius: 12,
            paddingLeft: 14,
            paddingRight: 14
          },
          sizeMedium: {
            borderRadius: 16,
            paddingLeft: 24,
            paddingRight: 24
          },
          sizeLarge: {
            borderRadius: 20,
            paddingLeft: 30,
            paddingRight: 30
          }
        }
      },

      MuiTab: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: '#e0f5f1'
            }
          }
        }
      }
    }
  },
  paletteTheme
)
