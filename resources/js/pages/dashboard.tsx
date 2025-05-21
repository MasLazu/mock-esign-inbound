import AppLayout from '@/layouts/app-layout';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { z } from "zod"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [loading, setLoading] = useState(false);

    const formSchema = z.object({
        esign_url: z.string(),
        file: z
            .any()
            .refine((file) => file instanceof File || (file && file.length > 0), {
                message: "File is required.",
            })
            .refine((file) => file.size <= 5 * 1024 * 1024, {
                message: "File size must be less than 5MB.",
            })
            .refine((file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type), {
                message: "Only PDF, JPEG, and PNG files are allowed.",
            }),
        application_code: z.string(),
        application_secret: z.string(),
    })

    const form = useForm<z.infer<typeof formSchema>>(
        { mode: 'onBlur' },
    )

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('File', data.file);
            formData.append('DocumentDate', new Date().toISOString());
            formData.append('Name', data.file.name);
            formData.append('AdministratorId', '6314e175-1981-4663-9ab9-325e4de9e8e5');
            formData.append('AdministratorRoleCode', 'document-administrator');
            formData.append('DocumentCategoryId', '0196eb52-568f-73c3-8324-2e9588751be8');

            await fetch(data.esign_url, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Application-Code': data.application_code,
                    'X-Webhook-Secret': data.application_secret,
                },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="esign_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Esign Url</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Esign Url" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="application_code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Application Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Application Code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="application_secret"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Application Secret</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Application Secret" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload File</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            onChange={(e) => field.onChange(e.target.files?.[0])}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
}
