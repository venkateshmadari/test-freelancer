import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    close: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fetchData: () => void;
}

type FormData = {
    folder_name: string;
};

const MoveAlbum: React.FC<AddVideoModalProps> = ({ open, onOpenChange, fetchData, close }) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [albums, setAlbums] = useState<any>([]);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const GetFolders = async () => {
        try {
            const res = await axiosInstance.get('/folders');
            if (res?.data) {
                setAlbums(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        GetFolders();
    }, []);

    
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const targetFolder = albums.find((album: any) => album.id === data.folder_name);
    
        if (targetFolder) {
            console.log("Album ID:", targetFolder.id);
            console.log("Album Name:", targetFolder.folder_name);
        }
    };




    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Move Image To Album</DialogTitle>
                    <DialogDescription>
                        Fill in the form to move to folder
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-10'>
                        <Label htmlFor="folder_name">Select Album</Label>
                        <div className='mt-3'>
                            <Select
                                onValueChange={(value) => {
                                    setValue("folder_name", value); // Update the form state
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Album" />
                                </SelectTrigger>
                                <SelectContent>
                                    {albums.map((item: any) => (
                                        <SelectItem value={item.id} key={item.id}>
                                            {item.folder_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.folder_name && <span className='text-red-500 mt-5 text-sm'>{errors.folder_name.message}</span>}
                        </div>
                    </div>
                    <div className='text-end'>
                        <Button variant={'outline'} onClick={close} className='me-3'>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Moving...' : 'Move Image'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default MoveAlbum;
