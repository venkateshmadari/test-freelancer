"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Pencil, Plus, Trash } from 'lucide-react';
import axiosInstance from '@/app/Instance';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface Plan {
    planId: number;
    serviceName: string;
    price: number;
}

interface Group {
    id: number;
    groupName: string;
    status: any;
    plans: Plan[];
}

const Pricing: React.FC = () => {
    const { toast } = useToast();
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(7);

    const [newGroupName, setNewGroupName] = useState<string>('');
    const [newGroupStatus, setNewGroupStatus] = useState<number>(0);
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [editGroupName, setEditGroupName] = useState<string>('');
    const [editGroupStatus, setEditGroupStatus] = useState<number>(0);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

    useEffect(() => {
        const fetchGroups = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await axiosInstance.get('/groups');
                setGroups(res.data);
            } catch {
                setError('Error Fetching The Group Data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleDeleteClick = (id: number) => {
        setSelectedGroupId(id);
        setOpenDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedGroupId) {
            try {
                await axiosInstance.delete(`/groups/${selectedGroupId}`);
                setGroups(prev => prev.filter(g => g.id !== selectedGroupId));
                toast({
                    variant: "default",
                    title: "Success!",
                    description: "Group deleted successfully.",
                });
            } catch {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error deleting the group.",
                });
            } finally {
                setSelectedGroupId(null);
                setOpenDeleteModal(false);
            }
        }
    };

    const handleAddGroup = async () => {
        if (newGroupName.trim()) {
            try {
                const res = await axiosInstance.post('/groups', { groupName: newGroupName, status: newGroupStatus });
                setGroups(prev => [...prev, res.data]);
                toast({
                    variant: "default",
                    title: "Success!",
                    description: "Group added successfully.",
                });
                setNewGroupName('');
                setNewGroupStatus(0);
                setOpenAddModal(false);
            } catch {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error adding the group.",
                });
            }
        }
    };

    const handleEditGroup = async () => {
        if (selectedGroupId !== null && editGroupName.trim()) {
            try {
                await axiosInstance.put(`/groups/${selectedGroupId}`, { groupName: editGroupName, status: editGroupStatus });
                setGroups(prev => prev.map(group =>
                    group.id === selectedGroupId ? { ...group, groupName: editGroupName, status: editGroupStatus } : group
                ));
                toast({
                    variant: "default",
                    title: "Success!",
                    description: "Group updated successfully.",
                });
                setEditGroupName('');
                setEditGroupStatus(0);
                setOpenEditModal(false);
                setSelectedGroupId(null);
            } catch {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error updating the group.",
                });
            }
        }
    };

    const handleEditClick = (group: Group) => {
        setEditGroupName(group.groupName);
        setEditGroupStatus(group.status);
        setSelectedGroupId(group.id);
        setOpenEditModal(true);
    };

    const totalPages = Math.ceil(groups.length / itemsPerPage);
    const currentGroups = groups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <Card className="w-[98%]">
                <CardHeader>
                    <div className='w-full h-auto flex justify-between items-center'>
                        <div>
                            <CardTitle className="text-lg md:text-2xl font-semibold">Price Groups</CardTitle>
                            <CardDescription className='text-xs mt-1'>Overall {groups.length} Groups</CardDescription>
                        </div>
                        <div>
                            <Button onClick={() => setOpenAddModal(true)}>
                                <Plus className="mr-2 h-4 w-4" /> Add Price Group
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <TableHead key={idx} className='text-black font-semibold'>
                                            <Skeleton className='w-24 h-6' />
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <TableRow key={idx}>
                                        {Array.from({ length: 5 }).map((_, idx) => (
                                            <TableCell key={idx}>
                                                <Skeleton className='w-24 h-6' />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>S.NO</TableHead>
                                    <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>GROUP NAME</TableHead>
                                    <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>PLANS</TableHead>
                                    <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>STATUS</TableHead>
                                    <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold text-end'>ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentGroups.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{(currentPage - 1) * itemsPerPage + currentGroups.indexOf(item) + 1}</TableCell>
                                        <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{item.groupName}</TableCell>
                                        <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>
                                            <Link href={`/pricing/plans/${item?.id}`}>
                                                <Button variant={'default'}>
                                                    Add Plans
                                                </Button>
                                            </Link>

                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={item.status === 0 ? 'success' : 'error'}>
                                                {item.status === 0 ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='text-end'>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className='me-3'
                                                onClick={() => handleEditClick(item)}
                                            >
                                                <Pencil className='h-4 w-4' />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDeleteClick(item.id)}
                                                className='me-3'
                                            >
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

            {/* Add Group Modal */}
            <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Group</DialogTitle>
                        <DialogDescription>
                            Enter the name and status of the new group.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Label htmlFor='newGroupName'>Group Name</Label>
                        <Input
                            id='newGroupName'
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder='Enter group name'
                            className='mt-3'
                        />
                    </div>
                    <div>
                        <Label htmlFor='newGroupStatus'>Status</Label>
                        <div className='mt-3'>
                            <Select
                                value={newGroupStatus.toString()}
                                onValueChange={(value) => setNewGroupStatus(parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Active</SelectItem>
                                    <SelectItem value="1">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </div>
                    <DialogFooter className='mt-3'>
                        <Button type='button' onClick={() => setOpenAddModal(false)}>Cancel</Button>
                        <Button type='button' onClick={handleAddGroup}>Add Group</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Group Modal */}
            <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Group</DialogTitle>
                        <DialogDescription>
                            Edit the name and status of the group.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='mt-4'>
                        <Label htmlFor='editGroupName'>Group Name</Label>
                        <Input
                            id='editGroupName'
                            value={editGroupName}
                            onChange={(e) => setEditGroupName(e.target.value)}
                            placeholder='Enter group name'
                            className='mt-3'
                        />
                    </div>
                    <div className='mt-4'>
                        <Label htmlFor='editGroupStatus'>Status</Label>
                        <div className='mt-3'>
                            <Select
                                value={editGroupStatus.toString()}
                                onValueChange={(value) => setEditGroupStatus(parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Active</SelectItem>
                                    <SelectItem value="1">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </div>
                    <DialogFooter className='mt-3'>
                        <Button type='button' onClick={() => setOpenEditModal(false)}>Cancel</Button>
                        <Button type='button' onClick={handleEditGroup}>Update Group</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Group Modal */}
            <AlertDialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will delete the group and it cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpenDeleteModal(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Pricing;
