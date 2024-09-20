"use client";

import React, { useState } from 'react';
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const ImageForm = () => {

    return (
        <Card>
            <CardContent className='w-full h-auto p-10'>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <Image
                            src="https://images.unsplash.com/photo-1505740106531-4243f3831c78?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Profile"
                            width={120}
                            height={100}
                            className="w-20 h-20 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-sm font-semibold">Profile picture</h2>
                            <p className="text-xs text-gray-500">PNG, JPEG under 15MB</p>
                        </div>
                    </div>

                    <div className="space-x-2">
                        <Button variant="default">
                            Upload new picture
                        </Button>
                        <Button variant="outline">
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="firstName" className="text-heading-dark dark:text-[#FACC15] font-semibold">
                            First name
                        </Label>
                        <Input
                            type="text"
                            className="mt-1 p-2 w-full"
                            placeholder='Enter Your First Name'
                        />
                    </div>
                    <div>
                        <Label htmlFor="lastName" className="text-heading-dark dark:text-[#FACC15] font-semibold">
                            Last name
                        </Label>
                        <Input
                            type="text"
                            className="mt-1 p-2 w-full"
                            placeholder='Enter Your Last Name'
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ImageForm;
