import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { uploadAvatar } from "../../redux/thunks/instructor/file.thunk";
import { updateProfile } from "../../redux/thunks/instructor/profile.thunk";
import { showToast } from "../../utils/toast";

export const useProfileFormHook = () =>{
    // state
  const user = useAppSelector((state) => state.currentUser);
  const pendingCount = useAppSelector((state) => state.loading.pendingCount);
  const dispatch = useAppDispatch();
  const uploading = pendingCount > 0;
  const uploadPercent = useAppSelector(state => state.fileProgress.uploadPercent);

  const [fullname, setFullname] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: `${user?.description || "" }`,
  });

  useEffect(() => {
    if (user?.fullname) setFullname(user.fullname);
    if (user?.avatarPath) setPreview(user.avatarPath);
  }, [user]);

  // handle
  const handleSelectAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview ngay
    setPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await dispatch(uploadAvatar({ userId: user.id, formData })).unwrap();
      setAvatarPath(res.result);
    } catch (err) {
      console.error(err);
      alert("Upload ảnh thất bại");
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    const description = editor.getHTML();

    try {
      await dispatch(updateProfile({
        id: user.id,
        fullname,
        avatarPath: avatarPath || user.avatarPath || "",
        description,
      })).unwrap();
      showToast("Cập nhật hồ sơ thành công");
    } catch (err) {
      console.error(err);
      alert("Update thất bại");
    }
  };
  return {
    editor,handleSubmit,fullname,setFullname,preview,uploading,handleSelectAvatar,uploadPercent,isFocused,
    setIsFocused
  };
}