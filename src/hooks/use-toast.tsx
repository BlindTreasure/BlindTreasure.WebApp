// import { toast } from "sonner";
// import ToastAlert from "@/components/toast/toast-alert";

// type ToastType = "success" | "error" | "warning";

// const useToast = () => {
//   const addToast = (
//     options?: { description?: string; type?: ToastType; duration?: number },
//     close: boolean = true
//   ) => {
//     toast.custom(
//       (t) => (
//         <div>
//           <ToastAlert
//             description={options?.description || ""}
//             type={options?.type || "success"}
//             onClose={close === true ? () => toast.dismiss(t) : null}
//           />
//         </div>
//       ),
//       {
//         duration: options?.duration || 3000,
//       }
//     );
//   };

//   return { addToast };
// };

// export default useToast;

import { toast } from "sonner";

type ToastType = "success" | "error" | "warning";

const useToast = () => {
  const addToast = (
    options?: { description?: string; type?: ToastType; duration?: number },
  ) => {
    const { description, type = "success", duration = 3000 } = options || {};

    if (type === "success") {
      toast.success(description || "Thành công!", { duration });
    } else if (type === "error") {
      toast.error(description || "Có lỗi xảy ra!", { duration });
    } else if (type === "warning") {
      toast.warning(description || "Cảnh báo!", { duration });
    }
  };

  return { addToast };
};

export default useToast;
