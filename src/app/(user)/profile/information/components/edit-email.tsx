import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Backdrop } from "@/components/backdrop";
import { X } from "lucide-react";
import useUpdateEmail from "@/app/(user)/profile/information/hooks/useUpdateEmail";
import { UpdateEmailBodyType } from "@/utils/schema-validations/update-email-schema";
import { Input } from "@/components/ui/input";

interface EditEmailProps {
  open: boolean;
  onClose: any;
  information: API.TProfileAccount;
  fetchProfileApi: () => {};
}

export default function EditEmail({
  open,
  onClose,
  information,
}: EditEmailProps) {
  const { register, errors, handleSubmit, onSubmit, reset, isPending } =
    useUpdateEmail({
      email: information.email,
    });

  const handleSubmitForm = (data: UpdateEmailBodyType) => {
    try {
      const form: REQUEST.TUpdateEmail = {
        email: data.email,
      };
      onSubmit(form, handleCloseEditEmail);
    } catch (err) { }
  };

  const handleCloseEditEmail = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseEditEmail}>
      <DialogTitle></DialogTitle>
      <DialogContent className="bg-white select-none" hideClose>
        <div className="font-sans select-none">
          <div className="border-b-2 py-3 px-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold select-text">Chỉnh sửa email</h3>
            <button type="button" onClick={handleCloseEditEmail}>
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
                    Email
                  </label>
                  <Input
                    type="text"
                    className={`border bg-[#f2f4f7] focus-visible:ring-0 focus-visible:none ${errors?.email && "border-red-500"
                      }`}
                    autoComplete="off"
                    placeholder="e.g. hehe@gmail.com"
                    {...register("email")}
                  />
                  {errors?.email && (
                    <p className="text-base text-red-400">
                      {errors?.email?.message}
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
                <span className="text-base text-gray-200">Đổi email</span>
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
      <Backdrop open={isPending} />
    </Dialog>
  );
}
