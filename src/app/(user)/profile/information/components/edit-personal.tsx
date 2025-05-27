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
  // Thêm watch và setValue từ useForm
  const { register, errors, handleSubmit, onSubmit, reset, isPending, watch, setValue } =
    useUpdateInformation({
      fullName: information.fullName,
      email: information.email,
      phoneNumber: information.phoneNumber,
      gender: information.gender,
    });

  // Theo dõi giá trị gender từ form
  const genderValue = watch("gender");

  const handleCloseEdit = () => {
    reset();
    onClose();
  };

  const handleSubmitForm = (data: UpdateInfoProfileBodyType) => {
    try {
      console.log("Submitted data:", data);
      const form: REQUEST.TUpdateInfoProfile = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        gender: data.gender, // Sử dụng trực tiếp từ form data
      };
      onSubmit(form, handleCloseEdit, fetchProfileApi);
    } catch (err) {}
  };

  // Hàm chuyển đổi giá trị gender để hiển thị
  const getGenderDisplayValue = (value: boolean | null | undefined) => {
    if (value === undefined || value === null) return "";
    return value === true ? "true" : "false";
  };


  return (
    <Dialog open={open} onOpenChange={handleCloseEdit}>
      <DialogTitle />
      <DialogContent className="bg-white select-none" hideClose>
        <div className="font-sans select-none">
          <div className="border-b-2 py-3 px-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold select-text">
              Chỉnh sửa thông tin
            </h3>
            <button type="button" onClick={handleCloseEdit}>
              <div className="p-2 bg-slate-200 rounded-full hover:bg-slate-300 cursor-pointer">
                <X className="w-4 h-4" />
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="py-3 px-4">
              <div className="flex flex-col gap-y-5">
                {/* Full Name */}
                <div className="flex flex-col gap-y-2">
                  <label className="text-[15px] font-medium text-gray-400">
                    Họ và tên
                  </label>
                  <Input
                    type="text"
                    className={`border bg-[#f2f4f7] focus-visible:ring-0 ${
                      errors?.fullName && "border-red-500"
                    }`}
                    autoComplete="off"
                    placeholder="e.g. Nguyễn Văn A"
                    {...register("fullName")}
                  />
                  {errors?.fullName && (
                    <p className="text-base text-red-400">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-y-2">
                  <label className="text-[15px] font-medium text-gray-400">
                    Số điện thoại
                  </label>
                  <div className="flex gap-x-3">
                    <div className="basis-1/12 p-1 border bg-[#f2f4f7] rounded-md text-center">
                      <span className="text-xs text-gray-400">+84</span>
                    </div>
                    <div className="flex-1">
                      <Input
                        type="text"
                        className={`border bg-[#f2f4f7] focus-visible:ring-0 ${
                          errors?.phoneNumber && "border-red-500"
                        }`}
                        autoComplete="off"
                        placeholder="123456789"
                        {...register("phoneNumber")}
                      />
                    </div>
                  </div>
                  {errors?.phoneNumber && (
                    <p className="text-base text-red-400">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-y-2">
                  <label className="text-[15px] font-medium text-gray-400">
                    Email
                  </label>
                  <Input
                    type="email"
                    className={`border bg-[#f2f4f7] focus-visible:ring-0 ${
                      errors?.email && "border-red-500"
                    }`}
                    autoComplete="off"
                    placeholder="example@gmail.com"
                    {...register("email")}
                  />
                  {errors?.email && (
                    <p className="text-base text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-y-2">
                  <label className="text-[15px] font-medium text-gray-400">
                    Giới tính
                  </label>
                  <Select
                    value={getGenderDisplayValue(genderValue)}
                    onValueChange={(value) => {
                      setValue("gender", value === "true");
                    }}
                  >
                    <SelectTrigger
                      className={`border bg-[#f2f4f7] focus-visible:ring-0 ${
                        errors?.gender && "border-red-500"
                      }`}
                    >
                      <SelectValue placeholder="Giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Genders.map((gender) => (
                          <SelectItem key={String(gender.value)} value={String(gender.value)}>
                            {gender.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors?.gender && (
                    <p className="text-base text-red-400">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className={`my-4 block w-full rounded-md py-2 ${
                  Object.keys(errors).length === 0
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