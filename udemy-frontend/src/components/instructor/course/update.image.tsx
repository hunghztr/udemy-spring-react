import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  Dialog,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

import { updateCourseImage } from "@/query/course/course.query";
import {
  useCloudinaryDestroy,
  useCloudinaryUpload,
  useUploadSignature,
  useUploadSignatureDestroy,
} from "@/query/file/use.file.query";
import { useSave } from "@/query/use.crud.query";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setUploadPercent } from "@/redux/slices/file.slice";
import type { ISignatureResponse } from "@/type/api.response";
import type { ICourse, ICourseDetailResponse } from "@/type/course.module";
import { useEffect, useRef, useState } from "react";
import Loading from "@/components/loading";
import { showToast } from "@/utils/toast";
import { query } from "@/main";

interface IProps {
  course: ICourseDetailResponse | null;
  setDone?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UpdateImage({ course }: IProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [openPreview, setOpenPreview] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useAppDispatch();
  const percent = useAppSelector(
    (s) => s.fileProgress.uploadPercent["image"] || 0
  );

  // xin chữ ký
  const { mutateAsync: getSignature, isPending: isGettingSignature } =
    useUploadSignature();
  // xin chữ kí xoá file
  const {mutateAsync:getSignatureDestroy,isPending: isGettingDestroySig} = useUploadSignatureDestroy();
  // upload cloudinary
  const { mutateAsync: uploadCloud, isPending: isUploadingCloud } =
    useCloudinaryUpload();
  // delete file
  const {mutateAsync: deleteFile, isPending: isDeleting} = useCloudinaryDestroy();
  // update course
  const { mutateAsync: updateImage, isPending: isUpdating } = useSave<
    boolean,
    ICourse
  >("courses/update-image", updateCourseImage);

  // show image from server
  useEffect(() => {
    if (course?.imagePath) {
      setPreview(
        `${import.meta.env.VITE_CLOUDINARY_WATCH_IMG}/${course.imagePath}`
      );
    }
  }, [course?.imagePath]);

  // ===== HANDLE SELECT =====
  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    try {
      // 1. xin chữ ký
      const sig: ISignatureResponse = await getSignature("images");
      // 2. upload cloudinary
      const data = await uploadCloud({
        file,
        sig,
        onProgress: (p) =>
          dispatch(setUploadPercent({ id: "image", percent: p })),
      });
      // 3. lưu public_id
      await updateImage(
        {
          id: course?.id || "",
          imagePath: data.public_id,
        },
        {
          onSuccess: () => {
            query.invalidateQueries({queryKey:["courses/get-by-id"]});
            query.removeQueries({queryKey:["courses/search"],exact:false})
          },
        }
      );
    } catch (err) {
      showToast("Có lỗi trong quá trình upload","error")
    }
  };
  const handleDeleteImage = async () => {
    if (!course?.imagePath) return;

    try {
      // 1. xin signature để destroy
      const sig: ISignatureResponse = await getSignatureDestroy(course.imagePath); 

      // 2. xoá cloudinary
      await deleteFile({
        publicId: course.imagePath,
        sig,
        resourceType: "image",
      });

      // 3. update DB
      await updateImage(
        {
          id: course.id,
        },
        {
          onSuccess: () => {
            setPreview(null);
            query.invalidateQueries({queryKey:["courses/get-by-id"]})
          },
        }
      );
    } catch (err) {
      showToast("Xoá hình ảnh thất bại","error");
    }
  };
  const loading =isGettingSignature ||isUploadingCloud ||isUpdating ||isDeleting ||isGettingDestroySig;
    if (loading) {
      return <Loading />;
    }
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Hình ảnh khoá học
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderStyle: "dashed",
          borderColor: "grey.400",
          textAlign: "center",
        }}
      >
        <Stack spacing={2} alignItems="center">
          {/* PREVIEW */}
          {preview ? (
            <Box
              component="img"
              src={preview}
              alt="preview"
              onClick={() => setOpenPreview(true)}
              sx={{
                width: "100%",
                maxWidth: 420,
                aspectRatio: "16 / 9",
                objectFit: "cover",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.300",
                cursor: "zoom-in",
              }}
            />
          ) : (
            <Box
              sx={{
                width: 420,
                maxWidth: "100%",
                aspectRatio: "16 / 9",
                bgcolor: "grey.100",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="text.secondary">
                Chưa có hình ảnh
              </Typography>
            </Box>
          )}

          {/* PROGRESS */}
          {loading && (
            <Box width="100%" maxWidth={420}>
              <LinearProgress variant="determinate" value={percent} />
              <Typography variant="caption">
                Đang upload: {percent}%
              </Typography>
            </Box>
          )}

          {/* INPUT */}
          <input
            ref={inputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleSelectImage}
          />

          {/* BUTTON */}
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={loading}
            onClick={() => inputRef.current?.click()}
          >
            {preview ? "Đổi hình ảnh" : "Tải hình ảnh"}
          </Button>
          {course?.imagePath && (
            <Button
              variant="outlined"
              color="error"
              disabled={loading}
              onClick={handleDeleteImage}
            >
              Xoá ảnh
            </Button>
          )}
          <Typography variant="caption" color="text.secondary">
            Tỉ lệ khuyến nghị: 16:9 — JPG, PNG
          </Typography>
        </Stack>
      </Paper>

      {/* ===== PREVIEW DIALOG ===== */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md">
        <Box position="relative" p={1}>
          <IconButton
            onClick={() => setOpenPreview(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
              zIndex: 10,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            component="img"
            src={preview || ""}
            alt="preview-large"
            sx={{
              maxWidth: "90vw",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        </Box>
      </Dialog>
    </Box>
  );
}
