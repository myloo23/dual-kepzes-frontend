// src/components/company-profile/ErrorAlert.tsx
interface ErrorAlertProps {
    message: string | null;
    onDismiss?: () => void;
}

export default function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
    if (!message) return null;

    return (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center justify-between">
            <span>{message}</span>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="ml-4 text-red-700 hover:text-red-900 font-bold"
                    aria-label="Bezárás"
                >
                    ×
                </button>
            )}
        </div>
    );
}
