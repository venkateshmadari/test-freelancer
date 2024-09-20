"use client";
import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
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
import { Button } from '@/components/ui/button';
import { Bug, Eye } from 'lucide-react';
import axiosInstance from '../Instance';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from '@/components/ui/badge';
import ShowModal from './components/Modals/ShowModal';
import Image from 'next/image';
import Start_Icon from "../../img/star.png";

interface Review {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
}

const Reviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [review, setreview] = useState<any>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [moreModal, setMoreModal] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(6);
    const [expandedReviews, setExpandedReviews] = useState<{
        [key: number]: boolean;
    }>({});
    const { toast } = useToast();

    const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axiosInstance.get('/reviews');
            if (res && res?.data) {
                setReviews(res?.data);
            }
            console.log("All Reviews:", res?.data);
        } catch (error) {
            console.log(error);
            toast({
                title: "Error Fetching The Reviews",
                description: `${error}`,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleMoreClick = (review: Review) => {
        setSelectedReview(review);
        setMoreModal(true);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const CloseMoreModal = () => {
        setMoreModal(false);
    }


    const totalPages = Math.ceil(reviews.length / itemsPerPage);
    const currentReviews = reviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    const toggleReviewExpansion = (id: number) => {
        setExpandedReviews((prevExpandedReviews) => ({
            ...prevExpandedReviews,
            [id]: !prevExpandedReviews[id],
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Reviews</CardTitle>
                <CardDescription>See what our users have to say.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Table>
                        <TableBody>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[200px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[300px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                    <TableCell className='text-end'>
                                        <Skeleton className="h-6 w-12" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : error ? (
                    <div>{error}</div>
                ) : reviews.length === 0 ? (
                    <div>No reviews available.</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>S.NO</TableHead>
                                <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>NAME</TableHead>
                                <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>RATING</TableHead>
                                <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>COMMENT</TableHead>
                                <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>DATE</TableHead>
                                <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold text-end'>ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentReviews.map((review, index) => (
                                <TableRow key={review.id}>
                                    <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{(currentPage - 1) * itemsPerPage + currentReviews.indexOf(review) + 1}</TableCell>
                                    <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{review?.user}</TableCell>
                                    <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>
                                        <Badge variant={'warning'}>
                                            <div className='flex items-center gap-1'>
                                                <Image src={Start_Icon} alt='Star_Icon' width={12} height={12} />
                                                <span className='font-normal text-heading-dark dark:text-yellow-400 text-md'>4.5</span>
                                            </div>
                                        </Badge>

                                    </TableCell>
                                    <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{review?.comment}</TableCell>
                                    <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{review?.date}</TableCell>
                                    <TableCell className='text-end'>
                                        <Button variant={'outline'} className='me-3' onClick={() => {
                                            setMoreModal(true);
                                            handleMoreClick(review);
                                        }}>
                                            <Eye className='w-4 h-4' />
                                        </Button>
                                        {/* <Button variant={'outline'}>
                                            <Bug className='w-4 h-4' />
                                        </Button> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
            <CardFooter className='w-full h-auto flex justify-center items-center'>
                <div>
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
            </CardFooter>
            {/* Review Modal Starts Here */}
            <ShowModal open={moreModal} onOpenChange={setMoreModal} fetchData={fetchReviews} close={CloseMoreModal} review={selectedReview}/>
            {/* Review Modal Ends Here */}
        </Card>
    );
};

export default Reviews;
