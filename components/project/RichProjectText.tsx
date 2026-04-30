import React from 'react';

interface RichProjectTextProps {
  text: string;
  className?: string;
  paragraphClassName?: string;
  strongClassName?: string;
}

function renderInline(text: string, strongClassName?: string): React.ReactNode[] {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className={strongClassName}>
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export function RichProjectText({
  text,
  className,
  paragraphClassName = 'text-base leading-8 text-foreground',
  strongClassName = 'font-semibold text-primary',
}: RichProjectTextProps) {
  const paragraphs = text.split('\n\n').filter(Boolean);

  return (
    <div className={className}>
      {paragraphs.map((paragraph, idx) => (
        <p key={idx} className={paragraphClassName}>
          {renderInline(paragraph, strongClassName)}
        </p>
      ))}
    </div>
  );
}
