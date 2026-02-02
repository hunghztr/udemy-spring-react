import { getCategoriesParent } from "@/query/category/category.query";
import { useGetAll } from "@/query/use.crud.query";
import type { ICategoryParentResponse } from "@/type/category.module";
import type { IPaginationResponse } from "@/type/pagination";
import {
  Box,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRef, useState } from "react";



export default function HomeCategoryHeader() {
  const { data, isLoading  } = useGetAll<IPaginationResponse<ICategoryParentResponse>>(
    "get-all-category-parents",
    getCategoriesParent
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const theme = useTheme();

  // refs for arrow position
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const activeIndex = data?.elements.findIndex((c) => c.id === activeId) ?? -1;
  const activeCategory = data && activeIndex >= 0 ? data.elements[activeIndex] : null;

  const arrowLeft =
    activeIndex >= 0 && itemRefs.current[activeIndex]
      ? itemRefs.current[activeIndex]!.offsetLeft +
        itemRefs.current[activeIndex]!.offsetWidth / 2
      : 0;

  return (
    <Box sx={{ position: "relative" }} onMouseLeave={() => setActiveId(null)}>
      {/* ===== TOP CATEGORY ===== */}
      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack
          direction="row"
          spacing={4}
          sx={{ px: 4, py: 1.5, alignItems: "center" }}
        >
          {/* ===== REAL DATA ===== */}
          {!isLoading &&
            data?.elements.map((c, idx) => {
              const isActive = activeId === c.id;

              return (
                <Typography
                  key={c.id}
                  component="span"
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  onMouseEnter={() => setActiveId(c.id)}
                  sx={{
                    cursor: "pointer",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive
                      ? theme.palette.primary.main
                      : "text.primary",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.name}
                </Typography>
              );
            })}
        </Stack>
      </Box>

      {/* ===== SUB CATEGORY DROPDOWN ===== */}
      {!isLoading &&
        activeCategory &&
        activeCategory.categories?.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              bgcolor: "#1c1d1f",
              color: "#fff",
              px: 4,
              py: 1.5,
              zIndex: 1200,

              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: arrowLeft,
                transform: "translate(-50%, -100%)",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: "8px solid #1c1d1f",
                transition: "left 0.15s ease",
              },
            }}
          >
            <Stack direction="row" spacing={3} flexWrap="wrap">
              {activeCategory.categories.map((sub) => (
                <Typography
                  key={sub.id}
                  sx={{
                    cursor: "pointer",
                    fontSize: 14,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {sub.name}
                </Typography>
              ))}
            </Stack>
          </Box>
        )}
    </Box>
  );
}
