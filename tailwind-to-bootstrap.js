import fs from 'fs';
import path from 'path';

// Mapping from Tailwind classes to Bootstrap 5.3 classes
const classMap = {
  // Flexbox
  'flex': 'd-flex',
  'flex-col': 'flex-column',
  'flex-row': 'flex-row',
  'flex-wrap': 'flex-wrap',
  'items-center': 'align-items-center',
  'items-start': 'align-items-start',
  'items-end': 'align-items-end',
  'items-baseline': 'align-items-baseline',
  'items-stretch': 'align-items-stretch',
  'justify-center': 'justify-content-center',
  'justify-between': 'justify-content-between',
  'justify-around': 'justify-content-around',
  'justify-start': 'justify-content-start',
  'justify-end': 'justify-content-end',
  'gap-1': 'gap-1',
  'gap-2': 'gap-2',
  'gap-3': 'gap-3',
  'gap-4': 'gap-4',
  'gap-5': 'gap-5',
  'gap-6': 'gap-5', // Bootstrap stops at 5 typically
  'gap-8': 'gap-5',

  // Grid
  'grid': 'd-grid',
  'grid-cols-1': 'row-cols-1',
  'grid-cols-2': 'row-cols-2',
  'grid-cols-3': 'row-cols-3',
  'grid-cols-4': 'row-cols-4',
  'md:grid-cols-2': 'row-cols-md-2',
  'md:grid-cols-3': 'row-cols-md-3',
  'lg:grid-cols-3': 'row-cols-lg-3',
  'lg:grid-cols-4': 'row-cols-lg-4',

  // Spacing (many map identically or closely)
  // We will map mx-auto, mt-4 etc directly or let them be since they match Bootstrap
  'px-4': 'px-3',
  'px-6': 'px-4',
  'px-8': 'px-5',
  'py-2': 'py-2',
  'py-4': 'py-3',
  'py-6': 'py-4',
  'py-8': 'py-5',
  'py-12': 'py-5',
  'p-2': 'p-2',
  'p-4': 'p-3',
  'p-6': 'p-4',
  'p-8': 'p-5',

  // Sizing
  'w-full': 'w-100',
  'h-full': 'h-100',
  'max-w-md': 'max-w-md', // Keep as custom or replace
  'max-w-lg': 'max-w-lg',
  'max-w-xl': 'max-w-xl',
  'max-w-2xl': 'max-w-2xl',
  'max-w-4xl': 'max-w-4xl',
  'max-w-7xl': 'max-w-7xl',
  'min-h-screen': 'min-vh-100',
  
  // Typography
  'text-center': 'text-center',
  'text-left': 'text-start',
  'text-right': 'text-end',
  'font-bold': 'fw-bold',
  'font-semibold': 'fw-semibold',
  'font-medium': 'fw-medium',
  'font-light': 'fw-light',
  'text-sm': 'fs-6 text-muted', // Approx
  'text-xs': 'small',
  'text-base': 'fs-6',
  'text-lg': 'fs-5',
  'text-xl': 'fs-4',
  'text-2xl': 'fs-3',
  'text-3xl': 'fs-2',
  'text-4xl': 'fs-1',
  'text-5xl': 'display-6',
  'text-6xl': 'display-4',

  // Colors
  'text-primary': 'text-primary',
  'text-secondary': 'text-secondary',
  'text-white': 'text-white',
  'text-black': 'text-dark',
  'text-muted-foreground': 'text-muted',
  'text-primary-foreground': 'text-white',
  'bg-white': 'bg-white',
  'bg-primary': 'bg-primary',
  'bg-secondary': 'bg-secondary',
  'bg-background': 'bg-light',
  'bg-card': 'bg-white',
  'bg-muted': 'bg-light',

  // Borders & Rounded
  'rounded': 'rounded',
  'rounded-md': 'rounded-2',
  'rounded-lg': 'rounded-3',
  'rounded-xl': 'rounded-4',
  'rounded-2xl': 'rounded-4',
  'rounded-full': 'rounded-circle',
  'border': 'border',
  'border-border': '', // Remove border color
  'shadow-sm': 'shadow-sm',
  'shadow': 'shadow',
  'shadow-md': 'shadow',
  'shadow-lg': 'shadow-lg',

  // Hidden / Block
  'hidden': 'd-none',
  'block': 'd-block',
  'inline-block': 'd-inline-block',
  'md:hidden': 'd-md-none',
  'md:block': 'd-md-block',
  'md:flex': 'd-md-flex',
  'lg:hidden': 'd-lg-none',
  'lg:block': 'd-lg-block',
  'lg:flex': 'd-lg-flex',
  
  // Custom Shadcn Classes
  'container': 'container',
  'mx-auto': 'mx-auto',
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We will match className="..." and className={...} (basic replacement)
      // Since it's hard to parse AST easily in a bash environment, we'll do string replacements.
      // A more robust way is to just global replace the exact words if they are surrounded by quotes or spaces.
      
      let modified = false;
      const newContent = content.replace(/(?:className|classNames)\s*=\s*(["'`])(.*?)\1/g, (match, quote, classString) => {
        let classes = classString.split(/\s+/);
        let newClasses = classes.map(c => {
          if (classMap[c]) {
            modified = true;
            return classMap[c];
          }
          // specific prefix handling
          if (c.startsWith('hover:bg-')) return c; // keep or map? 
          if (c.startsWith('w-') && c !== 'w-full') {
            const num = c.split('-')[1];
            if (!isNaN(num)) return `w-${num}`; // just leave it, maybe handled via custom css
          }
          return c; // Keep unrecognized
        });
        
        // Remove empty classes
        newClasses = newClasses.filter(c => c !== '');
        // Deduplicate
        newClasses = [...new Set(newClasses)];
        
        return `className=${quote}${newClasses.join(' ')}${quote}`;
      });

      if (modified || content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

const targetDir = path.join(process.cwd(), 'src');
console.log(`Processing directory: ${targetDir}`);
processDirectory(targetDir);
console.log('Done!');
