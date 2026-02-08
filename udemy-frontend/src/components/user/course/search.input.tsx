import {
  Box,
  IconButton,
  TextField,
  useTheme,
  Paper,
  Typography,
  ClickAwayListener,
  CircularProgress,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAll, useSave } from "@/query/use.crud.query";
import { deleteHistory, getHistory } from "@/query/course/search.query";

import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

export default function SearchInput() {
  const theme = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<string | null>(null);

  // fetch history khi open
  const { data, isLoading } = useGetAll<string[]>(
    "search/history",
    getHistory,
    open
  );

  const { mutate } = useSave<boolean, string>(
    "search/remove-history",
    deleteHistory
  );

  const handleSearch = (keyword?: string) => {
    const value = keyword ?? inputValue.trim();
    if (!value) return;

    setInputValue(value);
    setOpen(false);
    navigate(`/search?keyword=${encodeURIComponent(value)}`);
  };

  const handleDelete = (e: React.MouseEvent, keyword: string) => {
    e.stopPropagation();
    setDeletingItem(keyword);
    mutate(keyword,{
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["search/history"] });
        setDeletingItem(null);
      },
      onError: () => {
        setDeletingItem(null);
      },
    });
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: "relative", flex: 1, mx: 2 }}>
        {/* ================= SEARCH BAR ================= */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1,
            borderRadius: 10,
            backgroundColor: theme.palette.grey[100],
            transition: "all .2s ease",
            "&:hover": { backgroundColor: theme.palette.grey[200] },
            "&:focus-within": {
              backgroundColor: theme.palette.background.paper,
              boxShadow: `0 0 0 2px ${alpha(
                theme.palette.primary.main,
                0.25
              )}`,
            },
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search for anything"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            InputProps={{ disableUnderline: true }}
          />

          <IconButton onClick={() => handleSearch()}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* ================= DROPDOWN ================= */}
        <AnimatePresence>
          {open && (
            <MotionPaper
              elevation={4}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 1,
                borderRadius: 2,
                overflow: "hidden",
                zIndex: 10,
              }}
            >
              {/* LOADING */}
              {isLoading && (
                <Box px={2} py={1.5}>
                  <Typography variant="body2">...</Typography>
                </Box>
              )}

              {/* EMPTY */}
              {!isLoading && (!data || data.length === 0) && (
                <Box px={2} py={1.5}>
                  <Typography variant="body2" color="text.secondary">
                    Không có lịch sử tìm kiếm
                  </Typography>
                </Box>
              )}

              {/* LIST */}
              {!isLoading && (
                <AnimatePresence initial={false}>
                  {data?.map((item) => (
                    <MotionBox
                      key={item}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      onClick={() => handleSearch(item)}
                      sx={{
                        px: 2,
                        py: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        overflow: "hidden",
                        "&:hover": {
                          backgroundColor: theme.palette.grey[100],
                        },
                      }}
                    >
                      <Typography variant="body2">{item}</Typography>

                      <IconButton
                        size="small"
                        onClick={(e) => handleDelete(e, item)}
                      >
                        {deletingItem === item ? (
                          <CircularProgress size={14} />
                        ) : (
                          <CloseIcon fontSize="small" />
                        )}
                      </IconButton>
                    </MotionBox>
                  ))}
                </AnimatePresence>
              )}

            </MotionPaper>
          )}
        </AnimatePresence>
      </Box>
    </ClickAwayListener>
  );
}
