"use client";
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { FolderSymlink, Heart, Plus, Trash } from 'lucide-react'


interface Albums {
    id: any,
    image: string,
    isFavorite: boolean
}

const Albums = () => {

    const [Images, setImages] = useState<Albums[]>([]);
    const [AddModal, setAddModal] = useState<boolean>(false);
    const [DeleteId, setDeleteId] = useState<number | null>(null);
    const [DeleteModal, setDeleteModal] = useState<boolean>(false);

    return (
        <div>
            <Card>
                <CardHeader>
                    <div className='w-full h-auto flex justify-between items-center'>
                        <div>
                            <CardTitle className="text-lg md:text-2xl font-semibold">Gallery</CardTitle>
                            <CardDescription className='text-xs mt-1'>Overall 10 Gallery Images</CardDescription>
                        </div>
                        <div>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Image
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
                                <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>SELECT FAV (6)</TableHead>
                                <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold text-end'>ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>1</TableCell>
                                <TableCell>
                                    <Image src={"https://images.unsplash.com/photo-1471377375227-29eb574e942b?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt='Image Thumbnail' width={100} height={50} />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className='me-3'
                                    >
                                        <Heart className='h-4 w-4' />
                                    </Button>
                                </TableCell>
                                <TableCell className='text-end'>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className='me-3'
                                    >
                                        <FolderSymlink className='h-4 w-4' />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className='me-3'
                                    >
                                        <Trash className='h-4 w-4' />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default Albums
