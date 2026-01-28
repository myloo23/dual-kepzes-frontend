# Phase 3 Advanced Features - Usage Guide

## 🔍 Global Search

### Overview

A powerful global search feature accessible via keyboard shortcut that searches across positions, companies, and news.

### Usage

**Opening the Search:**

- Press `Ctrl+K` (Windows/Linux) or `Cmd+K` (Mac)
- Search modal opens instantly

**Features:**

- **Debounced search** - Waits 300ms after typing before searching
- **Keyboard navigation** - Use arrow keys to navigate results
- **Recent searches** - Last 5 searches saved in localStorage
- **Press Enter** - Navigate to selected result
- **Press ESC** - Close search modal

### Implementation

The search is globally available in [`App.tsx`](file:///c:/Users/milan/Documents/GitHub/dual-kepzes-frontend/src/App.tsx#L120).

**Components:**

- [`GlobalSearch.tsx`](file:///c:/Users/milan/Documents/GitHub/dual-kepzes-frontend/src/components/shared/GlobalSearch.tsx) - Main search modal
- [`useGlobalSearch.ts`](file:///c:/Users/milan/Documents/GitHub/dual-kepzes-frontend/src/hooks/useGlobalSearch.ts) - Keyboard shortcut hook

### Customization

To connect to real API, update the search effect in `GlobalSearch.tsx`:

```tsx
// Replace mock results with API call
const results = await api.search.global(query);
```

---

## 📊 Export Functionality

### Overview

Export data tables to CSV or PDF format with a single click.

### CSV Export

**Usage:**

```tsx
import { exportToCSV, getExportFilename } from "@/utils/export";
import ExportButton from "@/components/shared/ExportButton";

function MyComponent() {
  const data = [
    { name: "John", email: "john@example.com", role: "Student" },
    { name: "Jane", email: "jane@example.com", role: "Teacher" },
  ];

  const handleExport = () => {
    exportToCSV(data, getExportFilename("users", "csv"), [
      { key: "name", label: "Név" },
      { key: "email", label: "Email" },
      { key: "role", label: "Szerepkör" },
    ]);
  };

  return <ExportButton onExport={handleExport} icon="csv" />;
}
```

**Features:**

- Handles commas, quotes, and newlines in data
- Custom column labels
- Auto-generates filename with date
- Excel-compatible formatting

### PDF Export

**Usage:**

```tsx
import { exportToPDF } from "@/utils/export";
import ExportButton from "@/components/shared/ExportButton";

function MyTable() {
  const handleExport = () => {
    exportToPDF("my-table-id", "Users Report");
  };

  return (
    <>
      <table id="my-table-id">{/* table content */}</table>
      <ExportButton onExport={handleExport} icon="pdf" />
    </>
  );
}
```

**Features:**

- Uses browser print API (no external dependencies)
- Print-friendly styling
- Automatic page breaks
- Custom title

### ExportButton Component

**Props:**

- `onExport` - Function to call when clicked
- `label` - Custom button text (optional)
- `icon` - 'csv' or 'pdf' (default: 'csv')
- `variant` - 'primary' or 'secondary' (default: 'secondary')
- `disabled` - Disable button (default: false)
- `className` - Additional CSS classes

**Examples:**

```tsx
// CSV export button
<ExportButton onExport={handleCSV} icon="csv" label="Letöltés CSV" />

// PDF export button
<ExportButton onExport={handlePDF} icon="pdf" variant="primary" />

// Disabled state
<ExportButton onExport={handleExport} disabled={data.length === 0} />
```

---

## 🎯 Integration Examples

### Admin Users Page

```tsx
import { exportToCSV, getExportFilename } from "@/utils/export";
import ExportButton from "@/components/shared/ExportButton";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const handleExportCSV = () => {
    exportToCSV(users, getExportFilename("users", "csv"), [
      { key: "name", label: "Név" },
      { key: "email", label: "Email" },
      { key: "role", label: "Szerepkör" },
      { key: "createdAt", label: "Létrehozva" },
    ]);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <ExportButton onExport={handleExportCSV} />
      </div>
      <table id="users-table">{/* table content */}</table>
    </div>
  );
}
```

### Positions List with Filters

```tsx
function PositionsList() {
  const [positions, setPositions] = useState([]);
  const [filters, setFilters] = useState({});

  const handleExport = () => {
    // Export only filtered data
    const filteredData = applyFilters(positions, filters);
    exportToCSV(filteredData, getExportFilename("positions", "csv"), [
      { key: "title", label: "Pozíció" },
      { key: "company", label: "Cég" },
      { key: "location", label: "Helyszín" },
      { key: "type", label: "Típus" },
    ]);
  };

  return (
    <>
      <FilterSidebar filters={filters} onChange={setFilters} />
      <ExportButton onExport={handleExport} label="Szűrt lista exportálása" />
      <PositionsList data={filteredData} />
    </>
  );
}
```

---

## 📝 Best Practices

### Global Search

- Keep search results relevant and limited (max 10-20 per type)
- Show most recent/relevant results first
- Include context (subtitle) to help users identify results
- Clear search on navigation

### Export

- Always include date in filename
- Use descriptive column labels in Hungarian
- Handle empty data gracefully
- Show loading state for large exports
- Provide feedback after export (toast notification)

### Performance

- Debounce search input (already implemented)
- Limit export to reasonable data sizes
- Consider pagination for very large datasets
- Cache search results when appropriate

---

## 🚀 Future Enhancements

### Global Search

- [ ] Search history with delete option
- [ ] Search filters (type, date range)
- [ ] Fuzzy search for typos
- [ ] Search analytics
- [ ] Voice search

### Export

- [ ] Excel export with formatting
- [ ] Custom PDF templates
- [ ] Batch export
- [ ] Scheduled exports
- [ ] Email export option

---

## Components Created

- ✅ [`GlobalSearch.tsx`](file:///c:/Users/milan/Documents/GitHub/dual-kepzes-frontend/src/components/shared/GlobalSearch.tsx)
- ✅ [`useGlobalSearch.ts`](file:///c:/Users/milan/Documents/GitHub/dual-kepzes-frontend/src/hooks/useGlobalSearch.ts)
- ✅ [`export.ts`](file:///c:/Users/milan/Documents/GitHub/dual-kepzes-frontend/src/utils/export.ts)
- ✅ [`ExportButton.tsx`](file:///c:/Users/milan/Documents/GitHub/dual-kepzes-frontend/src/components/shared/ExportButton.tsx)
