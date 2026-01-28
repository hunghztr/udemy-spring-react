import { useUserFormHook } from "@/hooks/admin/user/user.form.hook";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  setUserId: (id: string) => void;
}

export default function UserUpdateDialog({ open, onClose, userId, setUserId }: Props) {
  const {username, setUsername, fullname, setFullname, roleId, setRoleId, roleList,
    handleUpdateUser,errorUpdate} = useUserFormHook({userId});

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
      <DialogTitle>Sửa người dùng</DialogTitle>

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
          {errorUpdate && 
          <Alert severity="error">{errorUpdate.response?.data.message}</Alert>
          }
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={async () =>{
            const result = await handleUpdateUser(userId);
            if(result){
              setUserId("");
              window.location.reload();
              // await fetchData();
              // onClose();
            }
            }}
          disabled={!username || !fullname}
        >
          Sửa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
