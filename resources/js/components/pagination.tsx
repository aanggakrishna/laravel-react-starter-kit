import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  className?: string;
}

export default function Pagination({ links, className }: PaginationProps) {
  // Filter out "&laquo; Previous" and "Next &raquo;" labels
  const filteredLinks = links.filter(
    (link) => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;'
  );

  const previousLink = links.find((link) => link.label === '&laquo; Previous');
  const nextLink = links.find((link) => link.label === 'Next &raquo;');

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {/* Previous Button */}
      {previousLink && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={!previousLink.url}
          asChild={previousLink.url ? true : false}
        >
          {previousLink.url ? (
            <Link href={previousLink.url}>
              <span className="sr-only">Previous Page</span>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : (
            <span>
              <span className="sr-only">Previous Page</span>
              <ChevronLeft className="h-4 w-4" />
            </span>
          )}
        </Button>
      )}

      {/* Page Numbers */}
      {filteredLinks.map((link, i) => {
        // Check if this is a "..." separator
        if (link.label === '...') {
          return (
            <Button
              key={`ellipsis-${i}`}
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          );
        }

        return (
          <Button
            key={link.label}
            variant={link.active ? 'default' : 'outline'}
            size="sm"
            className="h-8 w-8 p-0"
            asChild={!link.active && link.url !== null}
          >
            {!link.active && link.url ? (
              <Link href={link.url}>
                <span>{link.label}</span>
              </Link>
            ) : (
              <span>{link.label}</span>
            )}
          </Button>
        );
      })}

      {/* Next Button */}
      {nextLink && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={!nextLink.url}
          asChild={nextLink.url ? true : false}
        >
          {nextLink.url ? (
            <Link href={nextLink.url}>
              <span className="sr-only">Next Page</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span>
              <span className="sr-only">Next Page</span>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      )}
    </div>
  );
}