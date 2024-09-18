// AddImageModal.tsx
"use client";

import React, { useState } from 'react';
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
import axiosInstance from '@/app/Instance';
import { useToast } from '@/hooks/use-toast';

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
    fetchData: any
}

interface ImageData {
    image: string;
    isFav: boolean;
}

type FormData = {
    picture: FileList;
};

const AddImageModal: React.FC<AddImageModalProps> = ({ open, onOpenChange, fetchData }) => {
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const fileCount = data.picture.length;
        for (let i = 0; i < fileCount; i++) {
            const file = data.picture[i];
            const imageUrl = URL.createObjectURL(file);

            const imageData: ImageData = {
                image: imageUrl,
                isFav: false,
            };
            try {
                await axiosInstance.post('/gallery', imageData)
                fetchData();
                toast({
                    title: 'Image Added SuccessFully',
                    variant: 'default',
                })

            } catch (error) {
                console.log(error)
            }

        }
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

export default AddImageModal;
