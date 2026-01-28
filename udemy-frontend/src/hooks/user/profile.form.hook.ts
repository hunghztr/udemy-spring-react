import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useSave } from "@/query/use.crud.query";
import { setUploadPercent } from "@/redux/slices/file.slice";
import { getMe, refreshToken } from "@/redux/thunks/auth.thunk";
import { showToast } from "@/utils/toast";
import type { IProfile } from "@/type/user.module";
import { updateProfile } from "@/query/user/user.query";
import { useCloudinaryUpload, useUploadSignature } from "@/query/file/use.file.query";
import type { ISignatureResponse } from "@/type/api.response";


export const useProfileFormHook = () => {
  // state
  const user = useAppSelector((state) => state.currentUser);
  const dispatch = useAppDispatch();
  const uploadPercent = useAppSelector(
    (state) => state.fileProgress.uploadPercent
  );

  const [fullname, setFullname] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: `${user?.description || ""}`,
  });

  //  xin chữ ký
  const { mutateAsync: getSignature, isPending: isGettingSignature } =
    useUploadSignature();

  //  upload cloudinary
  const { mutateAsync: uploadCloud, isPending: isUploadingCloud } =
    useCloudinaryUpload();

  const isUploadingAvatar = isGettingSignature || isUploadingCloud;

  const { isPending: isUploadingProfile, mutate: uploadProfile } = useSave<
    boolean,
    IProfile
  >("profiles/update", updateProfile);

  useEffect(() => {
    if (user?.fullname) setFullname(user.fullname);
    if (user?.avatarPath) setPreview(user.avatarPath);
  }, [user]);

  // handle upload avatar mới
  const handleSelectAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    try {
      // 1. xin chữ ký
      const sig : ISignatureResponse = await getSignature("avatars");
      // 2. upload cloudinary
      const data = await uploadCloud({
        file,
        sig,
        onProgress: (p) => dispatch(setUploadPercent({id:"avatar",percent:p})),
      });

      // 3. lưu url
      setAvatarPath(data.public_id);
    } catch (err) {
      console.error(err);
      alert("Upload avatar thất bại");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    const description = editor.getHTML();

    uploadProfile(
      {
        id: user.id,
        fullname,
        avatarPath: avatarPath || user.avatarPath,
        description,
      },
      {
        onSuccess: async () => {
          await dispatch(refreshToken()).unwrap();
          await dispatch(getMe()).unwrap();
          showToast("Cập nhật hồ sơ thành công");
        },
        onError: (err) => {
          console.error(err);
          alert("Cập nhật hồ sơ thất bại");
        },
      }
    );
  };

  return {
    editor,
    handleSubmit,
    fullname,
    setFullname,
    preview,
    isUploadingAvatar,
    handleSelectAvatar,
    uploadPercent,
    isFocused,
    setIsFocused,
    isUploadingProfile,
  };
};
