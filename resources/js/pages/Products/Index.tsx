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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { categories } from '@/constants/categories';
import AppLayout from '@/layouts/app-layout';
import { getCertificatesForCategory } from '@/lib/utils';
import { Head, router as inertiaRouter } from '@inertiajs/react';
import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Update the certificates constant to be organized by category
const certificatesByCategory = {
    'food-beverage': ['USDA ORGANIC', 'NON-GMO', 'PLASTIC FREE', 'HEAVY METAL FREE', 'KOSHER', 'HALAL', 'VEGAN', 'GLUTEN-FREE'],
    'health-wellness': ['USDA ORGANIC', 'NON-GMO', 'PLASTIC FREE', 'HEAVY METAL FREE', 'VEGAN', 'GLUTEN-FREE'],
    'personal-care': ['FRAGRANCE FREE', 'PARABEN FREE', 'PHTHALATE FREE', 'SULFATE FREE', 'PLASTIC FREE', 'VEGAN', 'HYPOALLERGENIC'],
    'home-cleaning': ['GREEN SEAL CERTIFIED', 'EPA SAFER CHOICE', 'EWG VERIFIED', 'PLASTIC FREE'],
    'kitchen-essentials': ['PLASTIC FREE', 'PFAS FREE', 'MADE SAFE'],
    'baby-kids': ['MADE SAFE', 'GOTS ORGANIC', 'OEKO TEX STANDARD 100', 'GREENGUARD GOLD', 'FSC'],
    clothing: ['GOTS ORGANIC', 'OEKO-TEX STANDARD 100', 'BLUESIGN', 'FAIR TRADE'],
    'pet-care': ['USDA ORGANIC', 'OEKO-TEX STANDARD 100', 'GOTS ORGANIC', 'BPA FREE', 'PFAS FREE'],
    'home-textiles': ['GOTS ORGANIC', 'OEKO-TEX STANDARD 100', 'FAIR TRADE'],
    'air-purifiers': ['TRUE HEPA'],
    'water-filters': ['NSF 177 CERTIFIED'],
    'office-supplies': {
        writing: ['ASTM D-4236', 'FSC', 'CRADLE TO CRADLE CERTIFIED'],
        paper: ['FSC', 'OEKO TEX 100', 'CRADLE TO CRADLE', 'UL ECOLOGO®'],
    },
    'beauty-cosmetics': ['PFAS FREE', 'PHTHALATE FREE', 'PARABEN FREE', 'PLASTIC FREE', 'USDA ORGANIC', 'MADE SAFE', 'EWG CERTIFIED', 'VEGAN'],
};

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    original_price: number;
    is_new: boolean;
    certificates: string[] | null;
    images: string[];
    product_link: string | null;
    category: string | null;
    sub_category: string | null;
    item: string | null;
    product_details: { name: string; value: string }[] | null;
    company: {
        id: number;
        name: string;
    };
}

interface Props {
    products: {
        data: Product[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    companies: Array<{ id: number; name: string }>;
}

export default function Index({ products, companies }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add new state variables for filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        original_price: '',
        is_new: false,
        certificates: [] as string[],
        product_images: [] as File[],
        product_link: '',
        category: '',
        sub_category: '',
        item: '',
        product_details: [] as { name: string; value: string }[],
        company_id: '',
    });

    // Add state for tracking removed images
    const [removedImages, setRemovedImages] = useState<string[]>([]);

