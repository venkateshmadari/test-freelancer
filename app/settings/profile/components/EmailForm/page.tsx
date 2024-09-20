"use client";

import React from 'react';
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

const EmailForm = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Email</CardTitle>
                <CardDescription>Manage Your Accounts Email Address For The Invoices</CardDescription>
            </CardHeader>
            <CardContent className='w-full h-auto mt-5 mb-5'>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="email" className="text-heading-dark dark:text-[#FACC15] font-semibold">
                            Email
                        </Label>
                        <div className='mt-3'>
                            <Input
                                type="text"
                                className="mt-1 p-2 w-full"
                                placeholder='Enter Your Email'
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <Button variant={'outline'} className='me-3'>
                        Cancel
                    </Button>
                    <Button>
                        Update Email
                    </Button>

                </div>
            </CardContent>
        </Card>
    );
};

export default EmailForm;
