import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ChevronDown, ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface Company {
    id: number;
    name: string;
    description: string;
    certification_images: string[];
    logo: string;
    link: string;
}

interface Props {
    companies: {
        data: Company[];
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

export default function Index({ companies }: Props) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('desc');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        certification_images: [] as File[],
        logo: null as File | null,
        link: '',
    });
    const [imagePreviews, setImagePreviews] = useState<{
        certification_images: string[];
        logo: string | null;
    }>({
        certification_images: [],
        logo: null,
    });
    const [removedImages, setRemovedImages] = useState({
        certification_images: [] as string[],
        logo: null as string | null,
    });

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            certification_images: [],
            logo: null,
            link: '',
        });
        setImagePreviews({
            certification_images: [],
            logo: null,
        });
        setRemovedImages({
            certification_images: [],
            logo: null,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'certification_images') {
                const files = value as File[];
                files.forEach((file) => {
                    formDataToSend.append(`${key}[]`, file);
                });
            } else if (key === 'logo' && value) {
                formDataToSend.append(key, value as File);
            } else if (value !== null && value !== undefined) {
                formDataToSend.append(key, value.toString());
            }
        });

        // Add removed images to form data
        if (selectedCompany) {
            removedImages.certification_images.forEach((image) => {
                formDataToSend.append('remove_certification_images[]', image);
            });
            if (removedImages.logo) {
                formDataToSend.append('remove_logo', removedImages.logo);
            }
        }

        const routeUrl = selectedCompany ? route('companies.update', selectedCompany.id) : route('companies.store');

        router.post(routeUrl, formDataToSend, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Company ${selectedCompany ? 'updated' : 'created'} successfully`);
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                resetForm();
                setIsSubmitting(false);
            },
            onError: (errors) => {
                console.error('Errors:', errors);
                Object.entries(errors).forEach(([key, value]) => {
                    toast.error(`${key}: ${value}`);
                });
                setIsSubmitting(false);
            },
        });
    };

    const handleDelete = (company: Company) => {
        setSelectedCompany(company);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedCompany || isSubmitting) return;

        setIsSubmitting(true);
        router.delete(route('companies.destroy', selectedCompany.id), {
            onSuccess: () => {
                toast.success('Company deleted successfully');
                setIsDeleteDialogOpen(false);
                setIsSubmitting(false);
            },
            onError: () => {
                toast.error('Failed to delete company');
                setIsSubmitting(false);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'certification_images' | 'logo') => {
        if (e.target.files) {
            if (type === 'logo') {
                const file = e.target.files[0];
                if (file) {
                    setFormData((prev) => ({
                        ...prev,
                        logo: file,
                    }));
                    setImagePreviews((prev) => ({
                        ...prev,
                        logo: URL.createObjectURL(file),
                    }));
                }
            } else {
                const files = Array.from(e.target.files);
                const maxFiles = 5;

                if (files.length > maxFiles) {
                    toast.error(`Maximum ${maxFiles} certification images allowed`);
                    return;
                }

                // Create preview URLs for the selected files
                const previews = files.map((file) => URL.createObjectURL(file));

                setFormData((prev) => ({
                    ...prev,
                    certification_images: files,
                }));

                setImagePreviews((prev) => ({
                    ...prev,
                    certification_images: previews,
                }));
            }
        }
    };

    // Cleanup preview URLs when component unmounts
    useEffect(() => {
        return () => {
            Object.values(imagePreviews)
                .flat()
                .forEach((url) => {
                    if (url) URL.revokeObjectURL(url);
                });
        };
    }, [imagePreviews]);

    const handleEditCompany = (company: Company) => {
        setSelectedCompany(company);
        setFormData({
            name: company.name,
            description: company.description || '',
            certification_images: [],
            logo: null,
            link: company.link || '',
        });
        setImagePreviews({
            certification_images: [],
            logo: null,
        });
        setRemovedImages({
            certification_images: [],
            logo: null,
        });
        setIsEditDialogOpen(true);
    };

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSortBy('created_at');
        setSortDirection('desc');
    };

    const SortIndicator = ({ column }: { column: string }) => {
        if (sortBy !== column) return null;
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    const ImagePreview = ({ images, type }: { images: string[]; type: 'certification_images' | 'logo' }) => {
        const placeholderImage =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';

        const getImageUrl = (image: string) => {
            if (!image) return placeholderImage;
            if (image.startsWith('blob:')) {
                return image;
            }
            // If the image is a full URL, return it as is
            if (image.startsWith('http')) {
                return image;
            }
            // If the image path already includes the storage prefix, return it as is
            if (image.startsWith('storage/')) {
                return `/${image}`;
            }
            // Otherwise, construct the storage URL
            return `/storage/${image}`;
        };

        const handleRemoveImage = (image: string, index: number) => {
            // Revoke the blob URL before removing the image
            if (image.startsWith('blob:')) {
                URL.revokeObjectURL(image);
            }

            if (type === 'logo') {
                setFormData((prev) => ({
                    ...prev,
                    logo: null,
                }));
                setImagePreviews((prev) => ({
                    ...prev,
                    logo: null,
                }));
                if (selectedCompany?.logo) {
                    setRemovedImages((prev) => ({
                        ...prev,
                        logo: selectedCompany.logo,
                    }));
                }
            } else {
                setFormData((prev) => ({
                    ...prev,
                    certification_images: prev.certification_images.filter((_, i) => i !== index),
                }));
                setImagePreviews((prev) => ({
                    ...prev,
                    certification_images: prev.certification_images.filter((_, i) => i !== index),
                }));
                if (selectedCompany?.certification_images[index]) {
                    setRemovedImages((prev) => ({
                        ...prev,
                        certification_images: [...prev.certification_images, selectedCompany.certification_images[index]],
                    }));
                }
            }
        };

        return (
            <div className="mt-2 grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                    <div key={index} className="group relative aspect-square w-full overflow-hidden rounded-lg border">
                        <img
                            src={getImageUrl(image)}
                            alt={`${type} preview ${index + 1}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = placeholderImage;
                                // Revoke the blob URL if it exists
                                if (image.startsWith('blob:')) {
                                    URL.revokeObjectURL(image);
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveImage(image, index)}
                            className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    // Defensive fallback for images
    const getCompanyImage = (image: any) => {
        if (typeof image === 'string' && image.trim()) {
            return image.startsWith('http') ? image : `/storage/${image}`;
        }
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
    };
    const getCompanyImages = (images: any) => (Array.isArray(images) ? images : []);
    const getCompanyName = (name: any) => (typeof name === 'string' && name.trim() ? name : 'Unnamed Company');
    const getCompanyDescription = (desc: any) => (typeof desc === 'string' && desc.trim() ? desc : 'No description available');
    const getCompanyLink = (link: any) => (typeof link === 'string' && link.trim() ? link : undefined);

    return (
        <AppLayout>
            <Head title="Companies" />
            <div className="container mx-auto px-2 py-10">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Companies</h1>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Company
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Search companies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Search Button */}
                        <Button
                            onClick={() => {
                                router.get(
                                    route('companies.index'),
                                    {
                                        search: searchQuery,
                                        sort_by: sortBy,
                                        sort_direction: sortDirection,
                                    },
                                    { preserveState: true },
                                );
                            }}
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>

                        {/* Reset Filters Button */}
                        <Button variant="ghost" onClick={resetFilters} className="text-muted-foreground">
                            Reset Filters
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-card rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-muted/50">
                                <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort('name')}>
                                    Name <SortIndicator column="name" />
                                </TableHead>
                                <TableHead className="w-[300px]">Description</TableHead>
                                <TableHead className="w-[100px]">Logo</TableHead>
                                <TableHead className="w-[150px]">Certifications</TableHead>
                                <TableHead className="w-[100px]">Link</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {companies.data.map((company) => (
                                <TableRow key={company.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">{getCompanyName(company.name)}</TableCell>
                                    <TableCell className="max-w-md truncate">{getCompanyDescription(company.description)}</TableCell>
                                    <TableCell>
                                        {company.logo && (
                                            <div className="relative h-10 w-10 overflow-hidden rounded-full border">
                                                <img
                                                    src={getCompanyImage(company.logo)}
                                                    alt={`${getCompanyName(company.name)} logo`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex -space-x-2">
                                            {getCompanyImages(company.certification_images)
                                                .slice(0, 3)
                                                .map((image, index) => (
                                                    <div key={index} className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                                                        <img
                                                            src={getCompanyImage(image)}
                                                            alt={`Certification ${index + 1}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            {getCompanyImages(company.certification_images).length > 3 && (
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs">
                                                    +{getCompanyImages(company.certification_images).length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getCompanyLink(company.link) && (
                                            <a
                                                href={getCompanyLink(company.link) || undefined}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Visit
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEditCompany(company)} className="h-8 px-3">
                                                <Pencil className="mr-1 h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(company)} className="h-8 px-3">
                                                <Trash2 className="mr-1 h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {companies.links.length > 3 && (
                    <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        {/* Left side - Previous button and page info */}
                        <div className="order-2 flex items-center space-x-4 sm:order-1">
                            <Button
                                variant="outline"
                                onClick={() => companies.prev_page_url && router.get(companies.prev_page_url)}
                                disabled={!companies.prev_page_url}
                            >
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Previous
                            </Button>

                            {/* Page selector dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="min-w-[120px] gap-2">
                                        <span>
                                            Page {companies.current_page} of {companies.last_page}
                                        </span>
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="max-h-60 overflow-y-auto">
                                    {companies.links
                                        .filter((link) => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;')
                                        .map((link, index) => (
                                            <DropdownMenuItem
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
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
                            {companies.links.map((link, index) =>
                                link.url === null ? null : link.label === '&laquo; Previous' || link.label === 'Next &raquo;' ? null : (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        onClick={() => link.url && router.get(link.url)}
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
                                onClick={() => companies.next_page_url && router.get(companies.next_page_url)}
                                disabled={!companies.next_page_url}
                            >
                                Next
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Results Info */}
                <div className="mt-4 text-center text-sm text-gray-600">
                    Showing {companies.from || 0}-{companies.to || 0} of {companies.total} companies
                </div>

                {/* Add Company Dialog */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[1000px] [&>button]:hidden">
                        <DialogHeader className="space-y-3 border-b pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <DialogTitle className="text-2xl font-semibold">Add New Company</DialogTitle>
                                    <p className="text-muted-foreground text-sm">Fill in the details below to create a new company.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsAddDialogOpen(false);
                                        resetForm();
                                    }}
                                    className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground self-start rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                    >
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </svg>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Basic Information</h3>
                                        <div>
                                            <Label htmlFor="name" className="text-sm font-medium">
                                                Company Name
                                            </Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                                className="mt-1.5"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="description" className="text-sm font-medium">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                                className="mt-1.5"
                                                rows={4}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="link" className="text-sm font-medium">
                                                Company Link
                                            </Label>
                                            <Input
                                                id="link"
                                                type="url"
                                                value={formData.link}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                                                className="mt-1.5"
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Images */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Images</h3>
                                        <div>
                                            <Label htmlFor="logo" className="text-sm font-medium">
                                                Company Logo
                                            </Label>
                                            <Input
                                                id="logo"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'logo')}
                                                className="mt-1.5"
                                            />
                                            {imagePreviews.logo && (
                                                <div className="mt-2">
                                                    <p className="mb-2 text-sm font-medium">Logo Preview:</p>
                                                    <ImagePreview images={imagePreviews.logo ? [imagePreviews.logo] : []} type="logo" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="certification_images" className="text-sm font-medium">
                                                Certification Images
                                            </Label>
                                            <Input
                                                id="certification_images"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'certification_images')}
                                                className="mt-1.5"
                                            />
                                            <p className="text-muted-foreground mt-1 text-sm">
                                                Selected: {formData.certification_images.length} images
                                            </p>
                                            {imagePreviews.certification_images.length > 0 && (
                                                <div className="mt-2">
                                                    <p className="mb-2 text-sm font-medium">New Images:</p>
                                                    <ImagePreview
                                                        images={
                                                            imagePreviews.certification_images?.filter(
                                                                (img): img is string => typeof img === 'string',
                                                            ) || []
                                                        }
                                                        type="certification_images"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 border-t pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsAddDialogOpen(false);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Company'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Company Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[1000px] [&>button]:hidden">
                        <DialogHeader className="space-y-3 border-b pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <DialogTitle className="text-2xl font-semibold">Edit Company</DialogTitle>
                                    <p className="text-muted-foreground text-sm">Update the company details below.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsEditDialogOpen(false);
                                        resetForm();
                                    }}
                                    className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground self-start rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                    >
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </svg>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Basic Information</h3>
                                        <div>
                                            <Label htmlFor="edit_name" className="text-sm font-medium">
                                                Company Name
                                            </Label>
                                            <Input
                                                id="edit_name"
                                                value={formData.name}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                                className="mt-1.5"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="edit_description" className="text-sm font-medium">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="edit_description"
                                                value={formData.description}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                                className="mt-1.5"
                                                rows={4}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="edit_link" className="text-sm font-medium">
                                                Company Link
                                            </Label>
                                            <Input
                                                id="edit_link"
                                                type="url"
                                                value={formData.link}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                                                className="mt-1.5"
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Images */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Images</h3>
                                        <div>
                                            <Label htmlFor="edit_logo" className="text-sm font-medium">
                                                Company Logo
                                            </Label>
                                            <Input
                                                id="edit_logo"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'logo')}
                                                className="mt-1.5"
                                            />
                                            {selectedCompany && (
                                                <div className="mt-2">
                                                    <p className="mb-2 text-sm font-medium">Current Logo:</p>
                                                    <ImagePreview images={selectedCompany.logo ? [selectedCompany.logo] : []} type="logo" />
                                                </div>
                                            )}
                                            {imagePreviews.logo && (
                                                <div className="mt-2">
                                                    <p className="mb-2 text-sm font-medium">New Logo:</p>
                                                    <ImagePreview images={imagePreviews.logo ? [imagePreviews.logo] : []} type="logo" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="edit_certification_images" className="text-sm font-medium">
                                                Certification Images
                                            </Label>
                                            <Input
                                                id="edit_certification_images"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'certification_images')}
                                                className="mt-1.5"
                                            />
                                            <p className="text-muted-foreground mt-1 text-sm">
                                                Selected: {formData.certification_images.length} images
                                            </p>
                                            {selectedCompany && (
                                                <div className="mt-2">
                                                    <p className="mb-2 text-sm font-medium">Current Images:</p>
                                                    <ImagePreview
                                                        images={(selectedCompany?.certification_images || [])
                                                            .filter((img) => !removedImages.certification_images.includes(img))
                                                            .filter((img): img is string => typeof img === 'string')}
                                                        type="certification_images"
                                                    />
                                                </div>
                                            )}
                                            {imagePreviews.certification_images.length > 0 && (
                                                <div className="mt-2">
                                                    <p className="mb-2 text-sm font-medium">New Images:</p>
                                                    <ImagePreview
                                                        images={
                                                            imagePreviews.certification_images?.filter(
                                                                (img): img is string => typeof img === 'string',
                                                            ) || []
                                                        }
                                                        type="certification_images"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 border-t pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditDialogOpen(false);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Company</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p>Are you sure you want to delete this company? This action cannot be undone.</p>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>
                                {isSubmitting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
