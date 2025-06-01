import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const CERTIFICATE_OPTIONS = [
    'PLASTIC FREE',
    'USDA ORGANIC',
    'NON-GMO',
    'FRAGRANCE FREE',
    'PALM OIL FREE',
    'BIODEGRADABLE',
    'FAIR TRADE',
    'REUSABLE',
    'COMPOSTABLE',
];

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    original_price: number;
    is_new: boolean;
    certificates: string[] | null;
    images: string[];
    certificates_images: string[];
    product_link: string | null;
    category: string | null;
    product_details: { name: string; value: string }[] | null;
}

interface Props {
    products: {
        data: Product[];
        links: any;
    };
}

export default function Index({ products }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        original_price: '',
        is_new: false,
        certificates: [] as string[],
        product_images: [] as File[],
        certificate_images: [] as File[],
        product_link: '',
        category: '',
        product_details: [] as { name: string; value: string }[],
    });

    const [imagePreviews, setImagePreviews] = useState<{
        product_images: string[];
        certificate_images: string[];
    }>({
        product_images: [],
        certificate_images: [],
    });

    const [removedImages, setRemovedImages] = useState<{
        product_images: string[];
        certificate_images: string[];
    }>({
        product_images: [],
        certificate_images: [],
    });

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            original_price: '',
            is_new: false,
            certificates: [],
            product_images: [],
            certificate_images: [],
            product_link: '',
            category: '',
            product_details: [],
        });
        setImagePreviews({
            product_images: [],
            certificate_images: [],
        });
        setRemovedImages({
            product_images: [],
            certificate_images: [],
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        const formDataToSend = new FormData();

        console.log('Form data before sending:', formData);

        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'product_images' || key === 'certificate_images') {
                const files = value as File[];
                files.forEach((file) => {
                    formDataToSend.append(`${key}[]`, file);
                });
            } else if (key === 'is_new') {
                formDataToSend.append(key, value ? 'true' : 'false');
            } else if (key === 'certificates') {
                const certs = value as string[];
                certs.forEach((cert: string) => {
                    formDataToSend.append('certificates[]', cert);
                });
            } else if (key === 'product_details') {
                const details = value as { name: string; value: string }[];
                formDataToSend.append('product_details', JSON.stringify(details));
            } else {
                formDataToSend.append(key, value.toString());
            }
        });

        // Add removed images to form data
        if (selectedProduct) {
            removedImages.product_images.forEach((image) => {
                formDataToSend.append('remove_product_images[]', image);
            });
            removedImages.certificate_images.forEach((image) => {
                formDataToSend.append('remove_certificate_images[]', image);
            });
        }

        for (let pair of formDataToSend.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        if (selectedProduct) {
            router.post(route('products.update', selectedProduct.id), formDataToSend, {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    toast.success('Product updated successfully');
                    resetForm();
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    console.error('Update errors:', errors);
                    Object.entries(errors).forEach(([key, value]) => {
                        toast.error(`${key}: ${value}`);
                    });
                    setIsSubmitting(false);
                },
            });
        } else {
            router.post(route('products.store'), formDataToSend, {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    toast.success('Product created successfully');
                    resetForm();
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    console.error('Create errors:', errors);
                    Object.entries(errors).forEach(([key, value]) => {
                        toast.error(`${key}: ${value}`);
                    });
                    setIsSubmitting(false);
                },
            });
        }
    };

    const handleDelete = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedProduct || isSubmitting) return;

        setIsSubmitting(true);
        router.delete(route('products.destroy', selectedProduct.id), {
            onSuccess: () => {
                toast.success('Product deleted successfully');
                setIsDeleteDialogOpen(false);
                setIsSubmitting(false);
            },
            onError: () => {
                toast.error('Failed to delete product');
                setIsSubmitting(false);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'product_images' | 'certificate_images') => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const maxFiles = type === 'product_images' ? 4 : 5;

            if (files.length > maxFiles) {
                toast.error(`Maximum ${maxFiles} ${type === 'product_images' ? 'product' : 'certificate'} images allowed`);
                return;
            }

            // Create preview URLs for the selected files
            const previews = files.map((file) => URL.createObjectURL(file));

            setFormData((prev) => ({
                ...prev,
                [type]: files,
            }));

            setImagePreviews((prev) => ({
                ...prev,
                [type]: previews,
            }));
        }
    };

    const removeImage = (type: 'product_images' | 'certificate_images', index: number, imagePath?: string) => {
        if (imagePath) {
            // Remove existing image in edit mode
            setRemovedImages((prev) => ({
                ...prev,
                [type]: [...prev[type], imagePath],
            }));
        } else {
            // Remove newly uploaded image
            setFormData((prev) => ({
                ...prev,
                [type]: prev[type].filter((_, i) => i !== index),
            }));
            setImagePreviews((prev) => ({
                ...prev,
                [type]: prev[type].filter((_, i) => i !== index),
            }));
        }
    };

    // Cleanup preview URLs when component unmounts
    useEffect(() => {
        return () => {
            Object.values(imagePreviews)
                .flat()
                .forEach((url) => {
                    URL.revokeObjectURL(url);
                });
        };
    }, [imagePreviews]);

    const ImagePreview = ({
        images,
        type,
        existingImages = [],
    }: {
        images: string[];
        type: 'product_images' | 'certificate_images';
        existingImages?: string[];
    }) => (
        <div className="mt-2 grid grid-cols-4 gap-2">
            {images.map((image, index) => (
                <div key={index} className="group relative aspect-square w-full overflow-hidden rounded-lg border">
                    <img src={image} alt={`${type} preview ${index + 1}`} className="h-full w-full object-cover" />
                    <button
                        type="button"
                        onClick={() => removeImage(type, index)}
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

    const ExistingImagePreview = ({ images, type }: { images: string[]; type: 'product_images' | 'certificate_images' }) => (
        <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
                <div key={index} className="group relative aspect-square w-full overflow-hidden rounded-lg border">
                    <img src={`/storage/${image}`} alt={`${type} ${index + 1}`} className="h-full w-full object-cover" />
                    <button
                        type="button"
                        onClick={() => removeImage(type, index, image)}
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

    const handleCertificateChange = (certificate: string) => {
        setFormData((prev) => {
            const newCertificates = prev.certificates.includes(certificate)
                ? prev.certificates.filter((c) => c !== certificate)
                : [...prev.certificates, certificate];
            return { ...prev, certificates: newCertificates };
        });
    };

    const addProductDetail = () => {
        setFormData((prev) => ({
            ...prev,
            product_details: [...prev.product_details, { name: '', value: '' }],
        }));
    };

    const removeProductDetail = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            product_details: prev.product_details.filter((_, i) => i !== index),
        }));
    };

    const updateProductDetail = (index: number, field: 'name' | 'value', value: string) => {
        setFormData((prev) => ({
            ...prev,
            product_details: prev.product_details.map((detail, i) => (i === index ? { ...detail, [field]: value } : detail)),
        }));
    };

    return (
        <AppLayout>
            <Head title="Products" />
            <div className="container mx-auto py-10">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Products</h1>
                    <Button onClick={() => setIsCreateModalOpen(true)}>Add Product</Button>
                </div>

                <Dialog
                    open={isCreateModalOpen}
                    onOpenChange={(open) => {
                        if (!open && !isSubmitting) {
                            setIsCreateModalOpen(false);
                        }
                    }}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px] [&>button]:hidden">
                        <DialogHeader className="space-y-3 border-b pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <DialogTitle className="text-2xl font-semibold">Add New Product</DialogTitle>
                                    <p className="text-muted-foreground text-sm">Fill in the details below to create a new product.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
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
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                            required
                                            className="mt-1.5"
                                            placeholder="Enter product name"
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
                                            placeholder="Enter product description"
                                            rows={4}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="price" className="text-sm font-medium">
                                                Price
                                            </Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={formData.price}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                                                required
                                                className="mt-1.5"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="original_price" className="text-sm font-medium">
                                                Original Price
                                            </Label>
                                            <Input
                                                id="original_price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={formData.original_price}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, original_price: e.target.value }))}
                                                className="mt-1.5"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="product_link" className="text-sm font-medium">
                                                Product Link
                                            </Label>
                                            <Input
                                                id="product_link"
                                                type="url"
                                                value={formData.product_link}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, product_link: e.target.value }))}
                                                className="mt-1.5"
                                                placeholder="https://example.com/product"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="category" className="text-sm font-medium">
                                                Category
                                            </Label>
                                            <select
                                                id="category"
                                                value={formData.category}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring mt-1.5 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                            >
                                                <option value="">Select a category</option>
                                                <option value="food-beverage">Food & Beverage</option>
                                                <option value="health-wellness">Health & Wellness</option>
                                                <option value="personal-care">Personal Care</option>
                                                <option value="home-cleaning">Home Cleaning</option>
                                                <option value="kitchen-essentials">Kitchen Essentials</option>
                                                <option value="baby-kids">Baby & Kids</option>
                                                <option value="clothing-textiles">Clothing & Textiles</option>
                                                <option value="sustainable-living">Sustainable Living</option>
                                                <option value="pet-care">Pet Care</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 pt-2">
                                        <Switch
                                            id="is_new"
                                            checked={formData.is_new}
                                            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_new: checked }))}
                                        />
                                        <Label htmlFor="is_new" className="text-sm font-medium">
                                            New Product
                                        </Label>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium">Certificates</Label>
                                        <div className="mt-2 grid max-h-[200px] grid-cols-1 gap-2 overflow-y-auto rounded-md border p-2">
                                            {CERTIFICATE_OPTIONS.map((cert) => (
                                                <div key={cert} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={cert}
                                                        checked={formData.certificates.includes(cert)}
                                                        onCheckedChange={() => handleCertificateChange(cert)}
                                                    />
                                                    <Label htmlFor={cert} className="text-sm font-normal">
                                                        {cert}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 border-t pt-4">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="product_images" className="text-sm font-medium">
                                            Product Images (Max 4)
                                        </Label>
                                        <Input
                                            id="product_images"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'product_images')}
                                            className="mt-1.5"
                                        />
                                        <p className="text-muted-foreground mt-1 text-sm">Selected: {formData.product_images.length} images</p>
                                        <ImagePreview images={imagePreviews.product_images} type="product_images" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="certificate_images" className="text-sm font-medium">
                                            Certificate Images (Max 5)
                                        </Label>
                                        <Input
                                            id="certificate_images"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'certificate_images')}
                                            className="mt-1.5"
                                        />
                                        <p className="text-muted-foreground mt-1 text-sm">Selected: {formData.certificate_images.length} images</p>
                                        <ImagePreview images={imagePreviews.certificate_images} type="certificate_images" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Additional Details</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addProductDetail} className="flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M12 5v14" />
                                            <path d="M5 12h14" />
                                        </svg>
                                        Add Detail
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {formData.product_details.map((detail, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="flex-1 space-y-2">
                                                <Input
                                                    placeholder="Detail name (e.g., SKU, Shipping)"
                                                    value={detail.name}
                                                    onChange={(e) => updateProductDetail(index, 'name', e.target.value)}
                                                />
                                                <Input
                                                    placeholder="Detail value"
                                                    value={detail.value}
                                                    onChange={(e) => updateProductDetail(index, 'value', e.target.value)}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeProductDetail(index)}
                                                className="mt-2"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M18 6 6 18" />
                                                    <path d="m6 6 12 12" />
                                                </svg>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <DialogFooter className="border-t pt-4">
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Product'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Certificates</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.data.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>{product.category || '-'}</TableCell>
                                    <TableCell>
                                        {product.is_new ? (
                                            <Badge className="bg-green-500">New</Badge>
                                        ) : (
                                            <Badge className="border-none bg-transparent shadow-none"></Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {(product.certificates || []).map((cert) => (
                                                <Badge key={cert} variant="outline">
                                                    {cert}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            {(product.product_details || []).map((detail, index) => (
                                                <div key={index} className="text-sm">
                                                    <span className="font-medium">{detail.name}:</span> {detail.value}
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setFormData({
                                                        name: product.name,
                                                        description: product.description,
                                                        price: product.price.toString(),
                                                        original_price: product.original_price?.toString() || '',
                                                        is_new: product.is_new,
                                                        certificates: product.certificates || [],
                                                        product_images: [],
                                                        certificate_images: [],
                                                        product_link: product.product_link || '',
                                                        category: product.category || '',
                                                        product_details: product.product_details || [],
                                                    });
                                                    setImagePreviews({
                                                        product_images: [],
                                                        certificate_images: [],
                                                    });
                                                    setIsEditModalOpen(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button variant="destructive" onClick={() => handleDelete(product)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog
                open={isEditModalOpen}
                onOpenChange={(open) => {
                    if (!open && !isSubmitting) {
                        setIsEditModalOpen(false);
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px] [&>button]:hidden">
                    <DialogHeader className="space-y-3 border-b pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-2xl font-semibold">Edit Product</DialogTitle>
                                <p className="text-muted-foreground text-sm">Update the product details below.</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsEditModalOpen(false);
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
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-name" className="text-sm font-medium">
                                        Name
                                    </Label>
                                    <Input
                                        id="edit-name"
                                        value={formData.name}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                        required
                                        className="mt-1.5"
                                        placeholder="Enter product name"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-description" className="text-sm font-medium">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="edit-description"
                                        value={formData.description}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                        className="mt-1.5"
                                        placeholder="Enter product description"
                                        rows={4}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="edit-price" className="text-sm font-medium">
                                            Price
                                        </Label>
                                        <Input
                                            id="edit-price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                                            required
                                            className="mt-1.5"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="edit-original_price" className="text-sm font-medium">
                                            Original Price
                                        </Label>
                                        <Input
                                            id="edit-original_price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.original_price}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, original_price: e.target.value }))}
                                            className="mt-1.5"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="edit-product_link" className="text-sm font-medium">
                                            Product Link
                                        </Label>
                                        <Input
                                            id="edit-product_link"
                                            type="url"
                                            value={formData.product_link}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, product_link: e.target.value }))}
                                            className="mt-1.5"
                                            placeholder="https://example.com/product"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="edit-category" className="text-sm font-medium">
                                            Category
                                        </Label>
                                        <select
                                            id="edit-category"
                                            value={formData.category}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring mt-1.5 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                        >
                                            <option value="">Select a category</option>
                                            <option value="food-beverage">Food & Beverage</option>
                                            <option value="health-wellness">Health & Wellness</option>
                                            <option value="personal-care">Personal Care</option>
                                            <option value="home-cleaning">Home Cleaning</option>
                                            <option value="kitchen-essentials">Kitchen Essentials</option>
                                            <option value="baby-kids">Baby & Kids</option>
                                            <option value="clothing-textiles">Clothing & Textiles</option>
                                            <option value="sustainable-living">Sustainable Living</option>
                                            <option value="pet-care">Pet Care</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Switch
                                        id="edit-is_new"
                                        checked={formData.is_new}
                                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_new: checked }))}
                                    />
                                    <Label htmlFor="edit-is_new" className="text-sm font-medium">
                                        New Product
                                    </Label>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">Certificates</Label>
                                    <div className="mt-2 grid max-h-[200px] grid-cols-1 gap-2 overflow-y-auto rounded-md border p-2">
                                        {CERTIFICATE_OPTIONS.map((cert) => (
                                            <div key={cert} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`edit-${cert}`}
                                                    checked={formData.certificates.includes(cert)}
                                                    onCheckedChange={() => handleCertificateChange(cert)}
                                                />
                                                <Label htmlFor={`edit-${cert}`} className="text-sm font-normal">
                                                    {cert}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 border-t pt-4">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-product_images" className="text-sm font-medium">
                                        Product Images (Max 4)
                                    </Label>
                                    <Input
                                        id="edit-product_images"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'product_images')}
                                        className="mt-1.5"
                                    />
                                    <p className="text-muted-foreground mt-1 text-sm">Selected: {formData.product_images.length} images</p>
                                    <div className="mt-2">
                                        <p className="mb-2 text-sm font-medium">Current Images:</p>
                                        <ExistingImagePreview
                                            images={selectedProduct?.images.filter((img) => !removedImages.product_images.includes(img)) || []}
                                            type="product_images"
                                        />
                                        <p className="mt-2 text-sm font-medium">New Images:</p>
                                        <ImagePreview images={imagePreviews.product_images} type="product_images" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-certificate_images" className="text-sm font-medium">
                                        Certificate Images (Max 5)
                                    </Label>
                                    <Input
                                        id="edit-certificate_images"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'certificate_images')}
                                        className="mt-1.5"
                                    />
                                    <p className="text-muted-foreground mt-1 text-sm">Selected: {formData.certificate_images.length} images</p>
                                    <div className="mt-2">
                                        <p className="mb-2 text-sm font-medium">Current Images:</p>
                                        <ExistingImagePreview
                                            images={
                                                selectedProduct?.certificates_images.filter(
                                                    (img) => !removedImages.certificate_images.includes(img),
                                                ) || []
                                            }
                                            type="certificate_images"
                                        />
                                        <p className="mt-2 text-sm font-medium">New Images:</p>
                                        <ImagePreview images={imagePreviews.certificate_images} type="certificate_images" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Additional Details</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addProductDetail} className="flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 5v14" />
                                        <path d="M5 12h14" />
                                    </svg>
                                    Add Detail
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {formData.product_details.map((detail, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                placeholder="Detail name (e.g., SKU, Shipping)"
                                                value={detail.name}
                                                onChange={(e) => updateProductDetail(index, 'name', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Detail value"
                                                value={detail.value}
                                                onChange={(e) => updateProductDetail(index, 'value', e.target.value)}
                                            />
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeProductDetail(index)} className="mt-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M18 6 6 18" />
                                                <path d="m6 6 12 12" />
                                            </svg>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="border-t pt-4">
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'Update Product'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product and all associated images.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isSubmitting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
