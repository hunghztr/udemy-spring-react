import { toast } from "react-toastify";
import ToastComponent from "./toast.component";
import ToastNotify from "./toast.notify.component";

export const showToast = (
  message: string,
  type: "success" | "error" = "success"
) => {
  toast(<ToastComponent message={message} type={type} />);
};


export const showToastNotify = (
  title : string,
  message : string,
  url : string,
  type : "success" | "error" = "success",
) => {
  toast(
    <ToastNotify
      title={title}
      message={message}
      url={url}
      type={type}
    />,
  );
};