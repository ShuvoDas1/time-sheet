# Timesheet Application

## Overview
The Timesheet Application is a React-based web app designed to help users log daily work statuses, submit monthly timesheets, and analyze work data through an intuitive dashboard. Built with React and ShadCN UI components, it ensures a user-friendly, modern interface.

## Features

### 1. Interactive Calendar
- Displays a monthly calendar with the current month as default.
- Allows users to select days and assign work statuses:
  - **Working:** Input daily work hours.
  - **Vacation:** 
  - **Sick Leave:** Includes optional notes.
  - **Holiday And :** Pre-filled based on mock data.
- Icon indicators for each status.
- Edit previously logged statuses.

### 2. Timesheet Submission a
- User can submit all days as a working day, excluding holidays and weekends..
- User can submit recurring status for a specific day of the month..
- User can submit the full month’s days at a time.
- User can submit a single day's status.

### 3. Analytics Dashboard
- Visualizes work data for the current month.
- **Key Metrics:**
  - Total hours worked.
  - Number of vacation and sick leave days.
  - Percentage of workdays vs. non-working days.
- **Charts:**
  - Bar chart for weekly/daily hours worked.
  - Pie chart for status breakdown.

### 4. Bonus Features
- **Dark Mode:** Toggle between light and dark themes.
- **Export Data:** Export timesheet data as PDF.

## Technology Stack
- **Frontend:** React with functional components and hooks.
- **UI Library:** ShadCN components.
- **State Management:** Local state management with React hooks and Context API.
- **Charts:** Recharts for visualizations.
- **API Integration:** Mock APIs using json-server.
- **Responsive Design:** Mobile and desktop compatibility.

## Installation and Setup

### Prerequisites
- Node.js (v14 or later)
- npm or Yarn

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/ShuvoDas1/time-sheet
   cd timesheet-application
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Run mock API server:
   ```bash
   npx json-server --watch db/db.json --port 3001
   ```

5. Open the application in your browser:
   - Development server: `http://localhost:5173/`
   - Mock API server: `http://localhost:3001/`

## Project Structure
```
.
├── public
├── src
│   ├── assets
│   ├── components
│   ├── context
│   ├── hooks
│   ├── pages
├── db
│   └── db.json
├── README.md
└── package.json
```

## Features in Development
- Export data functionality.
- Improved accessibility testing.
- Advanced analytics filters.

## Challenges Faced
- Implementing a dynamic calendar with custom statuses.
- Optimizing responsive design for diverse screen sizes.

## Future Enhancements
- Integration with a real backend API.
- Multi-language support.
- Advanced filtering and search capabilities for analytics.
