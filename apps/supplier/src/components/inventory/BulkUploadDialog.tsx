import React, { useState, useRef } from 'react';
import { FileUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from '@sb/ui';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BulkUploadDialog({ open, onOpenChange }: BulkUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        const lines = text.split('\n').slice(0, 4);
        setPreview(lines.map(l => l.split(',')));
      };
      reader.readAsText(f);
    }
  };

  const handleUpload = () => {
    // In a real app we'd upload the formData
    setTimeout(() => {
      onOpenChange(false);
      setFile(null);
      setPreview([]);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk upload slabs</DialogTitle>
          <DialogDescription>
            Upload a CSV file with your slab data. <a href="#" className="text-primary hover:underline">Download the template</a> to see the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <input type="file" accept=".csv" className="hidden" ref={inputRef} onChange={handleFileChange} />
          
          <div 
            className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <FileUp className="w-8 h-8 mb-2 opacity-50" />
            <div className="text-sm font-medium">Drop CSV file here or click to browse</div>
            <div className="text-xs mt-1">{file ? file.name : "No file selected"}</div>
          </div>

          {preview.length > 0 && (
            <div className="mt-4 border border-border rounded overflow-hidden">
              <div className="bg-muted px-3 py-2 text-xs font-semibold border-b border-border">Preview (first 3 rows)</div>
              <div className="p-3 text-xs font-mono overflow-x-auto whitespace-nowrap">
                {preview.map((row, i) => (
                  <div key={i} className="flex space-x-4 mb-1">
                    {row.map((cell, j) => <div key={j} className="w-20 truncate">{cell}</div>)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleUpload} disabled={!file}>
            {file ? `Upload slabs` : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
