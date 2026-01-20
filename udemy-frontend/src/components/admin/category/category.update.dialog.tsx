import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from "@mui/material";
import { motion } from "framer-motion";
import { useCategoryFormHook } from "../../../hooks/admin/category/category.form.hook";

interface Props {
  open: boolean;
  onClose: () => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
}

export default function CategoryUpdateDialog({open,onClose,categoryId,setCategoryId} : Props) {
  const {name, setName, selectedCategoryId, setSelectedCategoryId, categoryList,
      handleUpdateCategory,errorUpdate} = useCategoryFormHook({categoryId});
  
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
      <DialogTitle>Sửa danh mục</DialogTitle>

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
          {errorUpdate && 
          <Alert severity="error">{errorUpdate}</Alert>
          }
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={async () =>{
            const result = await handleUpdateCategory(categoryId);
            if(result){
              setCategoryId("");
              window.location.reload();
              // await fetchData();
              // onClose();
            }
            }}
          disabled={!name}
        >
          Sửa
        </Button>
      </DialogActions>
    </Dialog>
  )
}
