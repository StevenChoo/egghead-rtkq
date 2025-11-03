# RTK Query Demo Application

A comprehensive TypeScript React application demonstrating three different approaches to state management and data fetching, built for educational purposes and presentations.

Showcase is originally based on: https://github.com/xjamundx/egghead-rtkq

## 🎯 Purpose

This repository showcases different Redux patterns through three specialized branches, each demonstrating a specific approach to state management:

1. **Simple RTK Query** - Basic RTK Query implementation
2. **Redux Toolkit (No RTK Query)** - Traditional Redux with normalized state
3. **Complex RTK Query** - Advanced RTK Query with optimistic updates and performance optimizations

## 🌳 Branches Overview

### `simple-rtkq` - Simple RTK Query Implementation

**Best for**: Getting started with RTK Query, basic data fetching needs

**Features:**
- Auto-generated hooks for queries and mutations
- Automatic cache invalidation with tags
- `transformResponse` for data enrichment
- Minimal boilerplate code

**Read more**: See [README_SIMPLE_RTKQ.md](./README_SIMPLE_RTKQ.md) (available on branch)

```bash
git checkout simple-rtkq
npm install
npm run dev
```

### `redux-toolkit-no-rtkq` - Traditional Redux Toolkit

**Best for**: Learning Redux fundamentals, need for fine-grained state control

**Features:**
- `createEntityAdapter` for normalized state
- `createAsyncThunk` for API calls
- `createSelector` for memoized selectors
- Manual cache management
- Full control over state shape

**Read more**: See [README_REDUX_TOOLKIT.md](./README_REDUX_TOOLKIT.md) (available on branch)

```bash
git checkout redux-toolkit-no-rtkq
npm install
npm run dev
```

### `complex-rtkq` - Advanced RTK Query

**Best for**: Production applications, performance-critical scenarios

**Features:**
- Optimistic updates with `onQueryStarted`
- Granular cache tags (LIST + individual IDs)
- Automatic rollback on failure
- Prefetching for instant data
- `setupListeners` for refetch on focus/reconnect
- Surgical cache invalidation

**Read more**: See [README_COMPLEX_RTKQ.md](./README_COMPLEX_RTKQ.md) (available on branch)

```bash
git checkout complex-rtkq
npm install
npm run dev
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd egghead-rtkq

# Install dependencies
npm install

# Start development server
npm run dev
```

### Testing

```bash
# Run end-to-end tests with TestCafe
npm test
```

## 🏗️ Application Features

This is a **Dog Grooming Services** application where users can:

1. **Manage Dogs** - Add and remove dogs with breed, weight, and date of birth
2. **Select Lucky Dog** - Choose which dog will be groomed
3. **View Services** - Browse grooming services filtered by selected dog's characteristics
4. **Contact Form** - Submit contact requests

### Data Flow

- Dogs are stored with calculated properties (age from DOB, size from weight)
- Services have restrictions (minimum age, allowed breeds, allowed sizes)
- Service list automatically filters based on the selected "lucky dog"

## 📊 Branch Comparison

| Feature | Simple RTK Query | Redux Toolkit | Complex RTK Query |
|---------|-----------------|---------------|-------------------|
| **Boilerplate** | Minimal | Moderate | Minimal |
| **Cache Management** | Automatic | Manual | Automatic + Optimized |
| **Performance** | Good | Good | Excellent |
| **Learning Curve** | Easy | Moderate | Moderate |
| **State Control** | Limited | Full | Limited |
| **Optimistic Updates** | No | Manual | Yes (automatic rollback) |
| **Normalized State** | No | Yes | No |
| **Memoized Selectors** | No | Yes | No |
| **Best For** | Quick prototypes | Complex state logic | Production apps |

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **Redux Toolkit** with RTK Query
- **Vite** for build tooling
- **Mock Service Worker (MSW)** for API mocking
- **TestCafe** for end-to-end testing
- **React Router** for navigation

## 📚 Learning Resources

Each branch includes a detailed README explaining:
- When to use that approach
- Code organization patterns
- Key concepts and best practices
- Comparisons with other approaches

## 🤝 Contributing

This is an educational repository. The main branches are:
- `main` - Starting point with basic setup
- `simple-rtkq` - Simple RTK Query example
- `redux-toolkit-no-rtkq` - Traditional Redux Toolkit
- `complex-rtkq` - Advanced RTK Query features

## 📝 Notes

- Mock data persists in `sessionStorage` during the browser session
- Dog images are placeholders (emoji)
- All API calls are intercepted by MSW in development
- Built with educational clarity in mind

## 📄 License

MIT

## 🙏 Acknowledgments

- Original course concept from egghead.io
- Dog images from [pexels.com](https://www.pexels.com/search/dog/)
- Built with [Vite](https://vitejs.dev/) and [MSW](https://mswjs.io/)
