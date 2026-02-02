
import api from "@/api/api";
import { sliceFile } from "@/helpers/format.time";
import type { ISignatureResponse } from "@/type/api.response";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";


{/**
  lấy chữ kí từ BE
   */}
export const getUploadSignature = async (folder:string) => {
  const res = await api.get(`/files/signature/${folder}`);
  return res.data;
};

export const getUploadSignatureDestroy = async (publicId:string) => {
  const res = await api.get(`/files/signature-destroy?publicId=${publicId}`);
  return res.data;
};

export const useUploadSignature = () => {
  return useMutation({
    mutationFn: getUploadSignature,
  });
};

export const useUploadSignatureDestroy = () =>{
  return useMutation({
    mutationFn: getUploadSignatureDestroy
  })
}
{/**
  upload thẳng lên cloud
   */}
export const uploadToCloudinary = async ({
  file,
  sig,
  onProgress,
}: {
  file: File;
  sig: ISignatureResponse;
  onProgress?: (p: number) => void;
}) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.apiKey);
  formData.append("timestamp", sig.timestamp);
  formData.append("signature", sig.signature);
  formData.append("folder", sig.folder);

  const url = `${import.meta.env.VITE_CLOUDINARY_UPLOAD}/${sig.cloudName}/auto/upload`;

  const res = await axios.post(url, formData, {
    onUploadProgress: (e) => {
      if (!e.total || !onProgress) return;
      const percent = Math.round((e.loaded * 100) / e.total);
      onProgress(percent);
    },
  });

  return res.data;
};
{/**
  upload theo chunk 
   */}
const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB
export const uploadToCloudinaryChunk = async ({
  file,
  sig,
  onProgress,
}: {
  file: File;
  sig: ISignatureResponse;
  onProgress?: (p: number) => void;
}) => {
  const uploadId = uuidv4();
  const total = file.size;
  let uploaded = 0;

  const url = `${import.meta.env.VITE_CLOUDINARY_UPLOAD}/${sig.cloudName}/auto/upload`;

  let finalResponse: any = null;

  for (let start = 0; start < total; start += CHUNK_SIZE) {
    const end = Math.min(start + CHUNK_SIZE, total);
    const chunk = sliceFile(file, start, end);

    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("api_key", sig.apiKey);
    formData.append("timestamp", sig.timestamp);
    formData.append("signature", sig.signature);
    formData.append("folder", sig.folder);

    const res = await axios.post(url, formData, {
      headers: {
        "X-Unique-Upload-Id": uploadId,
        "Content-Range": `bytes ${start}-${end - 1}/${total}`,
      },
      onUploadProgress: (e) => {
        if (!e.total) return;
        const current = uploaded + e.loaded;
        const percent = Math.round((current * 100) / total);
        onProgress?.(percent);
      },
    });

    uploaded = end;

    // chunk cuối
    if (end === total) {
      finalResponse = res.data;
    }
  }

  return finalResponse;
};

export const destroyFromCloudinary = async ({
  publicId,
  sig,
  resourceType = "image",
}: {
  publicId: string;
  sig: ISignatureResponse;
  resourceType?: "image" | "video" | "raw";
}) => {
  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", sig.apiKey);
  formData.append("timestamp", sig.timestamp);
  formData.append("signature", sig.signature);

  const url = `${import.meta.env.VITE_CLOUDINARY_UPLOAD}/${sig.cloudName}/${resourceType}/destroy`;

  const res = await axios.post(url, formData);
  return res.data;
};
export const destroyAllFromCloudinary = async (publicIds : string[]) =>{
  const res = await api.post("/files/delete-files-by-ids",publicIds)
  return res.data;
}

export const useCloudinaryUpload = () => {
  return useMutation({
    mutationFn: uploadToCloudinary,
  });
};

export const useCloudinaryChunkUpload = () => {
  return useMutation({
    mutationFn: uploadToCloudinaryChunk,
  });
};

export const useCloudinaryDestroy= () =>{
  return useMutation({
    mutationFn: destroyFromCloudinary
  })
}
export const useCloudinaryDestroyAll = () =>{
  return useMutation({
    mutationFn: destroyAllFromCloudinary
  })
}