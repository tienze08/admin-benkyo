"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { usePackages } from "@/hooks/use-list-package";
import { useCreatePackage } from "@/hooks/use-create-package";
import { useUpdatePackage } from "@/hooks/use-update-package";
import { useDeletePackage } from "@/hooks/use-delete-package";

interface Package {
    id: string;
    name: string;
    type: string;
    duration: string;
    price: number;
    features: string[];
    isActive: boolean;
    createdAt: string;
}

const PACKAGE_TYPES = [
    { value: "Basic", label: "Basic" },
    { value: "Pro", label: "Pro" },
    { value: "Premium", label: "Premium" },
];

const PACKAGE_DURATIONS = [
    { value: "3M", label: "3 Months" },
    { value: "6M", label: "6 Months" },
    { value: "1Y", label: "1 Year" },
];

const INITIAL_FORM_DATA = {
    name: "",
    type: "",
    price: "",
    duration: "",
    features: "",
};

const Packages = () => {
    const { data: packages = [], isLoading, error, refetch } = usePackages();
    const createPackageMutation = useCreatePackage();
    const updatePackageMutation = useUpdatePackage();
    const deletePackageMutation = useDeletePackage();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
    };

    // Handle create dialog open/close
    const handleCreateDialogOpen = (open: boolean) => {
        setIsCreateDialogOpen(open);
        if (open) {
            // Reset form when opening create dialog
            resetForm();
        }
    };

    // Handle edit dialog open/close
    const handleEditDialogOpen = (open: boolean) => {
        setIsEditDialogOpen(open);
        if (!open) {
            resetForm();
            setEditingPackage(null);
        }
    };

    const handleCreate = async () => {
        if (
            !formData.name ||
            !formData.price ||
            !formData.type ||
            !formData.duration
        ) {
            return;
        }

        try {
            const newPackage = {
                name: formData.name,
                description: "",
                type: formData.type,
                price: Number.parseFloat(formData.price),
                duration: formData.duration,
                features: formData.features
                    .split(",")
                    .map((f) => f.trim())
                    .filter((f) => f.length > 0),
            };
            await createPackageMutation.mutateAsync(newPackage);
            setIsCreateDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error("Failed to create package", error);
        }
    };
    const handleEdit = (pkg: Package) => {
        console.log("Clicked edit on package:", pkg);
        setEditingPackage(pkg);
        setFormData({
            name: pkg.name,
            type: pkg.type,
            price: pkg.price.toString(),
            duration: pkg.duration,
            features: Array.isArray(pkg.features)
                ? pkg.features.join(", ")
                : pkg.features,
        });
        setIsEditDialogOpen(true);
    };

    console.log("Editing package:", editingPackage?.id);

    const handleUpdate = async () => {
        if (!editingPackage) return;
        console.log("Editing package1234:", editingPackage.id);
        try {
            await updatePackageMutation.mutateAsync({
                id: editingPackage.id,
                name: formData.name,
                type: formData.type,
                price: parseFloat(formData.price),
                duration: formData.duration,
                features: formData.features
                    .split(",")
                    .map((f) => f.trim())
                    .filter((f) => f.length > 0),
            });

            // Sau khi cập nhật thành công
            setIsEditDialogOpen(false);
            setEditingPackage(null);
            resetForm();
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deletePackageMutation.mutateAsync(id);
        } catch (error) {
            console.error("Failed to delete package", error);
        }
    };

    const getDurationLabel = (duration: string) => {
        const found = PACKAGE_DURATIONS.find((d) => d.value === duration);
        return found ? found.label : duration;
    };

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-destructive">
                            Error loading packages
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            {error instanceof Error
                                ? error.message
                                : "Something went wrong"}
                        </p>
                        <Button onClick={() => refetch()} className="mt-4">
                            Try Again
                        </Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Subscription Packages
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your subscription packages and pricing
                        </p>
                    </div>
                    <Dialog
                        open={isCreateDialogOpen}
                        onOpenChange={handleCreateDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Package
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-white">
                            <DialogHeader>
                                <DialogTitle>Create New Package</DialogTitle>
                                <DialogDescription>
                                    Add a new subscription package with pricing
                                    and features.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Package Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., Premium Plan"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Package Type *</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                type: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select package type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            {PACKAGE_TYPES.map((type) => (
                                                <SelectItem
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price ($) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                price: e.target.value,
                                            })
                                        }
                                        placeholder="9.99"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="duration">Duration *</Label>
                                    <Select
                                        value={formData.duration}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                duration: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            {PACKAGE_DURATIONS.map(
                                                (duration) => (
                                                    <SelectItem
                                                        key={duration.value}
                                                        value={duration.value}
                                                    >
                                                        {duration.label}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="features">
                                        Features (comma-separated)
                                    </Label>
                                    <Input
                                        id="features"
                                        value={formData.features}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                features: e.target.value,
                                            })
                                        }
                                        placeholder="Feature 1, Feature 2, Feature 3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCreateDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreate}
                                    disabled={createPackageMutation.isPending}
                                >
                                    {createPackageMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Package"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="border-sidebar-border">
                    <CardHeader>
                        <CardTitle>All Packages</CardTitle>
                        <CardDescription>
                            View and manage all subscription packages
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center h-32">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span className="ml-2">
                                    Loading packages...
                                </span>
                            </div>
                        ) : packages.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                    No packages found
                                </p>
                                <Button
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    className="mt-4"
                                >
                                    Create your first package
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-sidebar-border">
                                        <TableHead>Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Features</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {packages.map((pkg) => (
                                        <TableRow
                                            key={pkg.id}
                                            className="border-b border-sidebar-border"
                                        >
                                            <TableCell className="font-medium">
                                                {pkg.name}
                                            </TableCell>
                                            <TableCell>{pkg.type}</TableCell>
                                            <TableCell>
                                                ${pkg.price.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                {getDurationLabel(pkg.duration)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-xs">
                                                    {Array.isArray(pkg.features)
                                                        ? pkg.features.join(
                                                              ", "
                                                          )
                                                        : pkg.features}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        pkg.isActive
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                                    }`}
                                                >
                                                    {pkg.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    pkg.createdAt
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleEdit(pkg)
                                                        }
                                                        className="border-sidebar-border"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="border-sidebar-border bg-transparent"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="bg-white">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Are you
                                                                    sure?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action
                                                                    cannot be
                                                                    undone. This
                                                                    will
                                                                    permanently
                                                                    delete the "
                                                                    {pkg.name}"
                                                                    package.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            pkg.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        deletePackageMutation.isPending
                                                                    }
                                                                >
                                                                    {deletePackageMutation.isPending ? (
                                                                        <>
                                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                            Deleting...
                                                                        </>
                                                                    ) : (
                                                                        "Delete"
                                                                    )}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={handleEditDialogOpen}
                >
                    <DialogContent className="sm:max-w-[425px] bg-white">
                        <DialogHeader>
                            <DialogTitle>Edit Package</DialogTitle>
                            <DialogDescription>
                                Update the package details and features.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">
                                    Package Name *
                                </Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., Premium Plan"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-type">
                                    Package Type *
                                </Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            type: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select package type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {PACKAGE_TYPES.map((type) => (
                                            <SelectItem
                                                key={type.value}
                                                value={type.value}
                                            >
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-price">Price ($) *</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            price: e.target.value,
                                        })
                                    }
                                    placeholder="9.99"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-duration">
                                    Duration *
                                </Label>
                                <Select
                                    value={formData.duration}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            duration: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {PACKAGE_DURATIONS.map((duration) => (
                                            <SelectItem
                                                key={duration.value}
                                                value={duration.value}
                                            >
                                                {duration.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-features">
                                    Features (comma-separated)
                                </Label>
                                <Input
                                    id="edit-features"
                                    value={formData.features}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            features: e.target.value,
                                        })
                                    }
                                    placeholder="Feature 1, Feature 2, Feature 3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdate}
                                disabled={updatePackageMutation.isPending}
                            >
                                {updatePackageMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Package"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default Packages;
