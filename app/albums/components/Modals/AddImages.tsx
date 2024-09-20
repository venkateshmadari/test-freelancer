// AddImageModal.tsx
"use client";

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';
import axiosInstance from '@/app/Instance';

const formSchema = z.object({
    picture: z
        .instanceof(FileList)
        .refine(files => files.length > 0, {
            message: "At least one file is required.",
        }),
});

interface AddImageModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fetchData: () => void;
}

type FormData = {
    picture: FileList;
};

const AddImagesModal: React.FC<AddImageModalProps> = ({ open, onOpenChange, fetchData }) => {
    const { id } = useParams();
    console.log(id);
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const images = Array.from(data.picture).map(file => ({
            id: file.name,
            name: file.name,
            url: URL.createObjectURL(file),
        }));

        const folderData = {
            id: "9640",
            folder_name: "Demo",
            images,
        };
        try {
            const res = await axiosInstance.get(`/folders/${id}`);
            console.log(res?.data?.images)
            let updatedImages = { ...res?.data, images: [...images, ...res?.data?.images] }

            let updatedRes = await axiosInstance.put(`/folders/${id}`, updatedImages)
            if (updatedRes?.data) {
                fetchData();
            }
        } catch (error) {
            console.log(error);
        }

        console.log(JSON.stringify(folderData, null, 2));

        fetchData();
        toast({
            title: 'Images Added Successfully',
            variant: 'default',
        });

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add Image</DialogTitle>
                    <DialogDescription>
                        Upload Single Or Multiple Images
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                    <div className="grid w-full max-w-full items-center gap-1.5">
                        <Label htmlFor="picture" className='mb-3'>Upload Image</Label>
                        <Input
                            id="picture"
                            type="file"
                            multiple
                            {...register('picture')}
                        />
                        {errors.picture && <p className="text-red-500">{errors.picture.message}</p>}
                    </div>
                    <DialogFooter className='mt-5'>
                        <Button variant={'outline'} onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Add Image</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddImagesModal;
