"use client";

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableHeader,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import Image from 'next/image';
import Start_Icon from "../../../../img/star.png";
import { Badge } from '@/components/ui/badge';

interface Review {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
}

interface ShowModalProps {
    close: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fetchData: () => void;
    review: Review | null;
}

const ShowModal: React.FC<ShowModalProps> = ({ open, onOpenChange, close, review }) => {

    let RequriedAttributes = [
        "qualityservices",
        "facilities",
        "flexibility",
        "valueformoney"
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange} aria-labelledby="modal-title" aria-describedby="modal-description">
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle id="modal-title">Detailed Review</DialogTitle>
                </DialogHeader>
                {review ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>S.NO</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>RATING</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(Object.keys(review) as Array<keyof Review>)
                                .filter((item) => RequriedAttributes.includes(item))
                                .map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item}</TableCell>
                                        <TableCell>
                                            <Badge variant={'warning'}>
                                                <div className='flex items-center gap-1'>
                                                    <Image src={Start_Icon} alt='Star_Icon' width={12} height={12} />
                                                    <span className='font-normal text-heading-dark dark:text-yellow-400 text-md'>{review[item]}</span>
                                                </div>
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}

                        </TableBody>
                    </Table>
                ) : (
                    <p>No review data available.</p>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ShowModal;
