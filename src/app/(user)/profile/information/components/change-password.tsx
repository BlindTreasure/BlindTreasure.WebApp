import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Backdrop } from "@/components/backdrop";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import useChangePassword from "@/app/(user)/profile/information/hooks/useChangePassword";
import { ChangePasswordBodyType } from "@/utils/schema-validations/change-password.schema";

interface ChangePasswordProps {
  open: boolean;
  onClose: any;
}

export default function ChangePassword({ open, onClose }: ChangePasswordProps) {
  const { register, errors, handleSubmit, onSubmit, reset, isPending } =
    useChangePassword();

  const handleSubmitForm = (data: ChangePasswordBodyType) => {
    try {
      const form: REQUEST.TChangePassword = {
        password: data.password,
      };
      onSubmit(form, handleCloseChangePassword);
    } catch (err) { }
  };

  const handleCloseChangePassword = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseChangePassword}>
      <DialogTitle></DialogTitle>
      <DialogContent className="bg-white select-none" hideClose>
        <div className="font-sans select-none">
          <div className="border-b-2 py-3 px-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold select-text">
              Chỉnh sửa mật khẩu
            </h3>
            <button type="button" onClick={handleCloseChangePassword}>
              <div className="p-2 bg-slate-200 rounded-full hover:bg-slate-300 cursor-pointer">
                <X className="w-4 h-4" />
              </div>
            </button>
          </div>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="py-3 px-4">
              <div className="flex flex-col gap-y-5">
                <div className="basis-1/2 flex flex-col gap-y-2">
                  <label className="text-[15px] font-medium text-gray-400">
                    Mật khẩu mới
                  </label>
                  <Input
                    type="password"
                    className={`border bg-[#f2f4f7] focus-visible:ring-0 focus-visible:none ${errors?.password && "border-red-500"
                      }`}
                    autoComplete="off"
                    placeholder="e.g. 123456789"
                    {...register("password")}
                  />
                  {errors?.password && (
                    <p className="text-base text-red-400">
                      {errors?.password.message}
                    </p>
                  )}
                </div>
                <div className="basis-1/2 flex flex-col gap-y-2">
                  <label className="text-[15px] font-medium text-gray-400">
                    Xác nhận mật khẩu mới
                  </label>
                  <Input
                    type="password"
                    className={`border bg-[#f2f4f7] focus-visible:ring-0 focus-visible:none ${errors?.confirmPassword && "border-red-500"
                      }`}
                    autoComplete="off"
                    placeholder="e.g. 123456789"
                    {...register("confirmPassword")}
                  />
                  {errors?.confirmPassword && (
                    <p className="text-base text-red-400">
                      {errors?.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className={`my-4 block w-[100%] rounded-md py-2 ${Object.keys(errors).length === 0
                    ? "bg-[#7a3cdd]"
                    : "bg-[#C3B1E1]"
                  }`}
              >
                <span className="text-base text-gray-200">Đổi mật khẩu</span>
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
      <Backdrop open={isPending} />
    </Dialog>
  );
}
