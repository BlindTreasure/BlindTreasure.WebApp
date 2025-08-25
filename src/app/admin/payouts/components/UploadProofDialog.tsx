"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useConfirmPayout from "../hooks/useConfirmPayout";
import { X } from "lucide-react";

type Props = {
    payoutId: string;
    onUploaded: () => void;
};

export default function UploadProofDialog({ payoutId, onUploaded }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const { onSubmit, isSubmitting } = useConfirmPayout(payoutId);

    const handleUpload = () => {
        if (!files.length) return;
        onSubmit(
            { files },
            () => {
                onUploaded();
                setFiles([]);
            },
            (err) => {
                console.error("Upload proof failed", err);
            }
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);

        const merged = [...files, ...newFiles].slice(0, 6);
        setFiles(merged);
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-green-500 hover:bg-opacity-80">
                    Tải ảnh lên
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Tải ảnh minh chứng thanh toán</DialogTitle>
                </DialogHeader>

                <label
                    className={`border-2 border-dashed rounded-lg p-6 text-center w-full block
    ${files.length >= 6 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={files.length >= 6}
                    />
                    <div className="flex flex-col items-center gap-1 text-gray-500">
                        <span className="text-sm font-medium">
                            Thêm hình ảnh ({files.length}/6)
                        </span>
                        <span className="text-xs">Cho phép PNG, JPG, SVG, WEBP, GIF</span>
                    </div>
                </label>

                {files.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-4">
                        {files.map((file, i) => {
                            const preview = URL.createObjectURL(file);
                            return (
                                <div key={i} className="relative group">
                                    <img
                                        src={preview}
                                        alt={`preview-${i}`}
                                        className="w-full h-20 object-cover rounded-md border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(i)}
                                        className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        size="sm"
                        onClick={handleUpload}
                        disabled={isSubmitting || files.length === 0}
                    >
                        {isSubmitting ? "Đang tải..." : "Tải lên"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
