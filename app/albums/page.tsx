"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Pencil, Plus, Trash2 } from "lucide-react";
import Normal_Image from "../../img/svg/folder-document.svg";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "../Instance";
import AddAlbum from "./components/Modals/AddAlbum";
import Link from "next/link";
import DeletModel from "../gallery/components/Modals/DeleteModal";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton"; 

const Albums = () => {
  const [Default, setDefault] = useState<any>([]);
  const [AddAlbums, setAlbums] = useState<any>([]);
  const [AddModal, setAddModal] = useState<boolean>(false);
  const [DeleteId, setDeleteId] = useState<any>(null);
  const [OpenDelete, setOpenDelete] = useState<boolean>(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true); 

  const CloseModal = () => {
    setAddModal(false);
  };

  const GetGallery = async () => {
    try {
      const res = await axiosInstance.get("/gallery");
      if (res && res?.data) {
        setDefault(res?.data);
        console.log("Gallery Images:", res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GetFolders = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const res = await axiosInstance.get("/folders");
      if (res && res?.data) {
        setAlbums(res?.data);
        console.log("Folders:", res?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    GetFolders();
    GetGallery();
  }, []);

  const handleEdit = (id: number) => {
    console.log("Edit folder with ID:", id);
  };

  const DeleteHandler = async () => {
    if (DeleteId) {
      try {
        await axiosInstance.delete(`/folders/${DeleteId}`);
        setAlbums((prevImages: any) =>
          prevImages.filter((image: any) => image.id !== DeleteId)
        );
        setDeleteId(null);
        toast({
          description: "Album deleted successfully.",
          variant: "default",
        });
      } catch (error) {
        console.error(error);
        toast({
          description: "Failed to delete album.",
          variant: "destructive",
        });
      }
    }
    setOpenDelete(false);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="w-full h-auto flex justify-between items-center">
            <div>
              <CardTitle className="text-lg md:text-2xl font-semibold">
                Albums
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Overall {AddAlbums.length} Added Albums
              </CardDescription>
            </div>
            <div>
              <Button onClick={() => setAddModal(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Album
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            // Display skeletons while loading
            <div className="w-full h-auto grid grid-cols-4 gap-4 py-5">
              {[...Array(4)].map((_, index) => (
                <Card className="flex mb-4 ms-4" key={index}>
                  <CardContent className="flex w-full items-center justify-between mt-5">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-5 w-5 rounded" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center ml-auto">
                      <Skeleton className="h-5 w-5" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="w-full h-auto grid grid-cols-4 gap-4 py-5">
              {AddAlbums?.map((item: any, index: number) => (
                <Card className="flex mb-4 ms-4" key={index}>
                  <CardContent className="flex w-full items-center justify-between mt-5">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={Normal_Image}
                        alt="Folder Icon"
                        width={20}
                        height={20}
                        priority
                      />
                      <Link href={`/albums/${item?.id}`}>
                        <span className="text-sm">{item?.folder_name}</span>
                      </Link>
                    </div>
                    <div className="flex items-center ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <EllipsisVertical size={20} color="#343449" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit Folder</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenDelete(true)}>
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
          )}
        </CardContent>
      </Card>
      <AddAlbum
        open={AddModal}
        onOpenChange={setAddModal}
        fetchData={GetFolders}
        close={CloseModal}
      />
      <DeletModel
        open={OpenDelete}
        onOpenChange={setOpenDelete}
        onConfirm={DeleteHandler}
        text={"Album"}
        DeleteText={"Delete Album"}
      />
    </div>
  );
};

export default Albums;
