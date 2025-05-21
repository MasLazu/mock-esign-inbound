import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
                message: 'File is required.',
            })
            .refine((file) => file.size <= 5 * 1024 * 1024, {
                message: 'File size must be less than 5MB.',
            })
            .refine((file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type), {
                message: 'Only PDF, JPEG, and PNG files are allowed.',
            }),
        application_code: z.string(),
        application_secret: z.string(),
    });

    const form = useForm<z.infer<typeof formSchema>>({ mode: 'onBlur' });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', data.file);
            formData.append('esign_url', data.esign_url);
            formData.append('application_code', data.application_code);
            formData.append('application_secret', data.application_secret);

            await fetch('/api/esign/forward', {
                method: 'POST',
                body: formData,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3"></div>

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
                                        <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
}
