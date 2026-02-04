import { useActionHook } from '@/hooks/admin/action.hook';
import { disableCourse, enableCourse } from '@/query/course/course.query';
import { useGetById } from '@/query/use.crud.query';
import { getUserByCourse } from '@/query/user/user.query';
import type { ICourseDetailResponse, Status } from '@/type/course.module';
import type { INotification } from '@/type/notification.module';
import type { IUserResponse } from '@/type/user.module';
import { showToast } from '@/utils/toast';
import { Drawer } from "@mui/material";
import { Box, Button, Divider, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useEffect, useState } from 'react';
interface Props{
    course:ICourseDetailResponse|null;
    refetch: () => Promise<any>;
    handleSendNotify: (request : INotification) => void
}
export default function PassedCourse({course,refetch,handleSendNotify}:Props) {
    const {data} = useGetById<IUserResponse>('users/get-by-course',getUserByCourse,course?.id||"")
    const [rejectReason, setRejectReason] = useState("");
    const [openReject, setOpenReject] = useState(false);
    const {handleDisable,handleEnable,isPendingDisable,isPendingEnable} = 
              useActionHook({mutationDisable:"courses/disable",mutationEnable:"courses/enable",
                disableMethod:disableCourse,enableMethod:enableCourse
              });
    const [adminStatus, setAdminStatus] = useState<Status | null>(null);
    useEffect(() =>{
      if(course) setAdminStatus(course.status);
    },[course])
    const handleSendResult = async () => {
    if (!course) return;

    let mess = "";

    if (adminStatus === "PUBLISHED") {
      handleEnable(course.id);
      mess = "Khoá học của bạn đã được xét duyệt";
    }

    if (adminStatus === "REJECTED") {
      if (!rejectReason.trim()) {
        showToast("Vui lòng nhập lý do từ chối", "error");
        return;
      }
      handleDisable(course.id);
      mess = `Khoá học của bạn đã bị từ chối.\nLý do: ${rejectReason}`;
    }

    handleSendNotify({
      title: "Thông báo duyệt khoá học",
      message: mess,
      url: `/instructor/edit-course/${course.id}`,
      user: { username: data?.username || "" },
    });

    refetch();
    showToast("Lưu thành công thông tin");
  };

  return (
    <Box mb={3}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "rgba(0,0,0,0.02)",
                  }}
                >
                  <Stack spacing={2}>
                    <ToggleButtonGroup
                      fullWidth
                      exclusive
                      value={adminStatus}
                      onChange={(_, value) => {
                        if (value) setAdminStatus(value);
                      }}
                    >
                      <ToggleButton value="PUBLISHED" color="success">
                        Publish
                      </ToggleButton>

                      <ToggleButton
                        value="REJECTED"
                        color="error"
                        onClick={() => {
                          setAdminStatus("REJECTED");
                          setOpenReject(true);
                        }}
                      >
                        Reject
                      </ToggleButton>

                    </ToggleButtonGroup>
                    <Button
                      variant="contained"
                      disabled={
                        !adminStatus ||
                        isPendingDisable ||
                        isPendingEnable ||
                        (adminStatus === "REJECTED" && !rejectReason.trim())
                      }
                      onClick={handleSendResult}
                    >
                      Lưu trạng thái
                    </Button>
                  </Stack>
                </Paper>
                <Drawer
                    anchor="right"
                    open={openReject}
                    onClose={() => setOpenReject(false)}
                    PaperProps={{
                      sx: {
                        width: 360,
                        p: 3,
                      },
                    }}
                  >
                    <Stack spacing={2}>
                      <TextField
                        label="Lý do từ chối"
                        placeholder="Nhập lý do từ chối khoá học..."
                        multiline
                        minRows={4}
                        fullWidth
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />

                      <Button
                        variant="contained"
                        color="error"
                        disabled={!rejectReason.trim() || isPendingDisable}
                        onClick={() => {
                          handleSendResult();
                          setOpenReject(false);
                        }}
                      >
                        Xác nhận từ chối
                      </Button>
                    </Stack>
                  </Drawer>

                <Divider sx={{ my: 3 }} />
              </Box>
  )
}
