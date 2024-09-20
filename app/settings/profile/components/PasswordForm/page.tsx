"use client";

import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react'; 

const PasswordForm = () => {
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Modify Your Current Password</CardDescription>
            </CardHeader>
            <CardContent className='w-full h-auto mt-5 mb-5'>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="currentpassword" className="text-heading-dark dark:text-[#FACC15] font-semibold">
                            Current Password
                        </Label>
                        <div className="relative mt-1">
                            <Input
                                type={currentPasswordVisible ? "text" : "password"}
                                className="p-2 w-full"
                                placeholder='Enter Your Current Password'
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}
                            >
                                {currentPasswordVisible ? <EyeOff className='w-6 h-5'/> : <Eye className='w-6 h-5'/>}
                            </button>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="newpassword" className="text-heading-dark dark:text-[#FACC15] font-semibold">
                            New Password
                        </Label>
                        <div className="relative mt-1">
                            <Input
                                type={newPasswordVisible ? "text" : "password"}
                                className="p-2 w-full"
                                placeholder='Enter Your New Password'
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                            >
                                {newPasswordVisible ? <EyeOff className='w-6 h-5'/> : <Eye className='w-6 h-5' />}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-5">
                    <Button variant={'outline'} className='me-3'>
                        Cancel
                    </Button>
                    <Button>
                        Update Password
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default PasswordForm;
