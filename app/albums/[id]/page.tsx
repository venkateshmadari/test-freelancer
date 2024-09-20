"use client";
import axiosInstance from '@/app/Instance';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Heart, Plus, Trash } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import AddImagesModal from '../components/Modals/AddImages';
import DeletModel from '@/app/gallery/components/Modals/DeleteModal';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

interface Album {
    id: number;
    folder_name: string;
    images: any[];
}

const SingleAlbum = () => {
    const [album, setAlbum] = useState<Album | null>(null);
    const [AddImageModal, setAddImageModal] = useState<boolean>(false);
    const [DeleteModal, setDeleteModal] = useState<boolean>(false);
    const [DeleteId, setDeleteId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImages, setSelectedImages] = useState<any>([]);
    const [currentCover, setCurrentCover] = useState<any | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(7);
    const { id } = useParams();
    const { toast } = useToast();

    const getAlbumId = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/folders/${id}`);
            if (res && res.data) {
                setAlbum(res.data);
                console.log("Single Album:", res.data);
            }
        } catch (error) {
            console.error(error);
            setError("Failed to fetch album details.");
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (item: any) => {
        const isCurrentlyFav = selectedImages.some((fav: any) => fav.id === item.id);

        if (isCurrentlyFav) {
            const updatedSelectedImages = selectedImages.filter((fav: any) => fav.id !== item.id);
            setSelectedImages(updatedSelectedImages);
            console.log("Selected Images:", updatedSelectedImages);
            toast({ description: "Removed from favorites." });
        } else {
            if (selectedImages.length < 6) {
                const updatedSelectedImages = [...selectedImages, item];
                setSelectedImages(updatedSelectedImages);
                console.log("Selected Images:", updatedSelectedImages);
                toast({
                    title: `${selectedImages.length + 1} / 6 Added`,
                    description: 'Image Added To Favorites'
                });
            } else {
                toast({
                    title: '6 Images Added',
                    variant: 'destructive',
                    description: "You cannot add more than 6 images."
                });
            }
        }
    };

    const selectCoverPhoto = (item: any) => {
        if (currentCover?.id === item.id) {
            setCurrentCover(null);
            console.log("Cover photo deselected");
            toast({
                title: "Removed Cover Image",
                variant: 'destructive',
            })
        } else {
            setCurrentCover(item);
            console.log("Cover photo selected:", {
                albumId: album?.id,
                albumName: album?.folder_name,
                coverImage: item
            });
            toast({
                title: `${album?.folder_name} Cover Photo Added Successfully`,
                description: 'Uploaded Successfully',
                variant: 'default',
            })
        }
    };

    const deleteHandler = async (id: any) => {
        try {
            const { data } = await axiosInstance.get('/folders/' + id);

            console.log("Deleting Data:", { data });

            if (data) {
                const DeleteImageId = data.images?.filter((item: any) => item?.id !== id);
                let updatedData = {
                    ...data, images: DeleteImageId
                };
                const res = await axiosInstance.put(`/folders/` + id, updatedData);

                if (res && res?.data) {
                    setAlbum(updatedData);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAlbumId();
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const totalImages = album?.images?.length || 0;
    const totalPages = Math.ceil(totalImages / itemsPerPage);
    const currentImages = album?.images?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

    return (
        <div>
            {loading ? (
                // Display skeletons while loading
                <div className="space-y-4">
                    <Skeleton className="h-8 w-[250px]" />
                    <Skeleton className="h-6 w-[150px]" />
                    <Table>
                        <TableBody>
                            {[...Array(itemsPerPage)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-12 w-12 rounded" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-10" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : album ? (
                <div>
                    <Card>
                        <CardHeader>
                            <div className='w-full h-auto flex justify-between items-center'>
                                <div>
                                    <CardTitle className="text-lg md:text-2xl font-semibold">{album.folder_name}</CardTitle>
                                    <CardDescription className='text-xs mt-1'>Overall {totalImages} Images</CardDescription>
                                </div>
                                <div>
                                    <Button onClick={() => setAddImageModal(true)}>
                                        <Plus className="mr-2 h-4 w-4" /> Add Images
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>S.NO</TableHead>
                                        <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>THUMBNAIL</TableHead>
                                        <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>SELECT FAV ({selectedImages.length} / 6)</TableHead>
                                        <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>SET COVER</TableHead>
                                        <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold text-end'>ACTIONS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentImages.map((item: any, index: number) => (
                                        <TableRow key={item.id}>
                                            <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <Image
                                                    src={item.url}
                                                    alt={item.name}
                                                    width={80}
                                                    height={30}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant={selectedImages.some((fav: any) => fav.id === item.id) ? "default" : "outline"}
                                                    size="icon"
                                                    onClick={() => toggleFavorite(item)}
                                                    className="me-3"
                                                >
                                                    <Heart className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant={currentCover?.id === item.id ? "default" : "outline"}
                                                    onClick={() => selectCoverPhoto(item)}
                                                    className="me-3"
                                                >
                                                    {currentCover?.id === item.id ? "Deselect" : "Select"}
                                                </Button>
                                            </TableCell>
                                            <TableCell className='text-end'>
                                                <Button variant={'outline'} onClick={() => {
                                                    setDeleteId(item.id);
                                                    setDeleteModal(true);
                                                }}>
                                                    <Trash className='w-4 h-4' />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <AddImagesModal open={AddImageModal} onOpenChange={setAddImageModal} fetchData={getAlbumId} />
                    <DeletModel open={DeleteModal} onOpenChange={setDeleteModal} text={"Image"} onClick={deleteHandler} DeleteText={'Delete Image'} />

                    <div className='mt-3'>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem aria-disabled={currentPage === 1}>
                                    <PaginationPrevious onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) handlePageChange(currentPage - 1);
                                    }}
                                        aria-label="Previous Page"
                                    />
                                </PaginationItem>
                                {[...Array(totalPages)].map((_, index) => (
                                    <PaginationItem key={index} aria-current={currentPage === index + 1 ? 'page' : undefined}>
                                        <PaginationLink
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(index + 1);
                                            }}
                                        >
                                            {index + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem aria-disabled={currentPage === totalPages}>
                                    <PaginationNext onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                    }}
                                        aria-label="Next Page"
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            ) : (
                <div>No album found.</div>
            )}
        </div>
    );
};

export default SingleAlbum;
