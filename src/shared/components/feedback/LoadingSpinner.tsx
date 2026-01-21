/**
 * Loading Spinner Component
 * Displays a loading indicator
 */

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
}

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-slate-200 border-t-blue-600`}
                role="status"
                aria-label="Loading"
            />
            {message && (
                <p className="text-sm text-slate-600">{message}</p>
            )}
        </div>
    );
}
