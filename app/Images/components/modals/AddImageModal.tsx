import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/app/Instance";


interface FormData {
    album: string;
    image: FileList | null;
}

const formSchema = z.object({
    album: z.string().nonempty({ message: "Album is required." }),
    image: z.instanceof(FileList).refine((files) => files.length > 0, {
        message: "At least one image is required.",
    }),
});

interface AddImageModalProps {
    open: boolean;
    onClose: () => void;
    albums: { id: string; albumName: string }[];
    onAddImage: () => void;
}

export function AddImageModal({
    open,
    onClose,
    albums,
    onAddImage,
}: AddImageModalProps) {
    const { toast } = useToast();
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            album: "",
            image: null,
        },
    });



    const onSubmit = async (data: FormData) => {
        const uniqueId = Date.now().toString();

        if (data.image) {
            const files = Array.from(data.image);

            const fileDetailsList = files.map((file) => ({
                id: uniqueId,
                albumName: data.album,
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                imageUrl: URL.createObjectURL(file),
            }));

            try {
                const formData = new FormData();
                fileDetailsList.forEach((fileDetails) => {
                    formData.append('fileDetails', JSON.stringify(fileDetails));
                });
                files.forEach((file) => {
                    formData.append('images', file);
                });

                await axiosInstance.post('/workImages', formData);

                toast({
                    variant: "default",
                    title: "Success",
                    description: "Form data and images uploaded successfully.",
                });
            } catch (error) {
                console.error("Error uploading files:", error);
                toast({
                    variant: "default",
                    title: "Upload Failed",
                    description: "There was an error uploading your files.",
                });
            }
        } else {
            console.log("No files uploaded.");
            toast({
                variant: "default",
                title: "No Files",
                description: "No files were uploaded.",
            });
        }

        onClose();
    };



    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Image</DialogTitle>
                    <DialogDescription>
                        Upload the Image and Select The Album
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="albumSelect">Album</Label>
                        <Controller
                            name="album"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    onValueChange={(value) => field.onChange(value)}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an album" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {albums.map((album) => (
                                            <SelectItem key={album.id} value={album.albumName}>
                                                {album.albumName}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="General">General</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.album && (
                            <p className="text-red-500">{errors.album.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="imageUpload">Upload Image</Label>
                        <Controller
                            name="image"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setValue("image", e.target.files);
                                        } else {
                                            setValue("image", null);
                                        }
                                    }}
                                />
                            )}
                        />
                        {errors.image && (
                            <p className="text-red-500">{errors.image.message}</p>
                        )}
                    </div>
                    <DialogFooter className="mt-3">
                        <Button type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Add Image</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
