"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddAddressDialog from "@/components/alldialog/dialogaddress";
import useGetAllAddress from "../hooks/useGetAllAddress";
import { Backdrop } from "@/components/backdrop";
import useSetDefaultAddress from "../hooks/useSetDefaultAddress";
import useDeleteAddress from "../hooks/useDeleteAddress";

export default function AddressList() {
    const [showDialog, setShowDialog] = useState(false);
    const [addresses, setAddresses] = useState<API.ResponseAddress[]>([]);
    const { getAllAddressApi, isPending } = useGetAllAddress();
    const { onSetDefault, isPending: isSettingDefault } = useSetDefaultAddress();
    const { onDelete, isPending: isDeleting } = useDeleteAddress();
    const [editingAddress, setEditingAddress] = useState<API.ResponseAddress | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const res = await getAllAddressApi();
            if (res) setAddresses(res.value.data);
        })();
    }, []);

    const refreshList = async () => {
        const res = await getAllAddressApi();
        if (res) setAddresses(res.value.data);
    };

    const sortedAddresses = [...addresses].sort(
        (a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)
    );

    const handleDeleteClick = (addressId: string) => {
        setAddressToDelete(addressId);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (addressToDelete) {
            onDelete(addressToDelete, () => {
                refreshList();
                setAddressToDelete(null);
            });
        }
        setDeleteDialogOpen(false);
    };

    return (
        <>
            <div className="p-3 sm:p-6 bg-white rounded shadow mt-40">
                <div className="border border-b-0 p-3 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                        <h2 className="text-lg sm:text-xl font-semibold">Địa chỉ của tôi</h2>
                        <Button onClick={() => setShowDialog(true)} className="bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base w-full sm:w-auto">
                            + Thêm địa chỉ mới
                        </Button>
                    </div>
                </div>

                <div className="p-3 sm:p-6 border">
                    <h2 className="text-lg sm:text-xl font-semibold">Địa chỉ</h2>

                    {addresses.length === 0 ? (
                        <p className="text-gray-500 mt-4">Chưa có địa chỉ nào.</p>
                    ) : (
                        <div className="space-y-4">
                            {sortedAddresses.map((addr) => (
                                <div key={addr.id} className="space-y-3 border-b pb-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                            <div className="flex items-center gap-2 sm:gap-4 text-sm sm:text-lg">
                                                <p className="font-medium">{addr.fullName}</p>
                                                <div className="w-px h-4 sm:h-5 bg-gray-300" />
                                                <p>{addr.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 self-start sm:self-auto">
                                            <button className="border rounded-sm border-red-500 px-2 py-1 sm:p-2 text-red-500 text-xs sm:text-sm" onClick={() => {
                                                setEditingAddress(addr);
                                                setShowDialog(true);
                                            }}>Cập nhật</button>
                                            <button className="border rounded-sm border-red-500 px-2 py-1 sm:p-2 text-red-500 text-xs sm:text-sm" onClick={() => handleDeleteClick(addr.id)}
                                                disabled={isDeleting}>Xóa</button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                                        <div className="flex-1">
                                            <p className="text-sm sm:text-lg text-gray-600 break-words">{addr.addressLine}</p>
                                            <p className="text-sm sm:text-lg text-gray-600 break-words">
                                                {addr.postalCode}, {addr.city}, {addr.province}, {addr.country}
                                            </p>
                                        </div>

                                        {!addr.isDefault && (
                                            <div className="self-start sm:self-auto">
                                                <button
                                                    disabled={isSettingDefault}
                                                    onClick={() =>
                                                        onSetDefault(addr.id, async () => {
                                                            refreshList();
                                                        })
                                                    }
                                                    className={`border rounded-sm border-blue-500 px-2 py-1 sm:p-2 text-blue-500 text-xs sm:text-sm whitespace-nowrap ${isSettingDefault ? "opacity-50 cursor-not-allowed" : ""
                                                        }`}
                                                >
                                                    {isSettingDefault ? "Đang thiết lập..." : "Thiết lập mặc định"}
                                                </button>
                                            </div>
                                        )}

                                    </div>

                                    {addr.isDefault && (
                                        <div>
                                            <button className="border rounded-sm border-green-500 px-2 py-1 sm:p-2 text-green-500 text-xs sm:text-sm">
                                                Mặc định
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {showDialog && (
                    <AddAddressDialog
                        open={showDialog}
                        onClose={async () => {
                            setShowDialog(false);
                            setTimeout(() => setEditingAddress(null), 300);
                            refreshList();
                        }}
                        editingAddress={editingAddress}
                    />
                )}

                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
                            <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleConfirmDelete}
                                className="bg-red-500 hover:bg-red-600"
                            >
                                Xóa
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Backdrop open={isPending} />
            </div>
        </>
    );
}
