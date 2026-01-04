import { toast } from "react-toastify";
import ToastComponent from "./toast.component";

export const showToast = (message: string) => {
  toast(<ToastComponent message={message} />);
};
