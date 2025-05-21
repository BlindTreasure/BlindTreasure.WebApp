
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { FaQuestionCircle } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { IoSettingsSharp } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { Backdrop } from "@/components/backdrop";
import { openMessageUser } from "@/stores/difference-slice";
import { useRouter } from "next/navigation";
import { FaReceipt } from "react-icons/fa";
import useLogout from "@/hooks/use-logout";

interface AvatarMenuProps {
  onCloseTooltip: () => void;
}

export default function AvatarMenu({ onCloseTooltip }: AvatarMenuProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userState = useAppSelector((state) => state.userSlice);
  const { handleLogout } = useLogout();

  const onLogout = () => {
    handleLogout(); 
  };

  const handleOpenTabMessage = () => {
    dispatch(openMessageUser());
  };

  const handleNavigate = (index: number) => {
    switch (index) {
      case 1: {
        router.push("/profile/information");
        onCloseTooltip();
        break;
      }
      case 2: {
        router.push("/admin/dashboard");
        onCloseTooltip();
        break;
      }
      case 3: {
        onCloseTooltip();
        handleOpenTabMessage();
        break;
      }
      case 4: {
        router.push("/uploadfile");
        onCloseTooltip();
        break;
      }
      case 5: {
        router.push("/purchased");
        onCloseTooltip();
        break;
      }
      default:
        break;
    }
  };
  
  return (
    <div className="z-10 absolute mt-2 bg-white divide-y ml-24 sm:-ml-4 divide-gray-100 rounded-lg shadow-box md:w-72 w-64 md:right-0 sm:left-auto left-1/2 -translate-x-1/2 sm:translate-x-0 overflow-hidden">
      <div
        className="px-4 py-3 text-lg text-gray-900 hover:bg-gray-200 select-none cursor-pointer"
        onClick={() => {
          if (userState?.user?.roleName === "Customer") {
            handleNavigate(1);
          }
        }}
      >
        <div className="font-bold">Xin chào</div>
        <div className="text-xs text-gray-500 truncate">
          {userState.user?.fullName}
        </div>
      </div>
      {userState.user?.roleName === "Customer" && (
        <ul
          className="py-2 text-sm text-gray-700"
          aria-labelledby="avatarButton"
        >
          <li>
            <div
              className="flex items-center justify-between px-4 py-2 bg-white rounded-lg hover:bg-gray-200 cursor-pointer"
              onClick={() => handleNavigate(5)}
            >
              <div className="flex items-center">
                <FaReceipt
                  className="p-1 bg-gray-300 text-black rounded-full mr-2"
                  size={30}
                />
                <span className="text-black">Sản phẩm đã mua</span>
              </div>
              <FiChevronRight className="text-gray-500" size={24} />
            </div>
          </li>
          <li>
            <div
              onClick={() => handleNavigate(1)}
              className="cursor-pointer flex items-center justify-between px-4 py-2 bg-white rounded-lg hover:bg-gray-200"
            >
              <div className="flex items-center">
                <IoSettingsSharp
                  className="p-1 bg-gray-300 text-black rounded-full mr-2"
                  size={30}
                />
                <span className="text-black">Hồ sơ cá nhân</span>
              </div>
              <FiChevronRight className="text-gray-500" size={24} />
            </div>
          </li>
          <li>
            <div
              className="flex items-center justify-between px-4 py-2 bg-white rounded-lg hover:bg-gray-200 cursor-pointer"
              onClick={() => handleNavigate(3)}
            >
              <div className="flex items-center">
                <FaQuestionCircle
                  className="p-1 bg-gray-300 text-black rounded-full mr-2"
                  size={30}
                />
                <span className="text-black">Chat hỗ trợ</span>
              </div>
              <FiChevronRight className="text-gray-500" size={24} />
            </div>
          </li>
        </ul>
      )}
      <div className="py-1">
        <div
          onClick={onLogout}
          className="cursor-pointer flex items-center justify-between px-4 py-2 bg-white rounded-lg hover:bg-gray-200"
        >
          <div className="flex items-center">
            <LuLogOut
              className="p-1 bg-gray-300 text-black rounded-full mr-2"
              size={30}
            />
            <span className="text-black">Đăng xuất</span>
          </div>
        </div>
      </div>
    </div>
  );
}
