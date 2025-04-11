# Santerion - Software Development Company Website

This is a simple website for a software development company built with Next.js and Shadcn UI. The website includes a landing page and a structure for adding projects projects.

## Features

- Modern UI using Next.js 14 and Shadcn UI
- Responsive design for all device sizes
- Landing page with company information
- Portfolio page structure for showcasing projects
- Contact page

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/santerion-website.git
cd santerion-website
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

- `src/app/page.tsx` - Landing page
- `src/app/projects/page.tsx` - Portfolio overview page
- `src/app/projects/[project]/page.tsx` - Individual project pages
- `src/app/contact/page.tsx` - Contact page
- `src/components/` - Reusable components
  - `Navbar.tsx` - Navigation bar component
  - `Hero.tsx` - Hero section component
  - `ui/` - Shadcn UI components

## Customization

To add new projects to the projects:

1. Create a new folder under `src/app/projects/` with the project slug
2. Create a `page.tsx` file in the new folder with the project details

## Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
