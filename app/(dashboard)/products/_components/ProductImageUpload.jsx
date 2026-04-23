'use client'
import {useDropzone} from "react-dropzone";
import {Plus, Image as ImageIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {useEffect, useMemo} from "react";

export default function ProductImageUpload({
                                               value,
                                               onChange,
                                               label = "Product Image",
                                               className
                                           }) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: {"image/*": []},
        multiple: false,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles?.length) {
                onChange(acceptedFiles[0]);
            }
        },
    });

    const previewUrl = useMemo(() => {
        if (!value) return null;

        if (typeof value === "string") {
            return value.startsWith("http")
                ? value
                : `${API_BASE_URL}${value}`;
        }

        return URL.createObjectURL(value);
    }, [value, API_BASE_URL]);

    useEffect(() => {
        return () => {
            if (value instanceof File && previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [value, previewUrl]);

    return (
        <div className={cn("space-y-2", className)}>
            <p className="text-sm font-medium">{label}</p>

            <div
                {...getRootProps()}
                className={cn(
                    "w-full h-48 rounded-xl border-2 border-dashed cursor-pointer",
                    "flex flex-col items-center justify-center text-center",
                    "transition-all duration-200",
                    isDragActive ? "border-blue-500 bg-blue-50/50" : "border-border hover:border-blue-400 hover:bg-muted/50"
                )}
            >
                <input {...getInputProps()} />

                {previewUrl ? (
                    <div className="relative w-full h-full p-2">
                        <img
                            src={previewUrl}
                            alt="Product Preview"
                            className="w-full h-full rounded-lg object-contain"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 rounded-lg">
                            <Plus className="w-8 h-8 text-white drop-shadow-md"/>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                        <div className="bg-muted p-3 rounded-full">
                            <ImageIcon className="w-6 h-6 text-gray-400"/>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-muted-foreground">Click to upload or drag and drop</span>
                            <span className="text-xs text-gray-400">PNG, JPG or WEBP (max. 5MB)</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
