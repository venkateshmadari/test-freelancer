"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Table, TableHeader, TableRow, TableBody, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FolderSymlink, Plus, Trash } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '../Instance';
import { AddImageModal } from './components/modals/AddImageModal';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Album {
    id: string;
    albumName: string;
}

interface WorkImage {
    id: string;
    url: string;
    albumName: string;
    status: string;
}

const Demo: React.FC = () => {
    const { toast } = useToast();
    const [albumImages, setAlbumImages] = useState<WorkImage[]>([]);
    const [addModal, setAddModal] = useState<boolean>(false);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getImages = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/workImages');
            if (res?.data) {
                setAlbumImages(res.data);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Unable to fetch images.",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const getAlbums = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/albums');
            if (res?.data) {
                setAlbums(res.data);
            }
        } catch (error) {
            console.error("Error fetching albums:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Unable to fetch albums.",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        getImages();
        getAlbums();
    }, [getImages, getAlbums]);

    const handleAddImage = async () => {
        await getImages(); // Refresh the image list after adding
    };

    return (
        <div>
            <Card>
                <CardHeader>
                    <div className='w-full h-auto flex justify-between items-center'>
                        <div>
                            <CardTitle className="text-lg md:text-2xl font-semibold">Work Images</CardTitle>
                            <CardDescription className='text-xs mt-1'>Overall {albumImages.length} Work Images</CardDescription>
                        </div>
                        <div>
                            <Button onClick={() => setAddModal(true)} disabled={loading}>
                                <Plus className="mr-2 h-4 w-4" /> Add Image
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>S.NO</TableHead>
                                    <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>IMAGE</TableHead>
                                    <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold min-w-50'>ALBUM NAME</TableHead>
                                    <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>STATUS</TableHead>
                                    <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold text-end'>ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {albumImages.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{index + 1}</TableCell>
                                        <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>
                                            <Image src={item.url} alt='Image' width={100} height={100} />
                                        </TableCell>
                                        <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{item.albumName}</TableCell>
                                        <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>
                                            <Badge variant={item.albumName === "General" ? "success" : "secondary"}>
                                                {item.albumName === "General" ? "General Photos" : "Album Photos"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='text-end'>
                                            <Button variant="outline" size="icon" className='me-3'>
                                                <FolderSymlink className='h-4 w-4' />
                                            </Button>
                                            <Button variant="outline" size="icon" className='me-3'>
                                                <Trash className='h-4 w-4' />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* AddImageModal Component */}
            <AddImageModal
                open={addModal}
                onClose={() => setAddModal(false)}
                albums={albums}
                onAddImage={handleAddImage}
            />

            {/* Move Modal */}
            <Dialog open={false} onOpenChange={() => { }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Move Image Folders</DialogTitle>
                        <DialogDescription>
                            Select the album to move the image
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Label htmlFor='albumSelect'>Album</Label>
                        <div className='mt-3'>
                            <Select name='albumSelect'>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an album" />
                                </SelectTrigger>
                                <SelectContent>
                                    {albums.map(album => (
                                        <SelectItem key={album.id} value={album.albumName}>{album.albumName}</SelectItem>
                                    ))}
                                    <SelectItem value="General">General</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className='mt-3'>
                        <Button type='button' onClick={() => { }}>Cancel</Button>
                        <Button type='button'>Move</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={false} onOpenChange={() => { }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='mt-3'>
                        <Button type='button' onClick={() => { }}>Cancel</Button>
                        <Button type='button'>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Demo;
