import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router as inertiaRouter } from '@inertiajs/react';
import { ChevronDown, ChevronLeft, ChevronRight, Download, Search } from 'lucide-react';
import { useState } from 'react';

interface Subscriber {
    id: number;
    email: string;
    is_active: boolean;
    subscribed_at: string;
    email_verified_at: string | null;
}

interface Props {
    subscribers: {
        data: Subscriber[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
}

export default function NewsletterIndex({ subscribers }: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter subscribers based on search
    const filteredSubscribers = subscribers.data.filter((subscriber) => subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <AppLayout>
            <Head title="Newsletter Subscribers" />

            <div className="container mx-auto px-2 py-10">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
                    <Button onClick={() => (window.location.href = route('newsletter.export'))} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                {/* Search bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder="Search subscribers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="bg-card rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-muted/50">
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Subscribed At</TableHead>
                                <TableHead>Verified At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSubscribers.map((subscriber) => (
                                <TableRow key={subscriber.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={subscriber.is_active ? 'default' : 'secondary'}
                                            className={subscriber.is_active ? 'bg-green-500 hover:bg-green-600' : ''}
                                        >
                                            {subscriber.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(subscriber.subscribed_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {subscriber.email_verified_at ? (
                                            new Date(subscriber.email_verified_at).toLocaleDateString()
                                        ) : (
                                            <Badge variant="outline">Not verified</Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {subscribers.links.length > 3 && (
                    <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        {/* Left side - Previous button and page info */}
                        <div className="order-2 flex items-center space-x-4 sm:order-1">
                            <Button
                                variant="outline"
                                onClick={() => subscribers.prev_page_url && inertiaRouter.get(subscribers.prev_page_url)}
                                disabled={!subscribers.prev_page_url}
                            >
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Previous
                            </Button>

                            {/* Page selector dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="min-w-[120px] gap-2">
                                        <span>
                                            Page {subscribers.current_page} of {subscribers.last_page}
                                        </span>
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="max-h-60 overflow-y-auto">
                                    {subscribers.links
                                        .filter((link) => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;')
                                        .map((link, index) => (
                                            <DropdownMenuItem
                                                key={index}
                                                onClick={() => link.url && inertiaRouter.get(link.url)}
                                                className={link.active ? 'bg-gray-100 font-medium' : ''}
                                                disabled={!link.url}
                                            >
                                                Page {link.label}
                                            </DropdownMenuItem>
                                        ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Center - Page numbers */}
                        <div className="order-1 flex space-x-1 sm:order-2">
                            {subscribers.links.map((link, index) =>
                                link.url === null ? null : link.label === '&laquo; Previous' || link.label === 'Next &raquo;' ? null : (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        onClick={() => link.url && inertiaRouter.get(link.url)}
                                        disabled={!link.url}
                                    >
                                        {link.label}
                                    </Button>
                                ),
                            )}
                        </div>

                        {/* Right side - Next button */}
                        <div className="order-3 flex items-center space-x-4">
                            <Button
                                variant="outline"
                                onClick={() => subscribers.next_page_url && inertiaRouter.get(subscribers.next_page_url)}
                                disabled={!subscribers.next_page_url}
                            >
                                Next
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Results Info */}
                <div className="mt-4 text-center text-sm text-gray-600">
                    Showing {subscribers.from || 0}-{subscribers.to || 0} of {subscribers.total} subscribers
                </div>
            </div>
        </AppLayout>
    );
}
