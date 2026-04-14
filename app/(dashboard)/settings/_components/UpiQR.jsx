import {useDropzone} from "react-dropzone";
import {cn} from "@/lib/utils";
import Image from "next/image";

export default function UpiQR({value, onChange, label = 'Upload UPI QR Code'}) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
    const {getRootProps, getInputProps} = useDropzone({
        accept: {"image/*": []},
        multiple: false,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles?.length) {
                onChange(acceptedFiles[0]);
            }
        }
    })
    const previewUrl = value
        ? typeof value === "string"
            ? value.startsWith("http")
                ? value
                : `${API_BASE_URL}${value}`
            : URL.createObjectURL(value)
        : null;

    return (
        <div className={'space-y-2'}>
            <p className={'text-sm font-medium'}>{label}</p>
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 cursor-pointer",
                    "flex flex-col items-center justify-center gap-2",
                    "hover:border-blue-500"
                )}
            >
                <input {...getInputProps()} />
                {previewUrl ? (
                    <div className="relative w-40 h-40">
                        <img
                            src={previewUrl}
                            alt="Preview Image"
                            className="w-40 h-40 object-contain rounded"
                        />
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm hover:text-blue-500">Drag and drop your QR Code here, or click
                        to select</p>
                )
                }
            </div>
        </div>
    )
}