# MyDucSchool Project TODO

## Custom Login Landing Page & Logo Update

- [x] Add official My Duc School shield logo to assets
- [x] Create custom login landing page with logo
- [x] Add fade-in animations for logo and content
- [x] Update logo in website header/navigation
- [x] Update logo in all pages
- [x] Test animations and responsiveness

## Logo Optimization

- [x] Remove white background from logo image
- [x] Increase logo size on login page

## Header Logo Update

- [x] Update main website header with new transparent logo
- [x] Adjust logo sizing and styling in header

## Branding Updates

- [x] Change header tagline to "The School of Science"
- [x] Update hero section heading color to navy blue
- [x] Update header text color to navy blue

## Dev Server Stability Improvements

- [x] Optimize vite.config.ts with HMR settings
- [x] Add dependency pre-bundling for faster builds
- [x] Configure proper WebSocket HMR for preview iframe
- [x] Optimize file watching to reduce memory usage
- [x] Add code splitting for vendor and tRPC bundles

## Teacher Dashboard Feature

- [x] Design teacher dashboard database schema
- [x] Create tRPC procedures for teacher operations
- [x] Build teacher dashboard layout and navigation
- [x] Implement student record management UI
- [x] Add message response functionality
- [x] Create class progress tracking view
- [x] Write tests for teacher dashboard

## Bulk Message Feature for Teachers

- [x] Add database helper to get parents of students in a class
- [x] Create tRPC procedure for bulk messaging to class parents
- [x] Update teacher dashboard with bulk message compose form
- [x] Add validation for message content and recipient selection
- [x] Write tests for bulk messaging functionality
- [x] Test integration with existing messaging system

## Message Templates Feature

- [x] Add message_templates table to database schema
- [x] Create database helpers for template CRUD operations
- [x] Create tRPC procedures for template management
- [x] Update teacher dashboard with template selector
- [x] Add template manager UI for creating/editing templates
- [x] Write tests for template functionality
- [x] Test integration with bulk messaging
