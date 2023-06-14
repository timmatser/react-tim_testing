import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
    disabledLink?: boolean;
}

export default function LogoSecondary({ disabledLink = false, sx }: Props) {
    const theme = useTheme();

    const PRIMARY_LIGHT = theme.palette.primary.light;

    const PRIMARY_MAIN = theme.palette.primary.main;

    // const PRIMARY_DARK = theme.palette.primary.dark;

    // OR
    // const logo = '/logo/logo_single.svg';

    const logo = (<Box sx={{ width: 110, height: 29, ...sx }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="91.181" height="91.067" viewBox="0 0 91.181 91.067">
            <g id="Component_2_1" data-name="Component 2 – 1" transform="translate(3 3)">
                <g id="Group_389" data-name="Group 389">
                    <path id="Path_85" data-name="Path 85"
                          d="M84.792,6h-72.4A6.384,6.384,0,0,0,6,12.38V84.687a6.384,6.384,0,0,0,6.389,6.38h72.4a6.384,6.384,0,0,0,6.389-6.38V12.38A6.384,6.384,0,0,0,84.792,6Z"
                          transform="translate(-6 -6)" fill="none" stroke={PRIMARY_MAIN} strokeWidth="6"/>
                    <path id="Path_86" data-name="Path 86" d="M27.3,6V91.067M91.181,31.993H6"
                          transform="translate(-6 -6)" fill="none" stroke={PRIMARY_MAIN} strokeLinecap="round"
                          strokeWidth="6"/>
                </g>
                <line id="Line_32" data-name="Line 32" y2="84.424" transform="translate(21.311 1.021)" fill="none"
                      stroke={PRIMARY_LIGHT} strokeWidth="6"/>
                <line id="Line_33" data-name="Line 33" x2="80.228" transform="translate(2.38 25.816)" fill="none"
                      stroke={PRIMARY_LIGHT} strokeWidth="6"/>
            </g>
        </svg>

    </Box>);

    if (disabledLink) {
        return <>{logo}</>;
    }

    return <RouterLink to="/">{logo}</RouterLink>;
}
