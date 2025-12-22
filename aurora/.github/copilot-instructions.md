# Aurora - Job Requisition Management System

## Architecture Overview

Aurora is a React + TypeScript + Vite SPA for managing job requisitions and CV uploads. Key characteristics:

- **Page-based routing** via React Router (`/`, `/jobs`, `/jobs/new`, `/jobs/:id`, `/jobs/:id/upload`)
- **Mock API pattern**: Each page has a co-located `APIHandler.ts` with simulated async operations (1-2s delay)
- **No backend**: All data is mocked in-memory within APIHandler files
- **Dual UI frameworks**: MUI components + Tailwind CSS utilities coexist intentionally

## Project Structure

```
src/
  pages/              # Feature-based pages, each with APIHandler.ts
    MainPage/         # Dashboard with stats
    JobListPage/      # Job listings table
    CreateJobPage/    # Job creation form
    JobDetailPage/    # Job details view
    UploadCVPage/     # CV upload interface
  components/ui/      # Reusable UI components (FloatingDock)
  types/index.ts      # Centralized TypeScript types
  lib/utils.ts        # Utility functions (cn for className merging)
```

## Key Patterns

### 1. Page Structure Convention
Every page follows this pattern:
- `PageName/PageName.tsx` - Component file
- `PageName/APIHandler.ts` - Mock API functions with `ApiResponse<T>` type
- `PageName/index.ts` - Re-exports page component

### 2. API Handler Pattern
All API handlers return `ApiResponse<T>` type and simulate network delay:
```typescript
export async function createJob(req): Promise<ApiResponse<JobRequisition>> {
  await simulateDelay()  // 1-2s delay
  return { data, success: true, message }
}
```

### 3. Styling Approach
- **MUI components** for structure (Container, Paper, Button, TextField, etc.)
- **Tailwind utilities** for layout/spacing (className with `cn()` helper)
- **Theme config** in [App.tsx](src/App.tsx) - 16px border radius, custom palette
- **Custom colors** via `sx` prop for one-off styles (e.g., `sx={{ backgroundColor: '#DBFCE7' }}`)

### 4. Form Handling
Forms use local state with `FormData` interface. Skills are managed as arrays with add/remove handlers:
```typescript
const [formData, setFormData] = useState<FormData>({...})
const handleChange = (field: keyof FormData) => (e) => {...}
```

### 5. Type Definitions
Central types in [src/types/index.ts](src/types/index.ts):
- `JobRequisition` - Core job data model with `status: 'active' | 'paused' | 'closed'`
- `CV` - Candidate CV with `ParsedCVData` for AI-extracted info
- `ApiResponse<T>` - Standard API response wrapper
- Union types for dropdowns: `LocationType`, `EmploymentType`

## Development Workflow

**Run dev server**: `npm run dev` (Vite HMR on http://localhost:5173)
**Build**: `npm run build` (TypeScript check + Vite build)
**Lint**: `npm run lint` (ESLint with flat config)

## Navigation

FloatingDock component ([src/components/ui/FloatingDock.tsx](src/components/ui/FloatingDock.tsx)) provides macOS-style bottom navigation with:
- Desktop: Hover-animated dock with tooltips
- Mobile: Expandable menu from button
- Uses `motion/react` (Framer Motion) for animations

## Important Conventions

1. **No backend calls**: APIHandler functions are always mocked - extend mock data arrays, don't add fetch calls
2. **Path aliases**: Use `@/` prefix for imports (configured in [vite.config.ts](vite.config.ts))
3. **Icon libraries**: Lucide React for custom icons, MUI icons available but not primary
4. **Status values**: Jobs use `active/paused/closed`, CVs use `pending/reviewed/shortlisted/rejected`
5. **Grid system**: MUI v7 Grid component uses `size` prop instead of `xs/sm/md` props

## When Adding Features

- Create new page in `src/pages/FeatureName/` with component + APIHandler + index
- Add route in [App.tsx](src/App.tsx) Routes section
- Add navigation item to `navigationItems` array if needed
- Define new types in [src/types/index.ts](src/types/index.ts)
- Follow existing form patterns for consistency
