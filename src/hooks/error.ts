import useToast from "@/hooks/use-toast";
export function handleError(error: any) {
  const { addToast } = useToast();
  const data = error?.response?.data || error;
  const codeRaw = data?.error?.code || data?.statusCode || data?.status;
  const code = Number(codeRaw);

  switch (code) {
    case 400:
      addToast({
        type: "error",
        description: data.error?.message || "Dữ liệu không hợp lệ.",
        duration: 5000,
      });
      break;
    case 401:
      addToast({
        type: "error",
        description: data.error?.message || "Không được phép.",
        duration: 5000,
      });

      break;
    case 403:
      addToast({
        type: "error",
        description: data.error?.message || "Truy cập bị từ chối.",
        duration: 5000,
      });
      break;
    case 404:
      addToast({
        type: "error",
        description: data.error?.message || "Không tìm thấy tài nguyên.",
        duration: 5000,
      });
      // if (typeof window !== "undefined") {
      //   window.location.href = "/404";
      // }
      break;
    case 409:
      addToast({
        type: "error",
        description: data.error?.message || "Xung đột dữ liệu.",
        duration: 5000,
      });
      break;
    case 500:
      addToast({
        type: "error",
        description: "Lỗi hệ thống.",
        duration: 5000,
      });
      break;
    default:
      addToast({
        type: "error",
        description: "Lỗi không xác định.",
        duration: 5000,
      });
      break;
  }
}
