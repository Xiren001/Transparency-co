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
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { router } from '@inertiajs/react';

interface LogoutConfirmationModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LogoutConfirmationModal({ isOpen, onOpenChange }: LogoutConfirmationModalProps) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
        router.post(route('logout'));
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent className="overflow-hidden rounded-[12px] border-0 bg-[#ecf0f3] shadow-[10px_10px_10px_#d1d9e6,-10px_-10px_10px_#f9f9f9] dark:bg-[#181a1b] dark:shadow-[10px_10px_20px_#0e0f10,-10px_-10px_20px_#222526]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900 dark:text-gray-100">Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                        Are you sure you want to log out? You will need to sign in again to access your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        className="bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                        onClick={handleLogout}
                    >
                        Log Out
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
