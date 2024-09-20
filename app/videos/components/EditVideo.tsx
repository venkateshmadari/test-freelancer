"use client";

import React, { useEffect, useState } from 'react';
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
    title: z.string().min(1, { message: "Title is required." }),
    video: z.string().optional(),
});

interface EditVideoProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fetchData: () => void;
    videoId: any;
}

type FormData = {
    title: string;
    video?: string;
};

const EditVideo: React.FC<EditVideoProps> = ({ open, onOpenChange, fetchData, videoId }) => {
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const GetVideoId = async () => {
        try {
            const res = await axiosInstance.get(`/albums/${videoId}`);
            if (res && res.data) {
                reset({
                    title: res.data.title,
                    video: res.data.video,
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (videoId) {
            GetVideoId();
        }
    }, [videoId]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const response = await axiosInstance.patch(`/albums/${videoId}`, { title: data.title });
            fetchData();
            toast({
                title: 'Video Title Updated Successfully',
                description: `Video titled "${response.data.title}" updated successfully!`,
                variant: 'default',
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error updating video title',
                description: 'Something went wrong. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Video Title</DialogTitle>
                    <DialogDescription>
                        Fill in the form to update the video title
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-5'>
                        <Label htmlFor="title">Title</Label>
                        <Input type="text" id="title" {...register('title')} className='mt-5' placeholder='Enter Your Title' />
                        {errors.title && <span className='text-red-500 mt-5'>{errors.title.message}</span>}
                    </div>
                    <div className='mb-5'>
                        <Label htmlFor="video">Video Embedded Code</Label>
                        <Input
                            type="text"
                            id="video"
                            className='mt-3'
                            {...register('video')}
                            placeholder="<iframe src='...' width='...' height='...' ></iframe>"
                            disabled
                        />
                        {errors.video && <span>{errors.video.message}</span>}
                    </div>
                    <div className='text-end'>
                        <Button type="submit">Update</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditVideo;
