import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { appBarSx, navEndSx } from "./navbar.sx";

export function Navbar() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar position="static" sx={appBarSx}>
      <Toolbar>
        <Box sx={navEndSx}>
          <Button
            color="inherit"
            data-testid="navbar-account-btn"
            onClick={() => navigate("/")}
          >
            Account
          </Button>
          <Button color="inherit" data-testid="navbar-aboutus-btn">
            About Us
          </Button>
          {user && (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                data-testid="navbar-user-menu-btn"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  data-testid="navbar-profile-item"
                  onClick={handleClose}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  data-testid="navbar-logout-item"
                  onClick={handleClose}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
