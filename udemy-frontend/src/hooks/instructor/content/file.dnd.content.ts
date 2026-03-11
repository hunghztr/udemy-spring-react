import {
  reorderLectures,
  updateLectureVideo,
} from "@/query/course/course.query";
import {
  useCloudinaryChunkUpload,
  useCloudinaryDestroy,
  useCloudinaryDestroyAll,
  useUploadSignature,
  useUploadSignatureDestroy,
} from "@/query/file/use.file.query";
import { query } from "@/query/queryClient";
import { useSave } from "@/query/use.crud.query";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { resetUpload, setUploadPercent } from "@/redux/slices/file.slice";
import type { ISignatureResponse } from "@/type/api.response";
import type {
  ICourseDetailResponse,
  ILecture,
  ISectionResponse,
} from "@/type/course.module";
import { showToast } from "@/utils/toast";
import type { DragEndEvent } from "@dnd-kit/core";
import { useRef, useState } from "react";

export const useFileDnd = (course: ICourseDetailResponse | null) => {
  // ================= mutations =================
  const { mutateAsync: reorderLecture } = useSave<
    ISectionResponse,
    { sectionId: string; data: string[] }
  >("courses/reorder-lecture", reorderLectures);

  const { mutateAsync: updateLecturePath } = useSave<
    any,
    { id: string; data: ILecture; courseId: string }
  >("courses/update-lecture", updateLectureVideo);

  // ================= cloudinary =================
  const { mutateAsync: getSignature } = useUploadSignature();
  const { mutateAsync: getSignatureDestroy } =
    useUploadSignatureDestroy();
  const { mutateAsync: deleteFile, isPending: isDelete } =
    useCloudinaryDestroy();
  const {
    mutateAsync: deleteAllFile,
    isPending: isDeleteAll,
  } = useCloudinaryDestroyAll();
  const {
    mutateAsync: uploadCloud,
    isPending: isUploadingCloud,
  } = useCloudinaryChunkUpload();

  // ================= state =================
  const [uploadingLectureId, setUploadingLectureId] =
    useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const percent = useAppSelector(
    (state) => state.fileProgress.uploadPercent
  );

  // ================= helper =================
  const updateCourseCache = (
    updater: (old: ICourseDetailResponse) => ICourseDetailResponse
  ) => {
    if (!course) return;
    query.setQueryData<ICourseDetailResponse>(
      ["courses/get-by-id", course.id],
      (old) => (old ? updater(old) : old)
    );
  };

  // ================= upload video =================
  const uploadVideo = async (file: File, lectureId: string) => {
    if (!course) return;

    try {
      setUploadingLectureId(lectureId);

      const sig = await getSignature("videos");

      const uploadRes = await uploadCloud({
        file,
        sig,
        onProgress: (p) =>
          dispatch(setUploadPercent({ id: lectureId, percent: p })),
      });

      const data: ILecture = {
        second: uploadRes.duration,
        path: uploadRes.public_id,
      };

      const updatedSection = await updateLecturePath({
        id: lectureId,
        courseId: course.id,
        data,
      });

      // ✅ update cache
      updateCourseCache((old) => ({
        ...old,
        sections: old.sections.map((s) =>
          s.id === updatedSection.id ? updatedSection : s
        ),
      }));

      dispatch(resetUpload(lectureId));
      query.invalidateQueries({ queryKey: ["courses/search"] });
    } catch (err: any) {
      showToast(`${err}`, "error");
    } finally {
      setUploadingLectureId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ================= drag & drop =================
  const handleDragLectureEnd = (
    event: DragEndEvent,
    sectionId: string
  ) => {
    if (!course) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    let newOrder: ILecture[] = [];

    // ✅ optimistic update
    updateCourseCache((old) => ({
      ...old,
      sections: old.sections.map((s) => {
        if (s.id !== sectionId) return s;

        const oldIndex = s.lectures.findIndex(
          (l) => l.id === active.id
        );
        const newIndex = s.lectures.findIndex(
          (l) => l.id === over.id
        );

        const lectures = [...s.lectures];
        const [moved] = lectures.splice(oldIndex, 1);
        lectures.splice(newIndex, 0, moved);
        newOrder = lectures;

        return { ...s, lectures };
      }),
    }));

    reorderLecture({
      sectionId,
      data: newOrder.map((l) => l.id!).filter(Boolean),
    });

    query.invalidateQueries({ queryKey: ["courses/search"] });
  };

  // ================= destroy =================
  const handleDestroy = async (path: string) => {
    try {
      const sig: ISignatureResponse = await getSignatureDestroy(path);
      await deleteFile({
        publicId: path,
        sig,
        resourceType: "video",
      });
    } catch (err) {
      showToast(`${err}`, "error");
    }
  };

  const handleDestroyAll = async (publicIds: string[]) => {
    try {
      await deleteAllFile(publicIds);
    } catch (err) {
      showToast(`${err}`, "error");
    }
  };

  return {
    handleDragLectureEnd,
    uploadVideo,
    handleDestroy,
    handleDestroyAll,
    uploadingLectureId,
    setUploadingLectureId,
    isUploadingCloud,
    percent,
    fileInputRef,
    isLoading: isDelete || isDeleteAll,
  };
};
