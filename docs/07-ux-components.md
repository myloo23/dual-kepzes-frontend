# UX Components Usage Guide

This guide explains how to use the new UX components that have been added to the project.

## 🎨 Components

### Skeleton (Loading States)

Use the `Skeleton` component to show loading placeholders instead of spinners.

```tsx
import Skeleton from '@/components/ui/Skeleton';

// Text skeleton
<Skeleton variant="text" lines={3} />

// Rectangular skeleton (default)
<Skeleton width="100%" height={200} />

// Circular skeleton (for avatars)
<Skeleton variant="circular" width={48} height={48} />

// Custom styling
<Skeleton className="mb-4" width="80%" />
```

**Example: Loading Card**

```tsx
function LoadingCard() {
  return (
    <div className="bg-white p-6 rounded-lg">
      <Skeleton variant="circular" width={48} height={48} className="mb-4" />
      <Skeleton variant="text" lines={2} />
      <Skeleton width="60%" className="mt-2" />
    </div>
  );
}
```

### Toast Notifications

The toast system is already integrated globally. Use the `useToast` hook anywhere in your app.

```tsx
import { useToast } from "@/hooks/useToast";

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.showSuccess("Operation completed successfully!");
  };

  const handleError = () => {
    toast.showError("Something went wrong!", 7000); // Custom duration
  };

  const handleWarning = () => {
    toast.showWarning("Please review your input");
  };

  const handleInfo = () => {
    toast.showInfo("New feature available!");
  };

  return <button onClick={handleSuccess}>Show Toast</button>;
}
```

**Toast Methods:**

- `showSuccess(message, duration?)` - Green success toast
- `showError(message, duration?)` - Red error toast
- `showWarning(message, duration?)` - Yellow warning toast
- `showInfo(message, duration?)` - Blue info toast
- `removeToast(id)` - Manually remove a toast
- `clearAll()` - Clear all toasts

### Back to Top Button

Already integrated globally! The button automatically appears when scrolling down 300px.

No additional setup needed - it works on all pages automatically.

### Breadcrumbs

Add breadcrumbs to any page for better navigation.

```tsx
import Breadcrumbs from '@/components/shared/Breadcrumbs';

// Auto-generate from URL
<Breadcrumbs />

// Custom breadcrumbs
<Breadcrumbs
  items={[
    { label: 'Főoldal', path: '/' },
    { label: 'Admin', path: '/admin' },
    { label: 'Felhasználók' } // Current page (no path)
  ]}
/>
```

## 🎭 Animations

### CSS Animation Classes

Use these classes directly in your JSX:

```tsx
// Fade in
<div className="animate-fade-in">Content</div>

// Slide in from right
<div className="animate-slide-in-from-right">Content</div>

// Slide in from bottom
<div className="animate-slide-in-from-bottom">Content</div>

// Scale in
<div className="animate-scale-in">Content</div>

// Hover lift effect
<div className="hover-lift">Lifts on hover</div>

// Hover scale effect
<div className="hover-scale">Scales on hover</div>
```

### Smooth Scrolling

Already enabled globally! All anchor links and programmatic scrolling will be smooth.

```tsx
// This will scroll smoothly
<a href="#section">Jump to section</a>;

// Programmatic smooth scroll
element.scrollIntoView({ behavior: "smooth" });
```

### Focus Styles

All interactive elements now have consistent, accessible focus styles automatically.

## 📋 Best Practices

### Loading States

- Use skeletons for content that takes time to load
- Match skeleton shapes to actual content
- Show skeletons immediately, don't wait for loading state

### Toasts

- Keep messages short and actionable
- Use appropriate types (success for confirmations, error for failures)
- Don't overuse - only for important feedback
- Default duration (5s) is usually good, use longer for errors

### Animations

- Use sparingly - too many animations can be distracting
- Prefer subtle animations (fade, slide) over dramatic ones
- Ensure animations don't interfere with accessibility
- Keep durations short (200-400ms)

### Breadcrumbs

- Use on pages that are 2+ levels deep
- Keep labels short and clear
- Auto-generation works for most cases

## 🎯 Examples

### Complete Loading Pattern

```tsx
function PositionsList() {
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState([]);
  const toast = useToast();

  useEffect(() => {
    api.positions
      .list()
      .then((data) => {
        setPositions(data);
        setLoading(false);
      })
      .catch((error) => {
        toast.showError("Failed to load positions");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg">
            <Skeleton variant="text" lines={2} />
            <Skeleton width="40%" className="mt-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Breadcrumbs />
      {positions.map((position) => (
        <PositionCard key={position.id} position={position} />
      ))}
    </div>
  );
}
```

### Form with Toast Feedback

```tsx
function CreatePositionForm() {
  const toast = useToast();

  const handleSubmit = async (data) => {
    try {
      await api.positions.create(data);
      toast.showSuccess("Position created successfully!");
      navigate("/admin/positions");
    } catch (error) {
      toast.showError("Failed to create position. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-slide-in-from-bottom">
      {/* form fields */}
    </form>
  );
}
```
