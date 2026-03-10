import { slugify } from "@/helpers/slugify";
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

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

export default function HomeCategoryHeader() {

  const { data, isLoading } =
    useGetAll<IPaginationResponse<ICategoryParentResponse>>(
      "get-all-category-parents",
      getCategoriesParent
    );

  const [activeId, setActiveId] = useState<string | null>(null);

  const theme = useTheme();
  const navigate = useNavigate();

  const activeCategory = data?.elements.find(
    (c) => c.id === activeId
  );

  const handleClick = (id: string, name: string) => {
    const slug = slugify(name);
    navigate(`/category/${slug}-${id}.html`);
  };

  return (
    <Box
      sx={{ position: "relative" }}
      onMouseLeave={() => setActiveId(null)}
    >

      {/* ===== CATEGORY CHA ===== */}
      <Box
        sx={{
          width: 220,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >

        {!isLoading &&
          data?.elements.map((c) => {

            const isActive = activeId === c.id;

            return (
              <Box
                key={c.id}
                onMouseEnter={() => setActiveId(c.id)}
                onClick={() => handleClick(c.id, c.name)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",

                  px: 3,
                  py: 1.6,

                  cursor: "pointer",

                  "&:hover": {
                    bgcolor: "#f7f9fa",
                  },
                }}
              >

                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: isActive
                      ? theme.palette.primary.main
                      : "text.primary",
                  }}
                >
                  {c.name}
                </Typography>

                <ChevronRightIcon
                  sx={{
                    fontSize: 18,
                    color: "text.secondary",
                  }}
                />

              </Box>
            );
          })}

      </Box>

      {/* ===== CATEGORY CON ===== */}
      <AnimatePresence>

        {activeCategory &&
          activeCategory.categories?.length > 0 && (

            <Box
              component={motion.div}
              key={activeCategory.id}

              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}

              transition={{ duration: 0.2 }}

              sx={{
                position: "absolute",
                top: 0,
                left: "100%",

                width: 260,

                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: "0 8px 20px rgba(0,0,0,0.18)",

                p: 2,
              }}
            >

              <Stack spacing={1}>

                {activeCategory.categories.map((sub) => (
                  <Typography
                    key={sub.id}
                    onClick={() =>
                      handleClick(sub.id, sub.name)
                    }
                    sx={{
                      cursor: "pointer",
                      fontSize: 14,

                      "&:hover": {
                        color: "primary.main",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {sub.name}
                  </Typography>
                ))}

              </Stack>

            </Box>

          )}

      </AnimatePresence>

    </Box>
  );
}