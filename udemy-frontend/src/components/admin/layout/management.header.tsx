import React from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  TextField,
  Box,
} from "@mui/material";

export default function ManagementHeader({
  active,
  handleToggle,
  setOpenCreate,
  keyword,
  setKeyword,
  title
}: {
  active: boolean;
  handleToggle: (
    event: React.MouseEvent<HTMLElement>,
    newValue: boolean | null
  ) => void;
  setOpenCreate?: React.Dispatch<React.SetStateAction<boolean>>;
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  title: string;
}) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", md: "center" }}
      mb={2}
      gap={1.5}
    >
      {/* ===== Title ===== */}
      <Typography variant="h5" fontWeight="bold">
        {title}
      </Typography>

      {/* ===== Actions ===== */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        flexWrap="wrap"
        justifyContent="flex-end"
      >
        {/* 🔍 Search (co giãn) */}
        <Box sx={{ minWidth: 180, flexGrow: 1 }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            fullWidth
          />
        </Box>

        {/* Toggle Active */}
        <ToggleButtonGroup
          size="small"
          value={active}
          exclusive
          onChange={handleToggle}
          sx={{ whiteSpace: "nowrap" }}
        >
          <ToggleButton value={true}>Đang kích hoạt</ToggleButton>
          <ToggleButton value={false} color="warning">
            Chưa kích hoạt
          </ToggleButton>
        </ToggleButtonGroup>

        {/* ➕ Add */}
        {
          setOpenCreate && (
            <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate?.(true)}
          sx={{ whiteSpace: "nowrap" }}
        >
          Thêm mới
        </Button>
          )
        }
        
      </Stack>
    </Stack>
  );
}
