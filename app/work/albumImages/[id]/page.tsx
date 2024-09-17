"use client";
import React, { useEffect, useState, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import axiosInstance from '@/app/Instance';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import No_Data from "../../../../img/not_found.png";

interface Image {
    id: string;
    imageUrl: string;
}

interface Album {
    albumName: string;
    images: Image[];
}

interface AlbumImagesProps {
    params: {
        id: string;
    };
}

const AlbumImages: React.FC<AlbumImagesProps> = ({ params }) => {
    const [album, setAlbum] = useState<Album | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [addModal, setAddModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(5) ;
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const [imageToDelete, setImageToDelete] = useState<Image | null>(null);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getAlbumId = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get<Album>(`/albums/${params.id}`);
            setAlbum(res.data);
        } catch (error) {
            console.error("Error Fetching The Album Details", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAlbumId();
    }, [params.id]);

    const handleAddImages = async () => {
        if (!album) return;
        try {
            setLoading(true);
            const imagesData: Image[] = images.map((file) => ({
                id: new Date().toISOString(),
                imageUrl: URL.createObjectURL(file),
            }));

            const updatedAlbum = {
                ...album,
                images: [...album.images, ...imagesData],
            };

            const res = await axiosInstance.put<Album>(`/albums/${params.id}`, updatedAlbum);
            setAlbum(res.data);
            setImages([]);
            setAddModal(false);
        } catch (error) {
            console.error("Error Adding The Images", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChanges = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setImages(files);
    };

    const handleDeleteImage = async () => {
        if (!imageToDelete || !album) return;
        try {
            setLoading(true);
            const updatedImages = album.images.filter(img => img.id !== imageToDelete.id);
            const updatedAlbum = {
                ...album,
                images: updatedImages,
            };

            await axiosInstance.put<Album>(`/albums/${params.id}`, updatedAlbum);
            setAlbum(updatedAlbum);
            setOpenDeleteModal(false);
        } catch (error) {
            console.error("Error Deleting The Image", error);
        } finally {
            setLoading(false);
        }
    };

    if (!album) return null;

    const totalPages = Math.ceil(album.images.length / itemsPerPage);
    const currentAlbumImages = album.images.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Card>
                    <CardHeader>
                        <div className='w-full h-auto flex justify-between items-center'>
                            <div>
                                <CardTitle className="text-lg md:text-2xl font-semibold">{album.albumName} Album</CardTitle>
                                <CardDescription className='text-xs mt-1'>Overall {album.images.length} Work Images</CardDescription>
                            </div>
                            <Button onClick={() => setAddModal(true)}>
                                <Plus className="mr-2 h-4 w-4" /> Add Album Image
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>S.NO</TableHead>
                                    <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>IMAGE</TableHead>
                                    <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentAlbumImages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center py-20">
                                        <Image src={No_Data} alt="No Users Found" className="mb-4 w-60 h-60" />
                                        <p className="text-heading-dark dark:text-[#FACC15] font-bold">No Images found matching your Album criteria.</p>
                                    </div>
                                ) : (
                                    currentAlbumImages.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                            <TableCell>
                                                <Image src={item.imageUrl} alt='Album_Image' width={80} height={80} />
                                            </TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    className='me-3'
                                                    onClick={() => {
                                                        setImageToDelete(item);
                                                        setOpenDeleteModal(true);
                                                    }}
                                                >
                                                    <Trash className='h-4 w-4' />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            <div className='mt-3'>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem aria-disabled={currentPage === 1}>
                            <PaginationPrevious onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) handlePageChange(currentPage - 1);
                            }} aria-label="Previous Page" />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index} aria-current={currentPage === index + 1 ? 'page' : undefined}>
                                <PaginationLink onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(index + 1);
                                }}>
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem aria-disabled={currentPage === totalPages}>
                            <PaginationNext onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) handlePageChange(currentPage + 1);
                            }} aria-label="Next Page" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <Dialog open={addModal} onOpenChange={setAddModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Image</DialogTitle>
                        <DialogDescription>
                            Upload the Image and Select The Album
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Label htmlFor='imageUpload'>Upload Image</Label>
                        <Input
                            id='imageUpload'
                            type='file'
                            accept='image/*'
                            multiple
                            onChange={handleFileChanges}
                            className='mt-3'
                        />
                    </div>
                    <DialogFooter className='mt-3'>
                        <Button type='button' onClick={() => setAddModal(false)}>Cancel</Button>
                        <Button type='button' onClick={handleAddImages}>Add Image</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will delete the image and it cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpenDeleteModal(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteImage}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AlbumImages;
