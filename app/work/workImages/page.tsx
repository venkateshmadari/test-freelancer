"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  EllipsisVertical, Trash, Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
  FolderSymlink,
  Pencil,
  Trash2,
  CirclePlus,
} from 'lucide-react';
import axiosInstance from '@/app/Instance';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Normal_Image from '../../../img/svg/folder.svg';
import Dark_Image from '../../../img/svg/folder-document.svg';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const WorkImages: React.FC = () => {
  const { toast } = useToast();
  const [workImages, setWorkImages] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [deleteWorkId, setDeleteWorkId] = useState<any | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openAlbumModal, setOpenAlbumModal] = useState<boolean>(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string>('');
  const [newAlbumName, setNewAlbumName] = useState<string>('');

  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);

  const fetchWorkImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/workImages');
      if (res?.data) {
        setWorkImages(res.data);
        console.log("WorkImages:", res?.data);
      }
    } catch (error) {
      setError('Error Fetching The Work Images');
      toast({ title: 'Error', description: 'Error Fetching The Work Images', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await axiosInstance.get('/albums');
      if (res?.data) {
        setAlbums(res.data);
        console.log("Albums:", res?.data);
      }
    } catch (error) {
      setError('Error Fetching Albums');
      toast({ title: 'Error', description: 'Error Fetching Albums', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchWorkImages();
    fetchAlbums();
  }, []);

  const handleConfirmDelete = async () => {
    if (deleteWorkId) {
      try {
        await axiosInstance.delete(`/workImages/${deleteWorkId}`);
        setWorkImages(prev => prev.filter(g => g.id !== deleteWorkId));
        toast({
          variant: "default",
          title: "Success!",
          description: "Work Image deleted successfully.",
        });
        fetchWorkImages();
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error deleting the Work Image.",
        });
      } finally {
        setDeleteWorkId(null);
        setOpenDeleteModal(false);
      }
    }
  };

  const handleEditFolder = async () => {
    if (editingFolderId && newFolderName) {
      try {
        await axiosInstance.put(`/albums/${editingFolderId}`, { albumName: newFolderName });

        // Update the local state
        setAlbums(prevAlbums =>
          prevAlbums.map(album =>
            album.id === editingFolderId ? { ...album, albumName: newFolderName } : album
          )
        );

        toast({
          variant: "default",
          title: "Success!",
          description: "Folder name updated successfully.",
        });
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error updating the folder name.",
        });
      } finally {
        setOpenEditModal(false);
        setNewFolderName('');
        setEditingFolderId(null);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid folder name.",
      });
    }
  };



  const DeleteFolderHandler = async (id: any) => {
    try {
      await axiosInstance.delete(`/albums/${id}`);

      setAlbums(prevAlbums => prevAlbums.filter(album => album.id !== id));

      toast({
        variant: "default",
        title: "Success!",
        description: "Album deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error deleting the album.",
      });
    }
  };


  const handleAddImage = async () => {
    if (newImage && selectedAlbum) {
      const formData = new FormData();
      formData.append('image', newImage);
      formData.append('album', selectedAlbum);

      try {
        await axiosInstance.post('/workImages', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast({
          variant: "default",
          title: "Success!",
          description: "Work Image added successfully.",
        });
        fetchWorkImages();
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error adding the Work Image.",
        });
      } finally {
        setOpenAddModal(false);
        setNewImage(null);
        setSelectedAlbum('');
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an image and an album.",
      });
    }
  };

  const handleAddAlbum = async () => {
    if (newAlbumName) {
      try {
        await axiosInstance.post('/albums', { albumName: newAlbumName });
        setAlbums(prev => [...prev, { id: Date.now(), albumName: newAlbumName }]);
        toast({
          variant: "default",
          title: "Success!",
          description: "Album added successfully.",
        });
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error adding the album.",
        });
      } finally {
        setOpenAlbumModal(false);
        setNewAlbumName('');
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an album name.",
      });
    }
  };

  const handleDeleteClick = (id: any) => {
    setDeleteWorkId(id);
    setOpenDeleteModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(workImages.length / itemsPerPage);
  const currentRequests = workImages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <Card className="w-[98%]">
        <CardHeader>
          <div className='w-full h-auto flex justify-between items-center'>
            <div>
              <CardTitle className="text-lg md:text-2xl font-semibold">Work Images</CardTitle>
              <CardDescription className='text-xs mt-1'>Overall {workImages.length} Work Images</CardDescription>
            </div>
            <div>
              <Button variant={'outline'} className='me-3' onClick={() => setOpenAlbumModal(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Album
              </Button>
              <Button onClick={() => setOpenAddModal(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Image
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='w-full h-auto grid grid-cols-4 gap-4 py-5'>
            {albums.map(album => (
              <Card key={album.id} className='flex mb-4'>
                <CardContent className='flex w-full items-center justify-between mt-5'>
                  <div className='flex items-center space-x-3'>
                    <Image src={Normal_Image} alt='Folder_Icon' width={20} height={20} />
                    <span className='text-sm'>{album.albumName}</span>
                  </div>
                  <div className='flex items-center ml-auto'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        {/* <Button variant="outline" size="icon"> */}
                        <EllipsisVertical size={20} color='#343449' />
                        {/* </Button> */}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => {
                            setEditingFolderId(album?.id);
                            setNewFolderName(album?.albumName);
                            setOpenEditModal(true);
                          }}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit Folder</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => DeleteFolderHandler(album?.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Folder</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div>


          </div>
          <div>
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
                    <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>IMAGE</TableHead>
                    <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>ALBUM NAME</TableHead>
                    <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold text-end'>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRequests.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>
                        {(currentPage - 1) * itemsPerPage + currentRequests.indexOf(item) + 1}
                      </TableCell>
                      <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>
                        <Image src={item?.imageUrl} alt={`Work_Image_${item?.id}`} width={80} height={80} />
                      </TableCell>
                      <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{item?.albumName}</TableCell>
                      <TableCell className='text-end'>
                        <Button variant="outline" size="icon" className='me-3' onClick={() => handleDeleteClick(item?.id)}>
                          <Trash className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
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

      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
            <DialogDescription>
              Update the folder name and save changes
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor='editFolderName'>Folder Name</Label>
            <Input
              id='editFolderName'
              type='text'
              placeholder='Enter new folder name'
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className='mt-3'
            />
          </div>
          <DialogFooter className='mt-3'>
            <Button variant={'outline'} type='button' onClick={() => setOpenEditModal(false)}>Cancel</Button>
            <Button type='button' onClick={handleEditFolder}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Album Modal */}
      <Dialog open={openAlbumModal} onOpenChange={setOpenAlbumModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Album</DialogTitle>
            <DialogDescription>
              Fill the details and submit
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor='albumName'>Album Name</Label>
            <Input
              id='albumName'
              type='text'
              placeholder='Enter Album Name'
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              className='mt-3'
            />
          </div>
          <DialogFooter className='mt-3'>
            <Button type='button' onClick={() => setOpenAlbumModal(false)}>Cancel</Button>
            <Button type='button' onClick={handleAddAlbum}>Add Album</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Add Image Modal */}
      <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
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
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setNewImage(e.target.files[0]);
                }
              }}
              className='mt-3'
            />
          </div>
          <div>
            <Label htmlFor='albumSelect'>Album</Label>
            <Select
              id='albumSelect'
              onValueChange={(value) => setSelectedAlbum(value)}
              className='mt-3'
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an album" />
              </SelectTrigger>
              <SelectContent>
                {albums.map(album => (
                  <SelectItem key={album.id} value={album.id}>{album.albumName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className='mt-3'>
            <Button type='button' onClick={() => setOpenAddModal(false)}>Cancel</Button>
            <Button type='button' onClick={handleAddImage}>Add Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete WorkImage Modal */}
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
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default WorkImages;
