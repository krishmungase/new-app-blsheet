const ProseStyleComponent = ({ content }: { content: string }) => {
  return (
    <div
      className="!min-w-full prose-h1:text-lg prose-h1:p-0 prose-h1:m-0 prose prose-sm md:prose-base px-6 md:px-8 py-1 md:py-2 
               prose-headings:text-foreground
               prose-p:text-foreground
               prose-li:text-foreground
               prose-strong:text-primary
               prose-code:rounded-lg prose-code:px-2
               prose-a:text-primary hover:prose-a:text-accent-foreground
               prose-ol:text-muted-foreground prose-ul:text-muted-foreground
               prose-li:marker:text-foreground prose-li:text-sm prose-ol:ml-5 prose-ul:ml-5
               prose-blockquote:text-muted-foreground
               prose-code:text-secondary-foreground
               prose-pre:bg-card prose-pre:text-foreground
               prose-hr:border-border
               dark:prose-invert
               prose-h2:text-base prose-h2:p-0 prose-h2:m-0
               prose-h3:text-sm prose-h3:p-0 prose-h3:m-0
               prose-h4:text-sm prose-h4:p-0 prose-h4:m-0
               prose-h5:text-xs prose-h5:p-0 prose-h5:m-0
               prose-h6:text-xs prose-h6:p-0 prose-h6:m-0
               prose-p:text-sm prose-p:p-0 prose-p:m-0
               "
    >
      <div
        className="text-foreground"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default ProseStyleComponent;
