
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from '@/app/Instance';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface ContactForm {
  id: string;
  username: string;
  email: string;
  phone: string;
  location: string;
  status: number;
  profile_image?: string;
}

const ContactForms: React.FC = () => {
  const { toast } = useToast();
  const [contact, setContact] = useState<ContactForm[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ContactForm | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(7);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [editGroupStatus, setEditGroupStatus] = useState<number>(0);

  const FetchContactForms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/contactedForms');
      if (res?.data) {
        setContact(res.data);
        console.log("ContactForms:", res?.data);
      }
    } catch (error) {
      setError('Error Fetching The Freelancer Data');
      toast({ title: 'Error', description: 'Error Fetching The Freelancer Data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    FetchContactForms();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(contact.length / itemsPerPage);
  const currentContacts = contact.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEditClick = (item: ContactForm) => {
    setSelectedRequest(item);
    setEditGroupStatus(item.status);
    setOpenEditModal(true);
  };

  const handleSave = async () => {
    if (selectedRequest) {
      try {
        await axiosInstance.patch(`/contactedForms/${selectedRequest.id}`, { ...selectedRequest, status: editGroupStatus });
        setOpenEditModal(false);
        toast({ title: 'Success', description: 'Status updated successfully', variant: 'default' });
        FetchContactForms();
      } catch (error) {
        toast({ title: 'Error', description: 'Error updating status', variant: 'destructive' });
      }
    }
  };

  return (
    <div>
      <Card className="w-[98%]">
        <CardHeader>
          <div className='w-full h-auto flex justify-between items-center'>
            <div>
              <CardTitle className="text-lg md:text-2xl font-semibold">Contacted Forms</CardTitle>
              <CardDescription className='text-xs mt-1'>Overall {contact.length} Contacted Forms</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  {Array.from({ length: itemsPerPage }).map((_, idx) => (
                    <TableHead key={idx} className='text-black font-semibold'>
                      <Skeleton className='w-24 h-6' />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: itemsPerPage }).map((_, idx) => (
                  <TableRow key={idx}>
                    {['', '', '', '', '', '', ''].map((_, idx) => (
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
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>USER NAME</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>EMAIL</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>PHONE</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>LOCATION</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>STATUS</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold text-end'>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentContacts.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>
                      {(currentPage - 1) * itemsPerPage + currentContacts.indexOf(item) + 1}
                    </TableCell>
                    <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          {item?.profile_image ? (
                            <AvatarImage src={item?.profile_image} />
                          ) : (
                            <AvatarFallback className='capitalize'>{item?.username[0]}</AvatarFallback>
                          )}
                        </Avatar>
                        {item?.username}
                      </div>
                    </TableCell>
                    <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{item?.email}</TableCell>
                    <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{item?.phone}</TableCell>
                    <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{item?.location}</TableCell>
                    <TableCell>
                      <Badge variant={
                        item?.status === 0 ? "secondary" :
                          item?.status === 1 ? "error" :
                            item?.status === 2 ? "warning" :
                              item?.status === 3 ? "lightTeal" :
                                item?.status === 4 ? "lightAmber" :
                                  "pinkLight"
                      }>
                        {item?.status === 0 ? "Interested" :
                          item?.status === 1 ? "Not Interested" :
                            item?.status === 2 ? "Irrelevant" :
                              item?.status === 3 ? "Quotation Sent" :
                                item?.status === 4 ? "Call Back" :
                                  "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-end'>
                      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
                        <DialogTrigger>
                          <Button variant="outline" size="icon" className='me-3' onClick={() => handleEditClick(item)}>
                            <Pencil className='h-4 w-4' />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Edit Status</DialogTitle>
                            <DialogDescription>
                              Update status and click save when you're done.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="">
                            <div className=''>
                              <Label htmlFor='status'>Status</Label>
                              <div className='mt-3'>
                                <Select
                                  value={editGroupStatus.toString()}
                                  onValueChange={(value) => setEditGroupStatus(parseInt(value))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="0">Interested</SelectItem>
                                    <SelectItem value="1">Not Interested</SelectItem>
                                    <SelectItem value="2">Irrelevant</SelectItem>
                                    <SelectItem value="3">Quotation Sent</SelectItem>
                                    <SelectItem value="4">Call Back</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="button" onClick={handleSave}>Update</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
              }} aria-label="Previous Page" />
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
              <PaginationNext
                onClick={(e) => {
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
  );
}

export default ContactForms;
