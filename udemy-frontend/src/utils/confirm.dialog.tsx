import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useTheme } from "@mui/material/styles";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = "Xác nhận",
  description = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xoá",
  cancelText = "Huỷ",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
    >
      <DialogContent>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <WarningAmberRoundedIcon
            sx={{ fontSize: 42, color: theme.palette.error.main }}
          />

          <Typography fontWeight={600}>{title}</Typography>

          <Typography fontSize={14} color="text.secondary">
            {description}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onCancel}
          disabled={isLoading}
          color="inherit"
          sx={{ textTransform: "none" }}
        >
          {cancelText}
        </Button>

        <Button
          onClick={onConfirm}
          disabled={isLoading}
          color="error"
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            minWidth: 110,
          }}
        >
          {isLoading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            confirmText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
