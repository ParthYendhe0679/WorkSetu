# WorkSetu

WorkSetu is a modern web application designed to bridge the gap between skilled workers and clients. It provides a seamless platform for clients to post projects, find workers, manage payments, and track progress, while empowering workers to discover opportunities, apply for jobs, and receive seamless payouts.

## 🚀 Key Features

* **Dual-User Experience:** Dedicated dashboards and workflows for both Workers and Clients/Contractors.
* **Worker Discovery:** Advanced worker search with "Hype-based" filtering to find the highest-rated professionals.
* **Interactive AI Voice Assistant:** A context-aware, multi-lingual voice assistant that helps users navigate the platform, check wallet balances, and apply for jobs entirely hands-free.
* **Job Board & Project Management:** Clients can easily create, manage, and track projects. Workers get real-time status updates on their applications.
* **Integrated Payments & Wallets:** Built-in wallet system allowing secure assignment of funds to projects and seamless payouts from clients to workers upon job completion.
* **Real-time Map Integration:** Google Maps API integration (`JobMap`) for location-based job discovery and tracking.
* **Aesthetic & Responsive UI:** Built with Vite, React, and Tailwind CSS offering a premium, smooth, and dynamic user interface with glassmorphic elements and dark mode styling.

## 🛠️ Technology Stack

### Frontend
* **Framework:** React + Vite
* **Styling:** Tailwind CSS + Vanilla CSS (for custom utility classes and animations)
* **Routing:** React Router DOM (BrowserRouter enabled for smooth SPA transitions)
* **API Integration:** Render backend configuration via `VITE_API_URL` environment variable

### Backend
* **Environment:** Node.js with Express.js
* **Database:** MongoDB (using Mongoose for schema modeling)
* **Authentication:** JWT (JSON Web Tokens)
* **Asset Storage:** Cloudinary (for image uploads)
* **Deployment:** Pre-configured for Render (`render.yaml` included)

## 📦 Getting Started

### Prerequisites
* Node.js (v16+)
* MongoDB URI
* A Cloudinary Account (optional, for images)
* Google Maps API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ParthYendhe0679/WorkSetu.git
   cd WorkSetu
   ```

2. Setup Backend:
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file in the `backend` directory with your `MONGODB_URI`, `JWT_SECRET`, and `PORT`.*

3. Setup Frontend:
   ```bash
   cd ../frontend
   npm install
   ```
   *Create a `.env` file in the `frontend` directory with your `VITE_API_URL` and `VITE_GOOGLE_MAPS_API_KEY`.*

4. Run the Development Servers:
   * **Backend:** `npm run dev` (from the `backend` dir)
   * **Frontend:** `npm run dev` (from the `frontend` dir)

## 🌐 Deployment Details
* **Frontend:** Hostable on Vercel with rewrite rules configured (`vercel.json` included to prevent 404 errors on refresh).
* **Backend:** Deployable to Render as a Web Service by connecting the `backend` root directory.
