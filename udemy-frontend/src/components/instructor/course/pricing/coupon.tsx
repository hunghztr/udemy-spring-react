import { useUpdateCoupon } from '@/hooks/instructor/pricing/update.coupon';
import type { ICourseDetailResponse } from '@/type/course.module';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CircularProgress from "@mui/material/CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { AnimatePresence, motion } from "framer-motion";
interface Props {
  course: ICourseDetailResponse | null;
  refetch?: () => Promise<any>;
} 
export default function Coupon({course,refetch} : Props) {
    const {coupons,setOpenCoupons,openCoupons,
        setOpenAdd,editingCouponId,draftCoupon,setDraftCoupon,isValidDraftCoupon,saveEditCoupon,
        cancelEditCoupon,startEditCoupon,handleDeleteCoupon,openAdd,
        newCoupon,setNewCoupon,isValidNewCoupon,isCreated,handleAdd,} = useUpdateCoupon({course,refetch});
  return (
    <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography fontWeight={600}>
                  Danh sách Giảm giá ({coupons.length})
                </Typography>

                <IconButton onClick={() => setOpenCoupons((p) => !p)}>
                  <motion.div animate={{ rotate: openCoupons ? 180 : 0 }}>
                    <ExpandMoreIcon />
                  </motion.div>
                </IconButton>
              </Stack>

              <Button startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
                Thêm coupon
              </Button>
            </Stack>

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
                  <Stack spacing={2}>
                    <AnimatePresence>
                      {coupons.map((c) => {
                        const isEditing = editingCouponId === c.id;
                        const data = isEditing ? draftCoupon! : c;

                        return (
                          <motion.div
                            key={c.id}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0, scale: 0.97 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                          >
                            <Paper variant="outlined" sx={{ p: 1.5 }}>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <TextField
                                  label="Mã"
                                  size="small"
                                  value={data.code}
                                  InputProps={{ readOnly: !isEditing }}
                                  onChange={(e) =>
                                    setDraftCoupon((p) =>
                                      p ? { ...p, code: e.target.value } : p
                                    )
                                  }
                                  sx={{ flex: 1 }}
                                />

                                <TextField
                                  label="%"
                                  type="number"
                                  size="small"
                                  value={data.discount}
                                  InputProps={{ readOnly: !isEditing }}
                                  onChange={(e) =>
                                    setDraftCoupon((p) =>
                                      p ? { ...p, discount: +e.target.value } : p
                                    )
                                  }
                                  sx={{ width: 90 }}
                                />

                                {isEditing ? (
                                  <Stack direction="row" spacing={1} sx={{ minWidth: 150 }}>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      disabled={!isValidDraftCoupon}
                                      onClick={() => saveEditCoupon(c.id!)}
                                    >
                                      Lưu
                                    </Button>

                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={cancelEditCoupon}
                                    >
                                      Huỷ
                                    </Button>
                                  </Stack>
                                ) : (
                                  <Stack direction="row" spacing={0.5}>
                                    <Button size="small" onClick={() => startEditCoupon(c)}>
                                      Sửa
                                    </Button>

                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDeleteCoupon(c.id!)}
                                    >
                                      <DeleteOutlineIcon />
                                    </IconButton>
                                  </Stack>
                                )}
                              </Stack>
                            </Paper>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </Stack>
                </motion.div>
              )}
            </AnimatePresence>
            {/* ===== ADD DIALOG ===== */}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
                <DialogTitle>Thêm coupon</DialogTitle>
                <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                    label="Mã coupon"
                    value={newCoupon.code}
                    onChange={(e) =>
                        setNewCoupon((p) => ({ ...p, code: e.target.value }))
                    }
                    />
                    <TextField
                    label="% giảm"
                    type="number"
                    value={newCoupon.discount}
                    onChange={(e) =>
                        setNewCoupon((p) => ({ ...p, discount: +e.target.value }))
                    }
                    />
                </Stack>
                </DialogContent>

                <DialogActions>
                <Button onClick={() => setOpenAdd(false)}>Huỷ</Button>
                <Button
                    variant="contained"
                    disabled={!isValidNewCoupon || isCreated}
                    onClick={handleAdd}
                >
                    {isCreated ? <CircularProgress size={18} /> : "Thêm"}
                </Button>
                </DialogActions>
            </Dialog>
          </Stack>
  )
}
