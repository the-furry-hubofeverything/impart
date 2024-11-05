import { PaletteOptions, createTheme } from '@mui/material'
import NunitoSans from './fonts/NunitoSans.ttf'
import NunitoSansItalic from './fonts/NunitoSans-Italic.ttf'
import Mallanna from './fonts/Mallanna-Regular.ttf'

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
    //For some reason, this isn't working, so I guess I just have to
    // manually apply it to everything??
    // typography: {
    //   fontFamily: 'NunitoSans, Arial, sans-serif'
    // },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'NunitoSans';
            src: url(${NunitoSans});
          }

          @font-face {
            font-family: 'NunitoSans';
            font-style: italic;
            src: url(${NunitoSansItalic});
          }

          @font-face {
            font-family: 'Mallanna';
            src: url(${Mallanna});
          }
        `
      },

      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: 'NunitoSans, Arial, sans-serif'
          },
          sizeMedium: {
            borderRadius: 12,
            height: 28
          },
          labelMedium: {
            paddingLeft: 10,
            paddingRight: 10
          },
          sizeSmall: {
            borderRadius: 8,
            height: 22
          },
          labelSmall: {
            paddingLeft: 8,
            paddingRight: 8
          }
        }
      },

      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: 'NunitoSans, Arial, sans-serif'
          },
          caption: {
            fontFamily: 'Mallanna, Courier, monospace'
          },
          h5: {
            fontSize: 22
          }
        }
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            fontFamily: 'NunitoSans, Arial, sans-serif'
          }
        }
      },

      MuiTextField: {
        styleOverrides: {
          root: {
            '& label': {
              fontFamily: 'NunitoSans, Arial, sans-serif'
            }
          }
        }
      },

      MuiTabs: {
        styleOverrides: {
          root: {
            fontFamily: 'NunitoSans, Arial, sans-serif'
          }
        }
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8
          }
        }
      },

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
          root: {
            fontFamily: 'NunitoSans, Arial, sans-serif'
          },
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
            fontFamily: 'NunitoSans, Arial, sans-serif',
            '&.Mui-selected': {
              backgroundColor: '#e0f5f1'
            }
          }
        }
      },

      MuiListSubheader: {
        styleOverrides: {
          root: {
            fontFamily: 'NunitoSans, Arial, sans-serif',
            paddingLeft: 4,
            paddingRight: 4,
            borderRadius: 8,
            backgroundColor: paletteTheme.palette.primary.light,
            color: paletteTheme.palette.primary.contrastText,
            marginLeft: 6,
            marginRight: 6,
            height: 24,
            lineHeight: '26px'
          }
        }
      }
    }
  },
  paletteTheme
)
