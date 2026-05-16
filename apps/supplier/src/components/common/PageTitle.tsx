import React from 'react';

interface PageTitleProps {
  title: string;
  description?: string;
}

export default function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}
