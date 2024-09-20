"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const IntegratedForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrated Account</CardTitle>
        <CardDescription>
          Manage your current integrated accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full h-auto mt-5 mb-5">
        <Card className="flex justify-between items-center">
          <CardContent className="flex  items-center justify-center p-5">
            <Button variant={"outline"}></Button>
            <div>
              <h2 className="mt-3 text-lg font-semibold">Google</h2>
              <p className="text-center text-sm text-gray-600 mt-2">
                Use Google For The Faster Login Methods In Your Account
              </p>
            </div>
            <div className="text-end">
               <Button variant={'outline'}>
                 Connect
               </Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default IntegratedForm;
