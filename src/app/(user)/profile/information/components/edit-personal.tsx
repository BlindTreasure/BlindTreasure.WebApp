import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Backdrop } from "@/components/backdrop";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Genders } from "@/const/user";
import { X } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import useUpdateInformation from "@/app/(user)/profile/information/hooks/useUpdateInformation";
import { UpdateInfoProfileBodyType } from "@/utils/schema-validations/update-infor-profile.schema";

interface EditPersonalProps {
  open: boolean;
  onClose: any;
  information: API.TProfileAccount;
  fetchProfileApi: () => {};
}

export default function EditPersonal({
  open,
  onClose,
  information,
  fetchProfileApi,
}: EditPersonalProps) {
  const { register, errors, handleSubmit, onSubmit, reset, isPending } =
    useUpdateInformation({
      firstName: information.firstName,
      lastName: information.lastName,
      phoneNumber: information.phoneNumber,
    });

  const [gender, setGender] = useState<string>(
    information.gender === 1 ? Genders[0].value : Genders[1].value
  );

  const handleCloseEditAvatar = () => {
    reset();
    onClose();
  };

  const handleSubmitForm = (data: UpdateInfoProfileBodyType) => {
    try {
      const form: REQUEST.TUpdateInfoProfile = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        gender: gender === "Male" ? 1 : 2,
      };
      onSubmit(form, handleCloseEditAvatar, fetchProfileApi);
    } catch (err) { }
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseEditAvatar}>
      <DialogTitle></DialogTitle>
      <DialogContent className="bg-white select-none" hideClose>
        <div className="font-sans select-none">
          <div className="border-b-2 py-3 px-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold select-text">
              Chỉnh sửa thông tin
            </h3>
            <button type="button" onClick={handleCloseEditAvatar}>
              <div className="p-2 bg-slate-200 rounded-full hover:bg-slate-300 cursor-pointer">
                <X className="w-4 h-4" />
              </div>
            </button>
          </div>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="py-3 px-4">
              <div className="flex flex-col gap-y-5">
                <div className="flex items-center justify-between gap-x-3">
                  <div className="basis-1/2 flex flex-col gap-y-2">
                    <label className="text-[15px] font-medium text-gray-400">
                      Họ
                    </label>
                    <Input
                      type="text"
                      className={`border bg-[#f2f4f7] focus-visible:ring-0 focus-visible:none ${errors?.firstName && "border-red-500"
                        }`}
                      autoComplete="off"
                      placeholder="e.g. Hehe"
                      {...register("firstName")}
                    />
                    {errors?.firstName && (
                      <p className="text-base text-red-400">
                        {errors?.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="basis-1/2 flex flex-col gap-y-2">
                    <label className="text-[15px] font-medium text-gray-400">
                      Tên
                    </label>
                    <Input
                      type="text"
                      className={`border bg-[#f2f4f7] focus-visible:ring-0 focus-visible:none ${errors?.lastName && "border-red-500"
                        }`}
                      autoComplete="off"
                      placeholder="e.g. Hehe"
                      {...register("lastName")}
                    />
                    {errors?.lastName && (
                      <p className="text-base text-red-400">
                        {errors?.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                {/* Email */}
                <div className="basis-1/2 flex flex-col gap-y-2">
                  <label className="text-[15px] font-medium text-gray-400">
                    Số điện thoại
                  </label>
                  <div className="flex gap-x-3">
                    <div
                      className={`basis-1/12 p-1 border bg-[#f2f4f7] rounded-md text-center`}
                    >
                      <span className="text text-xs text-center text-gray-400">
                        +84
                      </span>
                    </div>
                    <div className="flex-1">
                      <Input
                        type="number"
                        className={`border bg-[#f2f4f7] focus-visible:ring-0 focus-visible:none ${errors?.phoneNumber && "border-red-500"
                          }`}
                        autoComplete="off"
                        placeholder="e.g. Hehe"
                        {...register("phoneNumber")}
                      />
                    </div>
                  </div>
                  {errors?.phoneNumber && (
                    <p className="text-base text-red-400">
                      {errors?.phoneNumber?.message}
                    </p>
                  )}
                </div>

                <div className="basis-1/2 flex flex-col gap-y-2 justify-end">
                  <label className="text-[15px] font-medium text-gray-400">
                    Giới tính
                  </label>
                  <Select
                    value={gender}
                    onValueChange={(value) => setGender(value)}
                  >
                    <SelectTrigger className="border bg-[#f2f4f7] focus-visible:ring-0 focus-visible:none">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Genders?.map((item, index) => (
                          <SelectItem key={index} value={item.value}>
                            {item.value}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <button
                type="submit"
                className={`my-4 block w-[100%] rounded-md py-2 ${Object.keys(errors).length === 0
                    ? "bg-[#7a3cdd]"
                    : "bg-[#C3B1E1]"
                  }`}
              >
                <span className="text-base text-gray-200">Cập nhật</span>
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
      <Backdrop open={isPending} />
    </Dialog>
  );
}
