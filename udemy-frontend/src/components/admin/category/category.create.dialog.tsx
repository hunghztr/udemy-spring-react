import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import { useCategoryFormHook } from '../../../hooks/admin/category/category.form.hook';
interface Props {
  open: boolean;
  onClose: () => void;
}
export default function CategoryCreateDialog({ open, onClose } : Props) {
    const {name,setName,selectedCategoryId,setSelectedCategoryId,categoryList,
        errorCreate,handleCreateCategory
    } = useCategoryFormHook({});
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
      <DialogTitle>Thêm danh mục</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            select
            label="Danh mục cha"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            fullWidth
            required
            disabled={!categoryList}
          >
            {categoryList?.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                <Stack>
                  <strong>{c.name}</strong>
                </Stack>
              </MenuItem>
            ))}
          </TextField>
          {errorCreate && 
          <Alert severity="error">{errorCreate}</Alert>
          }
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={async () =>{
            const result = await handleCreateCategory();
            if(result){
              window.location.reload();
            }
            
        }}
          disabled={!name}
        >
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  )
}
