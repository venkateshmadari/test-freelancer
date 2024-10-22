"use client";
import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { FolderSymlink, Heart, Plus, Trash } from "lucide-react";
import AddImageModal from "./components/Modals/AddModal";
import axiosInstance from "../Instance";
import Image from "next/image";
import DeletModel from "./components/Modals/DeleteModal";
import { useToast } from "@/hooks/use-toast";
import No_Data from "../../img/not_found.png";
import { Skeleton } from "@/components/ui/skeleton";
import MoveAlbum from "./components/Modals/MoveAlbum";

interface Gallery {
    id: string;
    image: string;
    isFav: boolean;
}

const Gallery = () => {
    const [Images, setImages] = useState<Gallery[]>([]);
    const [AddModal, setAddModal] = useState<boolean>(false);
    const [DeleteId, setDeleteId] = useState<string | null>(null);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [galleryFav, setGalleryFav] = useState<Gallery[]>([]);
    const [AlbumModal, setAlbumModal] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(5);
    const { toast } = useToast();
    const [loading, setLoading] = useState<boolean>(true);

    const GetImages = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/gallery");
            if (res) {
                setImages(res.data);
            }
        } catch (error) {
            console.error(error);
            toast({ description: "Failed to load images." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetImages();
    }, []);

    const toggleFavorite = async (item: Gallery) => {
        const isCurrentlyFav = galleryFav.some(fav => fav.id === item.id);

        if (isCurrentlyFav) {
            setGalleryFav(galleryFav.filter(fav => fav.id !== item.id));
            toast({ description: "Removed from favorites." });
        } else {
            if (galleryFav.length < 6) {
                setGalleryFav([...galleryFav, item]);
                try {
                    await axiosInstance.post('/galleryFav', [...galleryFav, item]);
                    toast({
                        title: `${galleryFav.length + 1} / 6 Added`,
                        description: 'Image Added To Favorites'
                    });
                } catch (error) {
                    console.log(error);
                    toast({ description: "Failed to update favorites." });
                }
            } else {
                toast({
                    title: '6 Images Added',
                    variant: 'destructive',
                    description: "More Than 6 Cannot Be Added"
                });
            }
        }
    };

    const DeleteHandler = async () => {
        if (DeleteId) {
            try {
                await axiosInstance.delete(`/gallery/${DeleteId}`);
                setImages(prevImages =>
                    prevImages.filter(image => image.id !== DeleteId)
                );
                setDeleteId(null);
                toast({ description: "Image deleted successfully.", variant: 'default' });
            } catch (error) {
                console.error(error);
                toast({ description: "Failed to delete image.", variant: 'destructive' });
            }
        }
        setDialogOpen(false);
    };

    const totalPages = Math.ceil(Images.length / itemsPerPage);
    const currentImages = Images.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const CloseMoveModal = () => {
        setAlbumModal(false);
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-lg md:text-2xl font-semibold">
                                Gallery
                            </CardTitle>
                            <CardDescription className="text-xs mt-1">
                                Overall {Images.length} Gallery Images
                            </CardDescription>
                        </div>
                        <div>
                            <Button onClick={() => setAddModal(true)}>
                                <Plus className="mr-2 h-4 w-4" /> Add Image
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-heading-dark dark:text-[#FACC15] font-bold">S.NO</TableHead>
                                <TableHead className="text-heading-dark dark:text-[#FACC15] font-bold">THUMBNAIL</TableHead>
                                <TableHead className="text-heading-dark dark:text-[#FACC15] font-bold">SELECT FAV ({galleryFav.length} / 6)</TableHead>
                                <TableHead className="text-heading-dark dark:text-[#FACC15] font-bold text-end">ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [...Array(itemsPerPage)].map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Skeleton className="h-4 w-8" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-8 w-8" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-8 w-8" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : currentImages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        <div className="flex flex-col items-center justify-center text-center py-20">
                                            <Image src={No_Data} alt="No Images Found" className="mb-4 w-60 h-60" />
                                            <p className="text-black dark:text-yellow-400">No Images Are Found For Your Criteria.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentImages.map((item: Gallery, index: number) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Image
                                                src={item.image}
                                                alt="Image Thumbnail"
                                                width={160}
                                                height={80}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant={galleryFav.some(fav => fav.id === item.id) ? "default" : "outline"}
                                                size="icon"
                                                onClick={() => toggleFavorite(item)}
                                                className="me-3"
                                            >
                                                <Heart className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-end">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="me-3"
                                                onClick={() => setAlbumModal(true)}
                                            >
                                                <FolderSymlink className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    setDeleteId(item.id);
                                                    setDialogOpen(true);
                                                }}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
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
                </CardContent>
            </Card>
      {/* Add Image Modal */}
      <AddImageModal
                open={AddModal}
                onOpenChange={setAddModal}
                fetchData={GetImages}
            />

            {/* Move Image Modal */}

            <MoveAlbum open={AlbumModal} onOpenChange={setAlbumModal} fetchData={GetImages} close={CloseMoveModal}/>

            {/* Delete Image Modal */}
            <DeletModel
                open={isDialogOpen}
                onOpenChange={setDialogOpen}
                onConfirm={DeleteHandler}
                text={"Image"}
                DeleteText={"Delete Image"}
            />
        </div>
    );
};

export default Gallery;
