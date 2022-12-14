import * as React from 'react';
import { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SquareImg from '~/components/atoms/Img';
import { Link } from 'react-router-dom';
import { shadowCssForMUI } from '~/others/cssLibrary';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import {
  accessTokenState,
  handlePutProfile,
  handleRefreshAccountAccessToken,
  handleRefreshProfileAccessToken,
  RootState,
} from '~/others/store';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import myAxios from '~/others/myAxios';

interface HeaderProps {
  isReadyForRequestAPI: boolean;
  accessToken: accessTokenState;
}

const Header: React.FC<HeaderProps> = ({ isReadyForRequestAPI, accessToken }) => {
  const { accountAccessToken, profileAccessToken } = accessToken;
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorElHelpCall, setAnchorElHelpCall] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  // const handleOpenHelpCallModal = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorElHelpCall(event.currentTarget);
  // };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseHelpCallModal = () => {
    setAnchorElHelpCall(null);
  };

  const handleLogOutAndRedirect = async () => {
    handleCloseUserMenu();

    await myAxios('get', `api/v1/auth/accounts/logout`, null, true, accountAccessToken);
    handleRefreshAccountAccessToken('');
    handleRefreshProfileAccessToken('');
  };

  const getProfile = async () => {
    const res = await myAxios('get', `api/v1/profiles/me`, null, true, profileAccessToken);
    const { id, name, lineName, houseName } = res.data.response;
    handlePutProfile({
      id,
      name,
      lineName,
      houseName,
    });
  };

  useEffect(() => {
    if (profileAccessToken === '') return;
    getProfile();
  }, [profileAccessToken]);

  return (
    <AppBar position='fixed' sx={{ height: '70px' }}>
      <Container
        maxWidth='xl'
        sx={{
          height: '100%',
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            height: '100%',
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant='h6'
            noWrap
            component={Link}
            to='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              alignItems: 'center',
            }}
          >
            <SquareImg src='../../../public/img/iconWhite.png' />
            ???????????? ?????????
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  component={Link}
                  to={page.link}
                >
                  <Typography textAlign='center'>{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant='h5'
            noWrap
            component={Link}
            to='/'
            sx={{
              display: { xs: 'flex', md: 'none' },
              position: 'absolute',
              left: 'calc(50% - 105px)',
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              alignItems: 'center',
            }}
          >
            <SquareImg src='../../../public/img/iconWhite.png' />
            ???????????? ?????????
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
                component={Link}
                to={page.link}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {isReadyForRequestAPI &&
            (accountAccessToken === '' ? (
              <Button onClick={() => navigate('/sign')} variant='outlined' color='inherit'>
                ?????????
              </Button>
            ) : (
              <>
                {/* <Box
                  sx={{
                    display: {
                      xs: 'none',
                      sm: 'flex',
                    },
                    '& .helpCallBtn:hover': {
                      background: '#fff',
                    },
                    '& .helpListBtn:hover': {
                      background: '#ff1000',
                      zIndex: 2,
                    },
                  }}
                >
                  <IconButton
                    onClick={handleHelpSideBar}
                    className='helpListBtn'
                    sx={{
                      position: 'relative',
                      left: '-15px',
                      background: '#f11000',
                      color: '#fff',
                      width: '40px',
                      height: '40px',
                    }}
                  >
                    +3
                  </IconButton>
                </Box> */}

                <Menu
                  anchorEl={anchorElHelpCall}
                  open={Boolean(anchorElHelpCall)}
                  onClose={handleCloseHelpCallModal}
                  sx={{
                    mt: '10px',
                    '& ul': {
                      padding: 0,
                    },
                  }}
                >
                  <Box sx={{ width: '320px', height: '130px', ...shadowCssForMUI }}>
                    <Typography
                      sx={{
                        display: 'flex',
                        fontSize: '15px',
                        lineHeight: '28px',
                        height: '85px',
                        alignItems: 'center',
                        paddingLeft: '20px',
                      }}
                    >
                      ?????? ?????? ??? ?????? ??? ???????????????
                      <br /> ?????? ????????? ????????????.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                      <Button
                        variant='outlined'
                        color='inherit'
                        sx={{ height: '32px' }}
                        startIcon={<ArrowBack />}
                      >
                        ????????????
                      </Button>
                      <Button
                        variant='contained'
                        color='error'
                        sx={{ height: '32px' }}
                        endIcon={<ArrowForward />}
                      >
                        ?????? ??? ?????? ??????
                      </Button>
                    </Box>
                  </Box>
                </Menu>

                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title='Open settings'>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar>??????</Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id='menu-appbar'
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {/* <MenuItem
                      onClick={() => {
                        handleHelpSideBar();
                        handleCloseUserMenu();
                      }}
                    >
                      <Typography textAlign='center'>?????? ?????????</Typography>
                    </MenuItem> */}
                    <MenuItem onClick={handleLogOutAndRedirect}>
                      <Typography textAlign='center'>????????????</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </>
            ))}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const pages: {
  name: string;
  link: string;
}[] = [
  {
    name: '??????',
    link: '/notice',
  },
  {
    name: '??????',
    link: 'complaint',
  },
  {
    name: '????????????',
    link: 'community',
  },
];

const mapStateToProps = (state: RootState) => {
  return {
    isReadyForRequestAPI: state.readyForRequestAPIReducer,
    accessToken: state.accessTokenReducer,
  };
};

export default connect(mapStateToProps)(Header);
