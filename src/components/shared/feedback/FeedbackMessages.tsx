/**
 * Feedback Messages Component
 * Combined component for displaying loading, error, and success states
 */

import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';

interface FeedbackMessagesProps {
    loading?: boolean;
    loadingMessage?: string;
    error?: string | null;
    success?: string | null;
    onDismissError?: () => void;
    onDismissSuccess?: () => void;
}

export default function FeedbackMessages({
    loading,
    loadingMessage,
    error,
    success,
    onDismissError,
    onDismissSuccess,
}: FeedbackMessagesProps) {
    return (
        <div className="space-y-3">
            {loading && <LoadingSpinner message={loadingMessage} />}
            {error && <ErrorMessage message={error} onDismiss={onDismissError} />}
            {success && <SuccessMessage message={success} onDismiss={onDismissSuccess} />}
        </div>
    );
}
