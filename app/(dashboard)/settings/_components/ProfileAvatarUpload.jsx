'use client'
import {useDropzone} from "react-dropzone";
import {Plus} from "lucide-react";
import {cn} from "@/lib/utils";
import {useEffect, useMemo} from "react";

export default function ProfileAvatarUpload({
                                                value,
                                                onChange,
                                                label = "Upload profile picture",
                                                size = 120,
                                            }) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    const {getRootProps, getInputProps} = useDropzone({
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
        <div className="space-y-2">
            <p className="text-sm font-medium">{label}</p>

            <div
                {...getRootProps()}
                className={cn(
                    "rounded-full border-2 border-dashed cursor-pointer",
                    "flex items-center justify-center text-center",
                    "hover:border-blue-500 transition"
                )}
                style={{width: size, height: size}}
            >
                <input {...getInputProps()} />

                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Profile Preview"
                        className="w-full h-full rounded-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        <Plus className="w-6 h-6 mb-1"/>
                        <span className="text-xs">Upload</span>
                    </div>
                )}
            </div>
        </div>
    );
}