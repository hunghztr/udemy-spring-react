import { useActionHook } from '@/hooks/admin/action.hook';
import { disableCourse, enableCourse } from '@/query/course/course.query';
import { query } from '@/query/queryClient';
import { useGetById } from '@/query/use.crud.query';
import { getUserByCourse } from '@/query/user/user.query';
import type { ICourseDetailResponse, Status } from '@/type/course.module';
import type { INotification } from '@/type/notification.module';
import type { IUserResponse } from '@/type/user.module';
import { showToast } from '@/utils/toast';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';

interface Props {
  course: ICourseDetailResponse | null;
  handleSendNotify: (request: INotification) => Promise<void> | void;
}

export default function PassedCourse({ course, handleSendNotify }: Props) {
  const { data } = useGetById<IUserResponse>(
    'users/get-by-course',
    getUserByCourse,
    course?.id || ''
  );

  const { handleDisable, handleEnable } = useActionHook({
    mutationDisable: 'courses/disable',
    mutationEnable: 'courses/enable',
    disableMethod: disableCourse,
    enableMethod: enableCourse,
  });

  const [openDrawer, setOpenDrawer] = useState(false);
  const [adminStatus, setAdminStatus] = useState<Status>('PUBLISHED');
  const [message, setMessage] = useState('');
  const submittingRef = useRef(false);

  useEffect(() => {
    if (course) setAdminStatus(course.status);
  }, [course]);

  const handleSendResult = async () => {
    if (!course) return;
    if (submittingRef.current) return;

    if (adminStatus === 'REJECTED' && !message.trim()) {
      showToast('Vui lòng nhập lý do từ chối', 'error');
      return;
    }

    submittingRef.current = true;

    try {
      let finalMessage = message;

      if (adminStatus === 'PUBLISHED') {
        await handleEnable(course.id);
        finalMessage ||= 'Khoá học của bạn đã được xét duyệt';
      }

      if (adminStatus === 'REJECTED') {
        await handleDisable(course.id);
        finalMessage ||= 'Khoá học của bạn đã bị từ chối';
      }

      await handleSendNotify({
        title: 'Thông báo duyệt khoá học',
        message: finalMessage,
        url: `/instructor/edit-course/${course.id}`,
        user: { username: data?.username || '' },
      });

      query.invalidateQueries({ queryKey: ['notifications/create'] });
      showToast('Đã gửi kết quả xét duyệt');

      setOpenDrawer(false);
      setMessage('');
    } catch (err) {
      console.error(err);
      showToast('Có lỗi xảy ra, vui lòng thử lại', 'error');
    } finally {
      submittingRef.current = false; // 🔓 UNLOCK
    }
  };

  return (
    <Box mb={3}>
      <Paper
        variant="outlined"
        sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' }}
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => setOpenDrawer(true)}
        >
          Phê duyệt khoá học
        </Button>
      </Paper>

      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{ sx: { width: 380, p: 3 } }}
      >
        <Stack spacing={2}>
          <ToggleButtonGroup
            exclusive
            fullWidth
            value={adminStatus}
            onChange={(_, value) => value && setAdminStatus(value)}
          >
            <ToggleButton value="PUBLISHED" color="success">
              Publish
            </ToggleButton>
            <ToggleButton value="REJECTED" color="error">
              Reject
            </ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label={
              adminStatus === 'REJECTED'
                ? 'Lý do từ chối'
                : 'Ghi chú phê duyệt'
            }
            placeholder={
              adminStatus === 'REJECTED'
                ? 'Nhập lý do từ chối khoá học...'
                : 'Khoá học đã được xét duyệt'
            }
            multiline
            minRows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            color={adminStatus === 'REJECTED' ? 'error' : 'success'}
            onClick={handleSendResult}
          >
            Gửi kết quả
          </Button>
        </Stack>
      </Drawer>

      <Divider sx={{ my: 3 }} />
    </Box>
  );
}