    // Add image previews state
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // Get current category's sub-categories and items
    const currentCategorySubCategories = selectedCategory ? categories.find((cat) => cat.id === selectedCategory)?.subCategories || [] : [];
    const currentSubCategoryItems = selectedSubCategory
        ? currentCategorySubCategories.find((sub) => sub.id === selectedSubCategory)?.items || []
        : [];

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            original_price: '',
            is_new: false,
            certificates: [],
            product_images: [],
            product_link: '',
            category: '',
            sub_category: '',
            item: '',
            product_details: [],
            company_id: '',
        });
        setSelectedCertificates([]);
        setRemovedImages([]);
        setImagePreviews([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        // Add basic fields
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'product_images') {
                const files = value as File[];
                files.forEach((file) => {
                    formDataToSend.append(`${key}[]`, file);
                });
            } else if (key === 'is_new') {
                formDataToSend.append(key, value ? '1' : '0');
            } else if (key === 'product_details') {
                // Send each product detail as a separate array entry
                const details = value as { name: string; value: string }[];
                details.forEach((detail, index) => {
                    if (detail.name && detail.value) {
                        // Only send if both name and value are present
                        formDataToSend.append(`product_details[${index}][name]`, detail.name);
                        formDataToSend.append(`product_details[${index}][value]`, detail.value);
                    }
                });
            } else if (key === 'certificates') {
                // Send certificates as an array
                selectedCertificates.forEach((cert) => {
                    formDataToSend.append('certificates[]', cert);
                });
            } else if (value !== null && value !== undefined) {
                formDataToSend.append(key, value.toString());
            }
        });

        // Add removed images
        if (selectedProduct && removedImages.length > 0) {
            removedImages.forEach((image) => {
                formDataToSend.append('remove_product_images[]', image);
            });
        }

        const routeUrl = selectedProduct ? route('products.update', selectedProduct.id) : route('products.store');

        inertiaRouter.post(routeUrl, formDataToSend, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Product ${selectedProduct ? 'updated' : 'created'} successfully`);
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
            },
            onError: (errors) => {
                console.error('Errors:', errors);
                Object.entries(errors).forEach(([key, value]) => {
                    toast.error(`${key}: ${value}`);
                });
            },
        });
    };

    const handleDelete = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedProduct || isSubmitting) return;

        setIsSubmitting(true);
        inertiaRouter.delete(route('products.destroy', selectedProduct.id), {
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

    // Add function to handle file changes
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const maxFiles = 4;

            if (files.length > maxFiles) {
                toast.error(`Maximum ${maxFiles} product images allowed`);
                return;
            }

            // Create preview URLs for the selected files
            const previews = files.map((file) => URL.createObjectURL(file));

            setFormData((prev) => ({
                ...prev,
                product_images: files,
            }));

            setImagePreviews(previews);
        }
    };

    // Cleanup preview URLs when component unmounts
    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };
    }, [imagePreviews]);

    // Add ImagePreview component
    const ImagePreview = ({ images }: { images: string[] }) => {
        const placeholderImage =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';

        const getImageUrl = (image: string) => {
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

            setFormData((prev) => ({
                ...prev,
                product_images: prev.product_images.filter((_, i) => i !== index),
            }));
            setImagePreviews((prev) => prev.filter((_, i) => i !== index));

            if (selectedProduct?.images[index]) {
                setRemovedImages((prev) => [...prev, selectedProduct.images[index]]);
            }
        };

        return (
            <div className="mt-2 grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                    <div key={index} className="group relative aspect-square w-full overflow-hidden rounded-lg border">
                        <img
                            src={getImageUrl(image)}
                            alt={`Image preview ${index + 1}`}
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

    // Add function to handle certificate changes
    const handleCertificateChange = (certificate: string) => {
        setFormData((prev) => {
            const currentCerts = prev.certificates;
            const newCertificates = currentCerts.includes(certificate)
                ? currentCerts.filter((c) => c !== certificate)
                : [...currentCerts, certificate];
            return { ...prev, certificates: newCertificates };
        });
    };

    // Update the renderCertificates function to handle all possible formats
    const renderCertificates = (certificates: string | string[] | null) => {
        if (!certificates) return null;

        let certs: string[] = [];

        if (Array.isArray(certificates)) {
            certs = certificates;
        } else {
            try {
                // Try to parse as JSON first
                certs = JSON.parse(certificates);
            } catch {
                // If parsing fails, try to split by comma
                certs = certificates.split(',').map((cert) => cert.trim());
            }
        }

        return (
            <div className="flex flex-wrap gap-1.5">
                {certs.map((cert: string) => (
                    <Badge key={cert} variant="secondary" className="text-xs">
                        {cert}
                    </Badge>
                ))}
            </div>
        );
    };

    // Update the table cell for certificates
    // <TableCell>{renderCertificates(product.certificates)}</TableCell>

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

    // Update the search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            const params: Record<string, string> = {};
            if (searchQuery) params.search = searchQuery;
            if (selectedCompany) params.company = selectedCompany;
            if (selectedCategory) params.category = selectedCategory;
            if (selectedSubCategory) params.sub_category = selectedSubCategory;
            if (selectedItem) params.item = selectedItem;
            if (priceRange[0] > 0 || priceRange[1] < 1000) {
                params.min_price = priceRange[0].toString();
                params.max_price = priceRange[1].toString();
            }
            if (selectedCertificates.length > 0) {
                params.certificates = JSON.stringify(selectedCertificates);
            }
            params.sort_by = sortBy;
            params.sort_direction = sortDirection;
            // Preserve the current page when filters change
            if (products.current_page > 1) {
                params.page = products.current_page.toString();
            }

            inertiaRouter.get(route('products.index'), params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedCompany, selectedCategory, selectedSubCategory, selectedItem, priceRange, selectedCertificates, sortBy, sortDirection]);

    // Add sorting handler
    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCompany('');
        setSelectedCategory('');
        setSelectedSubCategory('');
        setSelectedItem('');
        setPriceRange([0, 1000]);
        setSelectedCertificates([]);
        setSortBy('created_at');
        setSortDirection('desc');
        // Reset to page 1 when filters are reset
        inertiaRouter.get(route('products.index'));
    };

    // Add sort indicators to table headers
    const SortIndicator = ({ column }: { column: string }) => {
        if (sortBy !== column) return null;
        return sortDirection === 'asc' ? ' ↑' : ' ↓';
    };

    // Remove the client-side filtering
    const filteredProducts = products.data;

    // Update the toggleCertificate function
    const toggleCertificate = (cert: string) => {
        setSelectedCertificates((prev) => (prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]));
    };

    // Update the handleEditProduct function to handle certificates as an array
    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            original_price: product.original_price?.toString() || '',
            is_new: product.is_new,
            certificates: product.certificates || [],
            product_images: [],
            product_link: product.product_link || '',
            category: product.category || '',
            sub_category: product.sub_category || '',
            item: product.item || '',
            product_details: product.product_details || [],
            company_id: product.company.id.toString(),
        });
        setImagePreviews([]);
        setSelectedCertificates(product.certificates || []);
        setIsEditModalOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Products" />
            <div className="container mx-auto px-2 py-10">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Products</h1>
                    <Button onClick={() => setIsCreateModalOpen(true)}>Add Product</Button>
                </div>

                {/* Replace the search and filter section with this simplified version */}
                <div className="mb-6 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Company Filter */}
                        <div className="w-[200px]">
                            <select
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value)}
                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                            >
                                <option value="">All Companies</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.name}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div className="w-[200px]">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range Filter */}
                        <div className="w-[200px]">
                            <select
                                value={`${priceRange[0]}-${priceRange[1]}`}
                                onChange={(e) => {
                                    const [min, max] = e.target.value.split('-').map(Number);
                                    setPriceRange([min, max]);
                                }}
                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                            >
                                <option value="0-1000">All Prices</option>
                                <option value="0-25">$0 - $25</option>
                                <option value="25-50">$25 - $50</option>
                                <option value="50-100">$50 - $100</option>
                                <option value="100-1000">$100+</option>
                            </select>
                        </div>

                        {/* Reset Filters Button */}
                        <Button variant="ghost" onClick={resetFilters} className="text-muted-foreground">
                            Reset Filters
                        </Button>
                    </div>

                    {/* Show active filters */}
                    {(selectedCompany || selectedCategory || priceRange[0] > 0 || priceRange[1] < 1000) && (
                        <div className="flex flex-wrap gap-2">
                            {selectedCompany && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Company: {selectedCompany}
                                    <button onClick={() => setSelectedCompany('')} className="hover:bg-muted ml-1 rounded-full p-0.5">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
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
                                    </button>
                                </Badge>
                            )}
                            {selectedCategory && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Category: {categories.find((cat) => cat.id === selectedCategory)?.name}
                                    <button onClick={() => setSelectedCategory('')} className="hover:bg-muted ml-1 rounded-full p-0.5">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
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
                                    </button>
                                </Badge>
                            )}
                            {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Price: ${priceRange[0]} - ${priceRange[1]}
                                    <button onClick={() => setPriceRange([0, 1000])} className="hover:bg-muted ml-1 rounded-full p-0.5">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
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
                                    </button>
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-card rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-muted/50">
                                <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort('name')}>
                                    Name <SortIndicator column="name" />
                                </TableHead>
                                <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort('price')}>
                                    Price <SortIndicator column="price" />
                                </TableHead>
                                <TableHead className="w-[150px] cursor-pointer" onClick={() => handleSort('category')}>
                                    Category <SortIndicator column="category" />
                                </TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                                <TableHead className="w-[200px]">Certificates</TableHead>
                                <TableHead className="w-[200px]">Details</TableHead>
                                <TableHead className="w-[150px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.data.map((product) => (
                                <TableRow key={product.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <span className="capitalize">{product.category?.replace(/-/g, ' ') || '-'}</span>
                                    </TableCell>
                                    <TableCell>
                                        {product.is_new ? (
                                            <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
                                        ) : (
                                            <Badge variant="outline" className="border-none bg-transparent shadow-none">
                                                -
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{renderCertificates(product.certificates)}</TableCell>
                                    <TableCell>
                                        <div className="space-y-1.5">
                                            {(product.product_details || []).map((detail, index) => (
                                                <div key={index} className="text-muted-foreground text-sm">
                                                    <span className="text-foreground font-medium">{detail.name}:</span> {detail.value}
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)} className="h-8 px-3">
                                                Edit
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(product)} className="h-8 px-3">
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
                {products.links.length > 3 && (
                    <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        {/* Left side - Previous button and page info */}
                        <div className="order-2 flex items-center space-x-4 sm:order-1">
                            <Button
                                variant="outline"
                                onClick={() => products.prev_page_url && inertiaRouter.get(products.prev_page_url)}
                                disabled={!products.prev_page_url}
                            >
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Previous
                            </Button>

                            {/* Page selector dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="min-w-[120px] gap-2">
                                        <span>
                                            Page {products.current_page} of {products.last_page}
                                        </span>
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="max-h-60 overflow-y-auto">
                                    {products.links
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
                            {products.links.map((link, index) =>
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
                                onClick={() => products.next_page_url && inertiaRouter.get(products.next_page_url)}
                                disabled={!products.next_page_url}
                            >
                                Next
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Results Info */}
                <div className="mt-4 text-center text-sm text-gray-600">
                    Showing {products.from || 0}-{products.to || 0} of {products.total} products
                </div>

                <Dialog
                    open={isCreateModalOpen}
                    onOpenChange={(open) => {
                        if (!open && !isSubmitting) {
                            setIsCreateModalOpen(false);
                            resetForm();
                        }
                    }}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[1000px] [&>button]:hidden">
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
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Basic Information</h3>
                                        <div>
                                            <Label htmlFor="name" className="text-sm font-medium">
                                                Product Name
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
                                            <Label htmlFor="company_id" className="text-sm font-medium">
                                                Company
                                            </Label>
                                            <select
                                                id="company_id"
                                                value={formData.company_id}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, company_id: e.target.value }))}
                                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring mt-1.5 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                required
                                            >
                                                <option value="">Select a company</option>
                                                {companies.map((company) => (
                                                    <option key={company.id} value={company.id}>
                                                        {company.name}
                                                    </option>
                                                ))}
                                            </select>
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
                                    </div>

                                    {/* Category Selection */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Category</h3>
                                        <div>
                                            <Label htmlFor="category" className="text-sm font-medium">
                                                Category
                                            </Label>
                                            <select
                                                id="category"
                                                value={formData.category}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, category: e.target.value, sub_category: '', item: '' }))
                                                }
                                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring mt-1.5 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                                required
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor="sub_category" className="text-sm font-medium">
                                                Sub Category
                                            </Label>
                                            <select
                                                id="sub_category"
                                                value={formData.sub_category}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, sub_category: e.target.value, item: '' }))}
                                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring mt-1.5 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                                required
                                            >
                                                <option value="">Select a sub-category</option>
                                                {categories
                                                    .find((cat) => cat.id === formData.category)
                                                    ?.subCategories?.map((subCategory) => (
                                                        <option key={subCategory.id} value={subCategory.id}>
                                                            {subCategory.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor="item" className="text-sm font-medium">
                                                Item
                                            </Label>
                                            <select
                                                id="item"
                                                value={formData.item}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, item: e.target.value }))}
                                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring mt-1.5 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                                required
                                            >
                                                <option value="">Select an item</option>
                                                {categories
                                                    .find((cat) => cat.id === formData.category)
                                                    ?.subCategories?.find((sub) => sub.id === formData.sub_category)
                                                    ?.items?.map((item) => (
                                                        <option key={item} value={item}>
                                                            {item}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Pricing</h3>
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
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Status */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Status</h3>
                                        <div className="flex items-center space-x-2">
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

                                    {/* Certificates */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Certificates</h3>
                                        <div className="mt-2 grid max-h-[200px] grid-cols-1 gap-2 overflow-y-auto rounded-md border p-2">
                                            {(() => {
                                                const certificates = getCertificatesForCategory(
                                                    certificatesByCategory,
                                                    formData.category,
                                                    formData.sub_category,
                                                );
                                                if (certificates.length > 0) {
                                                    return certificates.map((cert) => (
                                                        <div key={cert} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={cert}
                                                                checked={selectedCertificates.includes(cert)}
                                                                onCheckedChange={() => toggleCertificate(cert)}
                                                            />
                                                            <Label htmlFor={cert} className="text-sm font-normal">
                                                                {cert}
                                                            </Label>
                                                        </div>
                                                    ));
                                                }
                                                return <p className="text-sm text-gray-500">No certificates available for this category</p>;
                                            })()}
                                        </div>
                                    </div>

                                    {/* Images */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Images</h3>
                                        <div>
                                            <Label htmlFor="product_images" className="text-sm font-medium">
                                                Product Images
                                            </Label>
                                            <Input
                                                id="product_images"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="mt-1.5"
                                            />
                                            <p className="text-muted-foreground mt-1 text-sm">Selected: {formData.product_images.length} images</p>
                                            {imagePreviews.length > 0 && (
                                                <div className="mt-2">
                                                    <p className="mb-2 text-sm font-medium">Image Previews:</p>
                                                    <ImagePreview images={imagePreviews} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Additional Details */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium">Additional Details</h3>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addProductDetail}
                                                className="flex items-center gap-2"
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

                <Dialog
                    open={isEditModalOpen}
                    onOpenChange={(open) => {
                        if (!open && !isSubmitting) {
                            setIsEditModalOpen(false);
                        }
                    }}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[1000px] [&>button]:hidden">
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
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Basic Information</h3>
                                        <div>
                                            <Label htmlFor="name" className="text-sm font-medium">
                                                Product Name
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
                                            <Label htmlFor="company_id" className="text-sm font-medium">
                                                Company
                                            </Label>
                                            <select
                                                id="company_id"
                                                value={formData.company_id}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, company_id: e.target.value }))}
                                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring mt-1.5 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                required
                                            >
                                                <option value="">Select a company</option>
                                                {companies.map((company) => (
                                                    <option key={company.id} value={company.id}>
                                                        {company.name}
                                                    </option>
                                                ))}
                                            </select>
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
                                    </div>

                                    {/* Category Selection */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Category</h3>
                                        <div>
                                            <Label htmlFor="category" className="text-sm font-medium">
                                                Category
                                            </Label>
                                            <select
                                                id="category"
                                                value={formData.category}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, category: e.target.value, sub_category: '', item: '' }))
                                                }
                                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring mt-1.5 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                                required
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor="sub_category" className="text-sm font-medium">
                                                Sub Category
                                            </Label>
                                            <select
                                                id="sub_category"
                                                value={formData.sub_category}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, sub_category: e.target.value, item: '' }))}
                                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring mt-1.5 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                                required
                                            >
                                                <option value="">Select a sub-category</option>
                                                {categories
                                                    .find((cat) => cat.id === formData.category)
                                                    ?.subCategories?.map((subCategory) => (
                                                        <option key={subCategory.id} value={subCategory.id}>
                                                            {subCategory.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor="item" className="text-sm font-medium">
                                                Item
                                            </Label>
                                            <select
                                                id="item"
                                                value={formData.item}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, item: e.target.value }))}
                                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring mt-1.5 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                                required
                                            >
                                                <option value="">Select an item</option>
                                                {categories
                                                    .find((cat) => cat.id === formData.category)
                                                    ?.subCategories?.find((sub) => sub.id === formData.sub_category)
                                                    ?.items?.map((item) => (
                                                        <option key={item} value={item}>
                                                            {item}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Pricing</h3>
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
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Status */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Status</h3>
                                        <div className="flex items-center space-x-2">
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

                                    {/* Certificates */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Certificates</h3>
                                        <div className="mt-2 grid max-h-[200px] grid-cols-1 gap-2 overflow-y-auto rounded-md border p-2">
                                            {(() => {
                                                const certificates = getCertificatesForCategory(
                                                    certificatesByCategory,
                                                    formData.category,
                                                    formData.sub_category,
                                                );
                                                if (certificates.length > 0) {
                                                    return certificates.map((cert) => (
                                                        <div key={cert} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={cert}
                                                                checked={selectedCertificates.includes(cert)}
                                                                onCheckedChange={() => toggleCertificate(cert)}
                                                            />
                                                            <Label htmlFor={cert} className="text-sm font-normal">
                                                                {cert}
                                                            </Label>
                                                        </div>
                                                    ));
                                                }
                                                return <p className="text-sm text-gray-500">No certificates available for this category</p>;
                                            })()}
                                        </div>
                                    </div>

                                    {/* Images */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Images</h3>
                                        <div>
                                            <Label htmlFor="edit_product_images" className="text-sm font-medium">
                                                Product Images
                                            </Label>
                                            <Input
                                                id="edit_product_images"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="mt-1.5"
                                            />
                                            <p className="text-muted-foreground mt-1 text-sm">Selected: {formData.product_images.length} images</p>
                                            {selectedProduct && (
                                                <div className="mt-2">
                                                    <p className="mb-2 text-sm font-medium">Current Images:</p>
                                                    <ImagePreview
                                                        images={(selectedProduct?.images || []).filter((img) => !removedImages.includes(img))}
                                                    />
                                                </div>
                                            )}
                                            {imagePreviews.length > 0 && (
                                                <div className="mt-2">
                                                    <p className="mb-2 text-sm font-medium">New Images:</p>
                                                    <ImagePreview images={imagePreviews} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Additional Details */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium">Additional Details</h3>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addProductDetail}
                                                className="flex items-center gap-2"
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
            </div>
        </AppLayout>
    );
}
