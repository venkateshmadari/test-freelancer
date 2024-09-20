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
    folder_name: z.string().min(1, { message: "Folder name is required." }),
});

interface AddVideoModalProps {
    close: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fetchData: () => void;
}

type FormData = {
    id: any;
    folder_name: string;
    images: [];
};

const AddAlbum: React.FC<AddVideoModalProps> = ({ open, onOpenChange, fetchData, close }) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true);
        try {
            const generateRandomId = () => {
                return Math.floor(1000 + Math.random() * 9000).toString(); 
            };

            let updated = {
                id: generateRandomId(),
                folder_name: data.folder_name,
                images: [],
            };

            const response = await axiosInstance.post('/folders', updated);
            if (response && response.data) {
                const { folder_name, images } = response.data;

                console.log('Response:', response.data);

                fetchData();
                reset();

                toast({
                    title: 'Folder Added Successfully',
                    description: `Folder named "${folder_name}" added successfully!`,
                    variant: 'default',
                });
                setTimeout(() => onOpenChange(false), 2000);
                close();
            }
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error adding folder',
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
                    <DialogTitle>Add Folder</DialogTitle>
                    <DialogDescription>
                        Fill in the form to add the folder
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-10'>
                        <Label htmlFor="folder_name">Folder Name</Label>
                        <Input type="text" {...register('folder_name')} className='mt-5 mb-3' placeholder='Enter Your Folder Name' />
                        {errors.folder_name && <span className='text-red-500 mt-5 text-sm'>{errors.folder_name.message}</span>}
                    </div>
                    <div className='text-end'>
                        <Button variant={'outline'} onClick={close} className='me-3'>Cancel</Button>
                        <Button type="submit">Add Folder</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddAlbum;
