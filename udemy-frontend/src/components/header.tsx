import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { persistor } from "../redux/store";
import { logOut } from "../redux/thunks/auth.thunk";
import { showToast } from "../utils/toast";

export default function Header() {
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogOut = async () =>{
    await persistor.purge();
    dispatch(logOut());
    navigate("/auth");
    showToast("Đăng xuất thành công");
  }
  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={1}
      sx={{ width: "100%" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          py: { xs: 0.5, md: 1 },
        }}
      >
        {/* LEFT */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}
        >
          {/* Logo */}
          <Link to="/">
            <Box
              component="img"
              src="/src/assets/logo-udemy.svg"
              alt="Logo"
              sx={{ height: { xs: 28, md: 40 } }}
            />
          </Link>

          {/* Explore */}
          <Button
            color="inherit"
            sx={{
              whiteSpace: "nowrap",
              display: { xs: "none", md: "inline-flex" },
              fontSize: { xs: "12px", md: "14px" },
            }}
          >
            Khám phá
          </Button>

          {/* Explore icon on mobile */}
          <IconButton
            color="inherit"
            sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            <ExploreIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>

        {/* CENTER - Search */}
        <Box
          sx={{
            flex: 1,
            mx: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* Full search on desktop */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search for anything"
            sx={{
              display: { xs: "none", md: "flex" },
              "& input": {
                fontSize: { xs: "12px", md: "14px" },
              },
              "& .MuiInputBase-root": {
                borderRadius: 10,
                backgroundColor: "#f0f2f5",
                py: { md: 0.5 },
              },
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
            }}
          />

          {/* Mobile search icon */}
          <IconButton
            color="inherit"
            sx={{
              display: { xs: "inline-flex", md: "none" },
            }}
          >
            <SearchIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>

        {/* RIGHT */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, md: 2 },
            flexShrink: 0,
            px: { xs: 0.5, md: 0 },
          }}
        >
          {/* Dạy trên Udemy */}
          <Button
            color="inherit"
            sx={{
              display: { xs: "none", md: "inline-flex" },
              fontSize: { xs: "12px", md: "14px" },
              whiteSpace: "nowrap",
            }}
          >
            Dạy trên Udemy
          </Button>

          {user.id ? (
  <Button
    variant="outlined"
    color="error"
    size="small"
    sx={{
      minWidth: { xs: 60, md: 80 },
      px: { xs: 1, md: 2 },
      fontSize: { xs: "11px", md: "14px" },
      whiteSpace: "nowrap",
    }}
    onClick={handleLogOut}
  >
    Logout
  </Button>
) : (
  <Link to="/auth">
    <Button
      variant="outlined"
      color="primary"
      size="small"
      sx={{
        minWidth: { xs: 60, md: 80 },
        px: { xs: 1, md: 2 },
        fontSize: { xs: "11px", md: "14px" },
        whiteSpace: "nowrap",
      }}
    >
      Login
    </Button>
  </Link>
)}

        </Box>
      </Toolbar>
    </AppBar>
  );
}
