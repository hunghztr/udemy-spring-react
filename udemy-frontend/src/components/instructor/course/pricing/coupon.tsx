import { useUpdateCoupon } from '@/hooks/instructor/pricing/update.coupon';
import type { ICourseDetailResponse } from '@/type/course.module';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Stack, TextField, Typography, Box, Chip, Divider
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  course: ICourseDetailResponse | null;
}

export default function Coupon({ course }: Props) {
  const {
    coupons, setOpenCoupons, openCoupons,
    setOpenAdd, editingCouponId, draftCoupon, setDraftCoupon,
    isValidDraftCoupon, saveEditCoupon, cancelEditCoupon, startEditCoupon,
    handleDeleteCoupon, openAdd, newCoupon, setNewCoupon,
    isValidNewCoupon, isCreated, handleAdd,
  } = useUpdateCoupon({ course });

  return (
    <Stack spacing={2}>
      {/* ===== HEADER ===== */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <LocalOfferIcon sx={{ fontSize: 18, color: "primary.main" }} />
          <Typography fontWeight={600} fontSize={15}>
            Mã giảm giá
          </Typography>
          <Chip
            label={coupons.length}
            size="small"
            sx={{ height: 20, fontSize: 11, fontWeight: 600 }}
          />
          <IconButton size="small" onClick={() => setOpenCoupons((p) => !p)}>
            <motion.div animate={{ rotate: openCoupons ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ExpandMoreIcon fontSize="small" />
            </motion.div>
          </IconButton>
        </Stack>

        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
        >
          Thêm mã
        </Button>
      </Stack>

      <Divider />

      {/* ===== COLLAPSE LIST ===== */}
      <AnimatePresence initial={false}>
        {openCoupons && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <Stack spacing={1.5}>
              <AnimatePresence>
                {coupons.length === 0 && (
                  <Box sx={{
                    textAlign: "center", py: 4,
                    border: "1px dashed", borderColor: "divider",
                    borderRadius: 2, color: "text.disabled"
                  }}>
                    <LocalOfferIcon sx={{ fontSize: 32, mb: 1, opacity: 0.4 }} />
                    <Typography fontSize={13}>Chưa có mã giảm giá nào</Typography>
                  </Box>
                )}

                {coupons.map((c) => {
                  const isEditing = editingCouponId === c.id;
                  const data = isEditing ? draftCoupon! : c;

                  return (
                    <motion.div
                      key={c.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <Box sx={{
                        display: "flex", alignItems: "center", gap: 1.5,
                        px: 2, py: 1.5,
                        border: "1px solid",
                        borderColor: isEditing ? "primary.main" : "divider",
                        borderRadius: 2,
                        backgroundColor: isEditing ? "primary.50" : "background.paper",
                        transition: "all 0.2s"
                      }}>
                        {/* Icon */}
                        <Box sx={{
                          width: 32, height: 32, borderRadius: 1,
                          backgroundColor: "primary.50",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0
                        }}>
                          <LocalOfferIcon sx={{ fontSize: 16, color: "primary.main" }} />
                        </Box>

                        {/* Fields */}
                        {isEditing ? (
                          <>
                            <TextField
                              label="Mã coupon"
                              size="small"
                              value={data.code}
                              onChange={(e) =>
                                setDraftCoupon((p) => p ? { ...p, code: e.target.value } : p)
                              }
                              sx={{ flex: 1 }}
                            />
                            <TextField
                              label="% giảm"
                              type="number"
                              size="small"
                              value={data.discount}
                              onChange={(e) =>
                                setDraftCoupon((p) => p ? { ...p, discount: +e.target.value } : p)
                              }
                              sx={{ width: 90 }}
                            />
                            <Stack direction="row" spacing={0.5}>
                              <IconButton
                                size="small"
                                color="primary"
                                disabled={!isValidDraftCoupon}
                                onClick={() => saveEditCoupon(c.id!)}
                                sx={{ border: "1px solid", borderColor: "primary.main" }}
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={cancelEditCoupon}
                                sx={{ border: "1px solid", borderColor: "divider" }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </>
                        ) : (
                          <>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                fontSize={13} fontWeight={600}
                                fontFamily="monospace"
                                letterSpacing={1}
                              >
                                {c.code}
                              </Typography>
                            </Box>

                            <Chip
                              label={`-${c.discount}%`}
                              size="small"
                              color="success"
                              sx={{ fontWeight: 700, fontSize: 12 }}
                            />

                            <Stack direction="row" spacing={0.5}>
                              <IconButton
                                size="small"
                                onClick={() => startEditCoupon(c)}
                                sx={{ color: "text.secondary" }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteCoupon(c.id!)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </>
                        )}
                      </Box>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== ADD DIALOG ===== */}
      <Dialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          pb: 1.5, borderBottom: "1px solid", borderColor: "divider"
        }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocalOfferIcon color="primary" fontSize="small" />
            <Typography fontWeight={600} fontSize={16}>Thêm mã giảm giá</Typography>
          </Stack>
          <IconButton size="small" onClick={() => setOpenAdd(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={2}>
            <TextField
              label="Mã coupon"
              placeholder="VD: SAVE20"
              fullWidth
              value={newCoupon.code}
              onChange={(e) => setNewCoupon((p) => ({ ...p, code: e.target.value }))}
              inputProps={{ style: { fontFamily: "monospace", letterSpacing: 1 } }}
            />
            <TextField
              label="Phần trăm giảm (%)"
              type="number"
              fullWidth
              value={newCoupon.discount}
              onChange={(e) => setNewCoupon((p) => ({ ...p, discount: +e.target.value }))}
              inputProps={{ min: 1, max: 100 }}
              helperText="Nhập từ 1 đến 100"
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setOpenAdd(false)}
            sx={{ textTransform: "none" }}
          >
            Huỷ
          </Button>
          <Button
            variant="contained"
            disabled={!isValidNewCoupon || isCreated}
            onClick={handleAdd}
            sx={{ textTransform: "none", minWidth: 80 }}
          >
            {isCreated ? <CircularProgress size={18} color="inherit" /> : "Thêm mã"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}