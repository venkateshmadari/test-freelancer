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
    TableHead,
    TableRow,
    TableCell,
    TableHeader,
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
import { FolderSymlink, Heart, Pencil, Plus, Trash } from "lucide-react";
import AddVideo from "./components/AddVideo";
import axiosInstance from "../Instance";
import { Skeleton } from "@/components/ui/skeleton";
import No_Data from "../../img/not_found.png";
import Image from "next/image";
import DeletModel from "../gallery/components/Modals/DeleteModal";
import EditVideo from "./components/EditVideo";
import { useToast } from "@/hooks/use-toast";

interface Videos {
    id: any;
    video: any;
    isFav: boolean;
    title: string;
}

const Videos = () => {
    const [videos, setVideos] = useState<Videos[]>([]);
    const [addModal, setAddModal] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [DeleteModal, setDeleteModal] = useState<boolean>(false);
    const [DeleteId, setDeleteId] = useState<string | null>(null);
    const [VideoFav, setVideoFav] = useState<Videos[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(5);
    const { toast } = useToast();

    const getVideos = async () => {
        try {
            const res = await axiosInstance.get("/albums");
            if (res?.data) {
                setVideos(res?.data);
                console.log("All Videos:", res?.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getVideos();
    }, []);


    const DeleteHandler = async () => {
        if (DeleteId) {
            try {
                await axiosInstance.delete(`/albums/${DeleteId}`);
                setVideos(prevImages =>
                    prevImages.filter(image => image.id !== DeleteId)
                );
                setDeleteId(null);
                toast({ description: "Video deleted successfully.", variant: 'default' });
            } catch (error) {
                console.error(error);
                toast({ description: "Failed to delete image.", variant: 'destructive' });
            }
        }
        setDeleteModal(false);
    };

    const totalPages = Math.ceil(videos.length / itemsPerPage);
    const currentVideos = videos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    const toggleFavorite = async (item: Videos) => {
        const isCurrentlyFav = VideoFav.some(fav => fav.id === item.id);

        if (isCurrentlyFav) {
            setVideoFav(VideoFav.filter(fav => fav.id !== item.id));
            toast({ description: "Removed from favorites." });
        } else {
            if (VideoFav.length < 6) {
                setVideoFav([...VideoFav, item]);
                try {
                    await axiosInstance.post('/albumsFav', VideoFav);
                    toast({ description: "Added to favorites." });
                } catch (error) {
                    console.log(error);
                    toast({ description: "Failed to update favorites." });
                }
            } else {
                toast({
                    title: '6 Vidoes Added',
                    variant: 'destructive',
                    description: "More Than 6 Cannot Be Added"
                });
            }
        }
    };


    return (
        <div>
            <Card>
                <CardHeader>
                    <div className="w-full h-auto flex justify-between items-center">
                        <div>
                            <CardTitle className="text-lg md:text-2xl font-semibold">
                                Videos
                            </CardTitle>
                            <CardDescription className="text-xs mt-1">
                                Overall {videos.length} Videos
                            </CardDescription>
                        </div>
                        <div>
                            <Button onClick={() => setAddModal(true)}>
                                <Plus className="mr-2 h-4 w-4" /> Add Video
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <Table>
                            <TableBody>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Skeleton className="h-4 w-[50px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-12 w-[250px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-[200px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-[50px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-[80px]" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : currentVideos.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                <div className="flex flex-col items-center justify-center text-center py-20">
                                    <Image src={No_Data} alt="No Images Found" className="mb-4 w-60 h-60" />
                                    <p className="text-black dark:text-yellow-400">No Images Are Found For Your Criteria.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-heading-dark dark:text-[#FACC15] font-bold">
                                        S.NO
                                    </TableHead>
                                    <TableHead className="text-heading-dark dark:text-[#FACC15] font-bold">
                                        VIDEO THUMBNAIL
                                    </TableHead>
                                    <TableHead className="text-heading-dark dark:text-[#FACC15] font-bold">
                                        TITLE
                                    </TableHead>
                                    <TableHead className="text-heading-dark dark:text-[#FACC15] font-bold">
                                        SELECT FAV ({VideoFav.length} / 6)
                                    </TableHead>
                                    <TableHead className="text-heading-dark dark:text-[#FACC15] font-bold text-end">
                                        ACTIONS
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentVideos.map((item, index) => {
                                    const video = item.video.replace(
                                        '<iframe width="1280" height="720"',
                                        '<iframe width="250" height="120"'
                                    );
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-semibold">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div
                                                    contentEditable="true"
                                                    dangerouslySetInnerHTML={{ __html: video }}
                                                ></div>
                                            </TableCell>
                                            <TableCell className="font-semibold text-heading-dark dark:text-neutral-400">
                                                {item.title}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant={VideoFav.some(fav => fav.id === item.id) ? "default" : "outline"}
                                                    size="icon"
                                                    onClick={() => toggleFavorite(item)}
                                                    className="me-3"
                                                >
                                                    <Heart className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                            <TableCell className="text-end">
                                                <Button variant="outline" size="icon" className="me-3" onClick={() => setEditModal(true)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="icon" className="me-3" onClick={() => {
                                                    setDeleteId(item.id);
                                                    setDeleteModal(true);
                                                }}>
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <div className="mt-3">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem aria-disabled={currentPage === 1}>
                            <PaginationPrevious
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage > 1) handlePageChange(currentPage - 1);
                                }}
                                aria-label="Previous Page"
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem
                                key={index}
                                aria-current={currentPage === index + 1 ? "page" : undefined}
                            >
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
                            <PaginationNext
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage < totalPages)
                                        handlePageChange(currentPage + 1);
                                }}
                                aria-label="Next Page"
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <AddVideo open={addModal} onOpenChange={setAddModal} fetchData={getVideos} />

            <DeletModel open={DeleteModal} onOpenChange={setDeleteModal} onConfirm={DeleteHandler} text={'Video'} DeleteText={'Delete Video'} />

            <EditVideo open={editModal} onOpenChange={setEditModal} fetchData={getVideos} />
        </div>
    );
};

export default Videos;
