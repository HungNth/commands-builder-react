---
description: 'ReactJS development standards and best practices'
applyTo: '**/*.jsx, **/*.tsx, **/*.js, **/*.ts, **/*.css, **/*.scss'
---

# ReactJS Development Instructions

Instructions for building high-quality ReactJS applications with modern patterns, hooks, and best practices following the official React documentation at https://react.dev.

## Project Context
- Latest React version (React 19+)
- TypeScript for type safety (when applicable)
- Functional components with hooks as default
- Follow React's official style guide and best practices
- Use modern build tools (Vite, Create React App, or custom Webpack setup)
- Implement proper component composition and reusability patterns

## Development Standards

### Architecture
- Use functional components with hooks as the primary pattern
- Implement component composition over inheritance
- Organize components by feature or domain in `resources/js/pages/` for Inertia pages
- Separate presentational components in `resources/js/components/`
- Use custom hooks for reusable stateful logic in `resources/js/hooks/`
- Implement proper component hierarchies with clear data flow
- **Inertia.js Integration**: Use Inertia pages as top-level components, receive props from Laravel controllers
- Use Inertia layouts for shared page structure
- Leverage server-side routing instead of client-side route configuration

### TypeScript Integration
- Use TypeScript interfaces for props, state, and component definitions
- Define proper types for event handlers and refs
- Implement generic components where appropriate
- Use strict mode in `tsconfig.json` for type safety
- Leverage React's built-in types (`React.FC`, `React.ComponentProps`, etc.)
- Create union types for component variants and states

### Component Design
- Follow the single responsibility principle for components
- Use descriptive and consistent naming conventions
- Implement proper prop validation with TypeScript or PropTypes
- Design components to be testable and reusable
- Keep components small and focused on a single concern
- Use composition patterns (render props, children as functions)

### State Management
- Use `useState` for local component state
- Implement `useReducer` for complex state logic
- Leverage `useContext` for sharing state across component trees when needed
- **Inertia.js State**: Props from Laravel controllers are the primary data source
- Use `usePage()` hook to access shared data from Laravel
- Use `useForm()` hook from Inertia for form state management
- Avoid external state management (Redux, Zustand) - Inertia handles server state
- Use `useRemember()` hook for preserving local state during navigation
- Implement proper state normalization and data structures

### Hooks and Effects
- Use `useEffect` with proper dependency arrays to avoid infinite loops
- Implement cleanup functions in effects to prevent memory leaks
- Use `useMemo` and `useCallback` for performance optimization when needed
- Create custom hooks for reusable stateful logic
- Follow the rules of hooks (only call at the top level)
- Use `useRef` for accessing DOM elements and storing mutable values

### Styling
- Use CSS Modules, Styled Components, or modern CSS-in-JS solutions
- Implement responsive design with mobile-first approach
- Follow BEM methodology or similar naming conventions for CSS classes
- Use CSS custom properties (variables) for theming
- Implement consistent spacing, typography, and color systems
- Ensure accessibility with proper ARIA attributes and semantic HTML

### Performance Optimization
- Use `React.memo` for component memoization when appropriate
- Implement code splitting with `React.lazy` and `Suspense`
- Optimize bundle size with tree shaking and dynamic imports
- Use `useMemo` and `useCallback` judiciously to prevent unnecessary re-renders
- Implement virtual scrolling for large lists
- Profile components with React DevTools to identify performance bottlenecks

### Data Fetching with Inertia.js
- **No manual data fetching**: Data comes as props from Laravel controllers
- Use `router.reload()` to refresh current page data
- Implement partial reloads with `only` option: `router.reload({ only: ['posts'] })`
- Use lazy data evaluation in Laravel for deferred loading
- Handle loading states with Inertia's progress indicators
- Use `router.visit()` for navigation with custom options
- Implement optimistic UI updates with `preserveState` option
- Handle errors through Laravel's validation and Inertia's error prop

### Error Handling
- Implement Error Boundaries for component-level error handling
- Use proper error states in data fetching
- Implement fallback UI for error scenarios
- Log errors appropriately for debugging
- Handle async errors in effects and event handlers
- Provide meaningful error messages to users

