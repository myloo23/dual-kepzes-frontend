import * as XLSX from 'xlsx';

/**
 * Export utilities for CSV, Excel and PDF generation
 */

/**
 * Convert data to CSV format
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
) {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Determine columns
  const cols = columns || Object.keys(data[0]).map(key => ({ key, label: key }));

  // Create CSV header
  const header = cols.map(col => col.label).join(',');

  // Create CSV rows
  const rows = data.map(row =>
    cols.map(col => {
      const value = row[col.key];
      // Handle values that might contain commas or quotes
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  );

  // Combine header and rows
  const csv = [header, ...rows].join('\n');

  // Create and download file
  // Add partial BOM for Excel UTF-8 compatibility
  downloadFile('\uFEFF' + csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Export data to Excel (.xlsx)
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
) {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Transform data to match columns
  const excelData = data.map(item => {
    const row: Record<string, any> = {};
    if (columns) {
      columns.forEach(col => {
        row[col.label] = item[col.key];
      });
    } else {
      return item;
    }
    return row;
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Auto-width for columns (simple estimation)
  const colWidths = Object.keys(excelData[0] || {}).map(key => ({
    wch: Math.max(key.length, ...excelData.map(row => String(row[key] || '').length)) + 2
  }));
  worksheet['!cols'] = colWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Export');

  // Write and download
  XLSX.writeFile(workbook, filename);
}

/**
 * Export table to PDF using browser print
 */
export function exportToPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Could not open print window');
    return;
  }

  // Clone the element
  const clone = element.cloneNode(true) as HTMLElement;

  // Create print-friendly HTML
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            @page { margin: 1cm; }
          }
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f3f4f6; font-weight: bold; }
          h1 { color: #1e293b; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>${filename}</h1>
        ${clone.outerHTML}
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.print();
    // Close window after printing (or if cancelled)
    setTimeout(() => printWindow.close(), 100);
  };
}

/**
 * Download a file with given content
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format date for filename
 */
export function getExportFilename(prefix: string, extension: 'csv' | 'pdf' | 'xlsx'): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  return `${prefix}_${dateStr}.${extension}`;
}
