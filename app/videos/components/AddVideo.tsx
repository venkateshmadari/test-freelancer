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
    title: z.string().min(1, { message: "Title is required." }),
    video: z.string().min(1, { message: "Embedded code is required." }),
});

interface AddVideoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fetchData: () => void;
}

type FormData = {
    title: string;
    video: string;
};

const AddVideo: React.FC<AddVideoModalProps> = ({ open, onOpenChange, fetchData }) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });


    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/albums', data);
            if (response && response.data) {
                fetchData();
                reset();
                toast({
                    title: 'Video Added Successfully',
                    description: `Video titled "${response.data.title}" added successfully!`,
                    variant: 'default',
                });
                setTimeout(() => onOpenChange(false), 2000);
            }
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error adding video',
                description: 'Something went wrong. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add Video</DialogTitle>
                    <DialogDescription>
                        Fill in the form to add the video
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-5'>
                        <Label htmlFor="title">Title</Label>
                        <Input type="text"  {...register('title')} className='mt-5 mb-3' placeholder='Enter Your Title' />
                        {errors.title && <span className='text-red-500 mt-5 text-sm'>{errors.title.message}</span>}
                    </div>
                    <div className='mb-5'>
                        <Label htmlFor="video">Video Embedded Code</Label>
                        <Input
                            type="text"

                            className='mt-3 mb-3'
                            {...register('video')}
                            placeholder="<iframe src='...' width='...' height='...' ></iframe>"
                        />
                        {errors.video && <span className='text-red-500 mt-5 text-sm'>{errors.video.message}</span>}
                    </div>
                    <div className='text-end'>
                        <Button type="submit">Add Video</Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddVideo;
