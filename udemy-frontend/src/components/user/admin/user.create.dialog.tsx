import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";
import { useSaveUserHook } from "../../../hooks/admin/save.user.hook";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  setRefreshFlag: (flag: boolean) => void;
}

export default function UserCreateDialog({ open, onClose, setRefreshFlag }: Props) {
  const {
    username,
    setUsername,
    fullname,
    setFullname,
    password,
    setPassword,
    roleId,
    setRoleId,
    roleList,
    handleSubmitCreate,
    success,setSuccess
  } = useSaveUserHook();
  // set up khi thành công
  useEffect(() => {
    if(success){
       setRefreshFlag(true)
       setSuccess(prev => !prev);
    };
  }, [success]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: motion.div,
        initial: { y: -50, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -50, opacity: 0 },
        transition: { duration: 0.3, ease: "easeOut" },
      }}
    >
      <DialogTitle>Thêm người dùng</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Tài khoản"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Họ tên"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />

          <TextField
            select
            label="Vai trò"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            fullWidth
            required
            disabled={!roleList}
          >
            {roleList?.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                <Stack>
                  <strong>{role.name}</strong>
                  <span style={{ fontSize: 12, opacity: 0.7 }}>
                    {role.description}
                  </span>
                </Stack>
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={() =>{
            handleSubmitCreate();
            onClose();
        }}
          disabled={!username || !password || !fullname}
        >
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  );
}
