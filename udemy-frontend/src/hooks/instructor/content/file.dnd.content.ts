import { reorderLectures, updateLectureVideo } from "@/query/course/course.query";
import { useCloudinaryChunkUpload, useUploadSignature } from "@/query/file/use.file.query";
import { useSave } from "@/query/use.crud.query";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { resetUpload, setUploadPercent } from "@/redux/slices/file.slice";
import type { ICourseDetailResponse, ILecture, ISectionResponse } from "@/type/course.module";
import type { DragEndEvent } from "@dnd-kit/core";
import { useRef, useState } from "react";

export const useFileDnd = (course:ICourseDetailResponse|null,refetch:() => Promise<any>,
setSections:React.Dispatch<React.SetStateAction<ISectionResponse[]>>) =>{
    //state client 
    const {mutateAsync:reorderLecture} = useSave<ISectionResponse,
    {sectionId:string;data:string[]}
    >('courses/reorder-lecture',reorderLectures)
    //  xin chữ ký
    const { mutateAsync: getSignature } = useUploadSignature();
  
    //  upload cloudinary
    const { mutateAsync: uploadCloud, isPending: isUploadingCloud } = useCloudinaryChunkUpload();
    const {mutateAsync:updateLecturePath} = useSave<ISectionResponse,
    {id:string,data:ILecture,courseId:string}
    >('courses/update-lecture',updateLectureVideo)

    // state
    const [uploadingLectureId, setUploadingLectureId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const percent = useAppSelector(state => state.fileProgress.uploadPercent);

    // handle upload video
    const uploadVideo = async (file: File, lectureId: string) => {
        try {
        setUploadingLectureId(lectureId);

        // 1. xin chữ ký từ BE
        const sig = await getSignature("videos");

        // 2. upload chunk lên cloudinary
        const uploadRes = await uploadCloud({
            file,
            sig,
            onProgress: (p) => dispatch(setUploadPercent({id:lectureId,percent:p})),
        });
        const data : ILecture = {
            second: uploadRes.duration,
            path: uploadRes.public_id
        }
        // 3. gọi API update lecture (path + duration)
        updateLecturePath({
            id:lectureId,courseId:course?.id||"",data
        },{
            onSuccess:(res) =>{
            setSections(prev => prev.map(s => s.id === res.id? res:s))
            dispatch(resetUpload(lectureId))
            },
            onError:(err) =>{
            alert(err);
            }
        })

        } catch (err) {
        console.error(err);
        alert("Upload video thất bại");
        } finally {
        setUploadingLectureId(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };
    // handle drag drop
    const handleDragLectureEnd = (
        event: DragEndEvent,
        sectionId: string
    ) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        let result : ILecture[] = [];
        setSections((prev) =>
        prev.map((s) => {
            if (s.id !== sectionId) return s;

            const oldIndex = s.lectures.findIndex((l) => l.id === active.id);
            const newIndex = s.lectures.findIndex((l) => l.id === over.id);

            const newLectures = [...s.lectures];
            const [moved] = newLectures.splice(oldIndex, 1);
            newLectures.splice(newIndex, 0, moved);
            result = newLectures;
            return { ...s, lectures: newLectures };
        })
        );
        reorderLecture({
        sectionId,data:result.map(l => l.id).filter((id): id is string => !!id)
        },{
        onSuccess:() =>{
            refetch();
        }
        })
    };
    return {handleDragLectureEnd,isUploadingCloud,setUploadingLectureId,fileInputRef,uploadingLectureId,
        percent,uploadVideo
    }
}