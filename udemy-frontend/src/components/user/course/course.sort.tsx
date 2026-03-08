import {
  Box,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import { useState } from "react";

interface Props {
  onChange?: (value: string) => void;
}

const sortOptions = [
  { value: "ratingDesc", label: "Đánh giá: cao - thấp" },
  { value: "ratingAsc", label: "Đánh giá: thấp - cao" },

  { value: "priceDesc", label: "Giá: cao - thấp" },
  { value: "priceAsc", label: "Giá: thấp - cao" },

  { value: "durationDesc", label: "Thời lượng: dài - ngắn" },
  { value: "durationAsc", label: "Thời lượng: ngắn - dài" },
];
export default function CourseSort({ onChange }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sort, setSort] = useState("ratingDesc");

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value: string) => {
    setSort(value);
    onChange?.(value);
    handleClose();
  };

  const getLabel = () => {
    return sortOptions.find(o => o.value === sort)?.label ?? "";
  };

  return (
    <Box>
      <Chip
        icon={<SortIcon />}
        label={`Sắp xếp: ${getLabel()}`}
        onClick={handleOpen}
        sx={{
          px: 1.5,
          py: 2.5,
          fontWeight: 600,
          borderRadius: 999,
          border: "1px solid",
          borderColor: "divider",
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {sortOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={sort === option.value}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}