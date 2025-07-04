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
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Package {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
    features: string[];
}

const Packages = () => {
    const { toast } = useToast();
    const [packages, setPackages] = useState<Package[]>([
        {
            id: "1",
            name: "Basic Plan",
            description: "Perfect for small businesses",
            price: 9.99,
            duration: "monthly",
            features: ["5 Projects", "Basic Support", "2GB Storage"],
        },
        {
            id: "2",
            name: "Premium Plan",
            description: "Great for growing companies",
            price: 29.99,
            duration: "monthly",
            features: [
                "Unlimited Projects",
                "Priority Support",
                "50GB Storage",
                "Advanced Analytics",
            ],
        },
        {
            id: "3",
            name: "Enterprise Plan",
            description: "Best for large organizations",
            price: 99.99,
            duration: "monthly",
            features: [
                "Unlimited Everything",
                "24/7 Support",
                "500GB Storage",
                "Custom Integrations",
                "Dedicated Manager",
            ],
        },
    ]);

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        duration: "monthly",
        features: "",
    });

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            duration: "monthly",
            features: "",
        });
    };

    const handleCreate = () => {
        if (!formData.name || !formData.price) {
            toast.error("Please fill in all required fields", {
                description: "Name and price are required",
            });
            return;
        }

        const newPackage: Package = {
            id: Date.now().toString(),
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            duration: formData.duration,
            features: formData.features
                .split(",")
                .map((f) => f.trim())
                .filter((f) => f.length > 0),
        };

        setPackages([...packages, newPackage]);
        setIsCreateDialogOpen(false);
        resetForm();
        toast("Package created successfully", {
            description: "Your new plan is active.",
        });
    };

    const handleEdit = (pkg: Package) => {
        setEditingPackage(pkg);
        setFormData({
            name: pkg.name,
            description: pkg.description,
            price: pkg.price.toString(),
            duration: pkg.duration,
            features: pkg.features.join(", "),
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = () => {
        if (!formData.name || !formData.price || !editingPackage) {
            toast.error("Please fill in all required fields", {
                description: "Name and price are required",
            });

            return;
        }

        const updatedPackage: Package = {
            ...editingPackage,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            duration: formData.duration,
            features: formData.features
                .split(",")
                .map((f) => f.trim())
                .filter((f) => f.length > 0),
        };

        setPackages(
            packages.map((pkg) =>
                pkg.id === editingPackage.id ? updatedPackage : pkg
            )
        );
        setIsEditDialogOpen(false);
        setEditingPackage(null);
        resetForm();
        toast.success("Package updated successfully");
    };

    const handleDelete = (id: string) => {
        setPackages(packages.filter((pkg) => pkg.id !== id));
        toast.success("Package deleted successfully");
    };

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
                        onOpenChange={setIsCreateDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Package
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
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
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Input
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        placeholder="Package description"
                                    />
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
                                    <Label htmlFor="duration">Duration</Label>
                                    <select
                                        id="duration"
                                        value={formData.duration}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                duration: e.target.value,
                                            })
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
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
                                <Button onClick={handleCreate}>
                                    Create Package
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
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-sidebar-border">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Features</TableHead>
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
                                        <TableCell>{pkg.description}</TableCell>
                                        <TableCell>
                                            ${pkg.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {pkg.duration}
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-xs">
                                                {pkg.features.join(", ")}
                                            </div>
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
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="border-sidebar-border"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Are you sure?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action
                                                                cannot be
                                                                undone. This
                                                                will permanently
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
                                                            >
                                                                Delete
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
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                >
                    <DialogContent className="sm:max-w-[425px]">
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
                                <Label htmlFor="edit-description">
                                    Description
                                </Label>
                                <Input
                                    id="edit-description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Package description"
                                />
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
                                <Label htmlFor="edit-duration">Duration</Label>
                                <select
                                    id="edit-duration"
                                    value={formData.duration}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            duration: e.target.value,
                                        })
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
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
                            <Button onClick={handleUpdate}>
                                Update Package
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default Packages;