### Forms and Validation with Inertia.js
- **Use Inertia's `useForm()` hook**: Provides form state, errors, and submission helpers
- Implement controlled components with Inertia form data
- Handle validation errors from Laravel automatically via Inertia
- Display errors using `form.errors.fieldName`
- Submit forms with `form.post()`, `form.put()`, `form.delete()` methods
- Track form processing state with `form.processing`
- Implement accessibility features for forms (labels, ARIA attributes)
- Handle file uploads with `form.post(url, { forceFormData: true })`
- Use `transform()` to modify data before submission
- Reset forms after successful submission with `form.reset()`

### Routing with Inertia.js
- **Server-side routing**: Routes defined in Laravel's `routes/web.php`
- Use Inertia's `<Link>` component for navigation: `<Link href="/posts">`
- Use `router.visit()` for programmatic navigation
- Handle route parameters through Laravel route model binding
- Use Laravel Ziggy for named routes in React: `route('posts.show', post.id)`
- Implement route protection via Laravel middleware
- Preserve scroll position with `preserveScroll` option
- Handle back button automatically - Inertia manages history stack
- Implement breadcrumbs using shared data from Laravel

### Testing
- Write unit tests for components using React Testing Library
- Test component behavior, not implementation details
- Use Jest for test runner and assertion library
- Implement integration tests for complex component interactions
- Mock external dependencies and API calls appropriately
- Test accessibility features and keyboard navigation

### Security
- Sanitize user inputs to prevent XSS attacks
- Validate and escape data before rendering
- Use HTTPS for all external API calls
- Implement proper authentication and authorization patterns
- Avoid storing sensitive data in localStorage or sessionStorage
- Use Content Security Policy (CSP) headers

### Accessibility
- Use semantic HTML elements appropriately
- Implement proper ARIA attributes and roles
- Ensure keyboard navigation works for all interactive elements
- Provide alt text for images and descriptive text for icons
- Implement proper color contrast ratios
- Test with screen readers and accessibility tools

## Implementation Process
1. Plan component architecture and data flow between Laravel and React
2. Set up project structure: `Pages/`, `Components/`, `Layouts/`, `Hooks/`
3. Define TypeScript interfaces for page props from Laravel controllers
4. Implement Inertia page components in `Pages/` directory
5. Create reusable UI components in `Components/` directory
6. Implement layouts using Inertia's layout system
7. Add form handling with Inertia's `useForm()` hook
8. Configure shared data in Laravel's `HandleInertiaRequests` middleware
9. Implement error handling using Inertia's error prop
10. Add loading indicators using Inertia's progress library
11. Add testing coverage for components and Inertia interactions
12. Optimize performance with proper prop selection in Laravel
13. Ensure accessibility compliance
14. Add documentation and code comments

## Additional Guidelines
- Follow React's naming conventions (PascalCase for components, camelCase for functions)
- **Inertia Page Naming**: Match Laravel controller return values (e.g., `posts/index.tsx` for `Inertia::render('posts/index')`)
- Use meaningful commit messages and maintain clean git history
- **Code Splitting**: Automatic with Vite - no manual code splitting needed for routes
- Document complex components and custom hooks with JSDoc
- Use ESLint and Prettier for consistent code formatting
- Keep dependencies up to date and audit for security vulnerabilities
- **TypeScript Types**: Define interfaces for page props received from Laravel
- Use React Developer Tools and Laravel Telescope for debugging
- **CSRF Protection**: Automatically handled by Inertia.js
- Store components in logical directories: `pages/`, `components/`, `layouts/`, `hooks/`

## Common Patterns
- **Inertia Page Components**: Top-level components in `pages/` directory receiving props from Laravel
- **Inertia Layouts**: Persistent layouts using Inertia's layout system
- **Shared Data Access**: Use `usePage()` hook to access global shared data
- Higher-Order Components (HOCs) for cross-cutting concerns when needed
- Compound components for related functionality
- Provider pattern for context-based state sharing (sparingly)
- Container/Presentational component separation
- Custom hooks for reusable logic extraction
- **Form Handling Pattern**: Use `useForm()` hook for all form operations
- **Navigation Pattern**: Use `<Link>` for links, `router` for programmatic navigation
