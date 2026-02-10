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
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

import { useGetAll, useGetById, useSave } from "@/query/use.crud.query";
import {
  deleteHistory,
  getRecommend,
  getSuggest,
} from "@/query/course/search.query";
import type { IRecommendResponse } from "@/type/course.module";
import { useDebounce } from "@/hooks/debounce.hook";

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const LIMIT = 10;
const HISTORY_LIMIT = 5;

export default function SearchInput() {
  const theme = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<string | null>(null);
  const debounce = useDebounce(inputValue, 500);

  // History (fetch khi focus)
  const {
    data: historyData,
    isLoading: isHistoryLoading,
  } = useGetAll<IRecommendResponse[]>(
    "search/history",
    getRecommend,
    open
  );

  // Trending (fetch khi gõ)
  const {
    data: trendingData,
    isLoading: isTrendingLoading,
  } = useGetById<IRecommendResponse[]>(
    "search/suggest",
    getSuggest,
    debounce,
    debounce.length > 0
  );

  const history = historyData ?? [];
  const trending = trendingData ?? [];

  /* ===================== FILTER HISTORY ===================== */

  const filteredHistory = useMemo(() => {
    const kw = debounce.trim().toLowerCase();
    if (!kw) return history.slice(0, HISTORY_LIMIT);

    return history
      .filter(h => h.keyword.toLowerCase().includes(kw))
      .slice(0, HISTORY_LIMIT);
  }, [history, debounce]);

  /* ===================== MERGE + DEDUPE ===================== */

  const mergedData = useMemo(() => {
    const seen = new Set<string>();
    const result: IRecommendResponse[] = [];

    // 1️⃣ History first
    for (const h of filteredHistory) {
      if (seen.has(h.keyword)) continue;
      seen.add(h.keyword);
      result.push(h);
    }

    // 2️⃣ Trending
    for (const t of trending) {
      if (result.length >= LIMIT) break;
      if (seen.has(t.keyword)) continue;
      seen.add(t.keyword);
      result.push(t);
    }

    return result;
  }, [filteredHistory, trending]);

  const handleSearch = (keyword?: string) => {
    const value = keyword ?? inputValue.trim();
    if (!value) return;

    setInputValue(value);
    setOpen(false);
    navigate(`/search?keyword=${encodeURIComponent(value)}`);

    // chỉ cần refresh history
    queryClient.invalidateQueries({ queryKey: ["search/history"] });
  };

  const { mutate } = useSave<boolean, string>(
    "search/remove-history",
    deleteHistory
  );

  const handleDelete = (e: React.MouseEvent, keyword: string) => {
    e.stopPropagation();
    setDeletingItem(keyword);
    mutate(keyword, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["search/history"] });
        setDeletingItem(null);
      },
      onError: () => {
        setDeletingItem(null);
      },
    });
  };
  const isLoading =
    (open && !debounce && isHistoryLoading) ||
    (debounce.length > 0 && isTrendingLoading);
  const isEmpty = !isLoading && mergedData.length === 0;

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
                <Box px={2} py={1.5} display="flex" gap={1}>
                  <CircularProgress size={16} />
                </Box>
              )}
              {/* EMPTY */}
              {isEmpty && (
                <Box px={2} py={1.5}>
                  <Typography variant="body2" color="text.secondary">
                    Không có gợi ý
                  </Typography>
                </Box>
              )}
              {/* LIST */}
              {!isLoading && (
                <AnimatePresence initial={false}>
                  {mergedData.map(item => (
                    <MotionBox
                      key={`${item.type}-${item.keyword}`}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      onClick={() => handleSearch(item.keyword)}
                      sx={{
                        px: 2,
                        py: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: theme.palette.grey[100],
                        },
                      }}
                    >
                      <Typography variant="body2">
                        {item.keyword}
                        {item.type === "TRENDING" && (
                          <Typography
                            component="span"
                            variant="caption"
                            color="primary"
                            ml={1}
                          >
                            Trending
                          </Typography>
                        )}
                      </Typography>
                      {item.type === "HISTORY" && (
                        <IconButton
                          size="small"
                          onClick={(e) => handleDelete(e, item.keyword)}
                        >
                          {deletingItem === item.keyword ? (
                            <CircularProgress size={14} />
                          ) : (
                            <CloseIcon fontSize="small" />
                          )}
                        </IconButton>
                      )}
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
