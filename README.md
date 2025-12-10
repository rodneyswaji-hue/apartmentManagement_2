# 🏢 Apartment Management System

A modern **Apartment Management System** built to help landlords or property managers efficiently manage properties, apartments, tenants, and rent payments from a single dashboard.

The project focuses on simplicity, clean UI, and reliable data handling using a modern web stack.

---

## ✨ Features

* 🔐 **Secure Login System** (single authorized user)
* 🏠 **Property Management**

  * Add, edit, and delete properties
* 🚪 **Apartment Management**

  * Assign apartments to properties
  * Track rent amount, debt, and payment status
* 👤 **Tenant Management**

  * Store tenant name and phone number
* 💰 **Payment Tracking**

  * Record rent payments
  * Automatically update debt and payment status
* 🔍 **Search & Filter**

  * Search by apartment, house number, or tenant name
  * Filter by payment status (paid / unpaid)
* 📊 **Dashboard Overview**

  * Clear visual cards for properties and apartments

---

## 🛠 Tech Stack

### Frontend

* **React + TypeScript**
* **Vite** for fast development
* **Tailwind CSS** for styling
* **Framer Motion** for animations
* **Lucide Icons**

### Backend / Database

* **Supabase (PostgreSQL)**
* SQL-based relational database

---

## 🗂 Database Structure

* **Properties** – stores property/building information
* **Apartments** – linked to properties, stores rent and payment data
* **Tenants** – stores tenant name and phone number
* **Payments** – tracks rent payments per apartment

> SQL schema is included in the project for easy setup.

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone github.com/rodneyswaji-hue/apartmentManagement_2
cd apartment-management-system
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Supabase

Create a `.env` file and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4️⃣ Run the Project

```bash
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

---

## 🔐 Authentication Notes

* The system is designed for **a single authorized user**
* Sign-up is disabled
* Login credentials are manually managed in Supabase

---

## 📌 Project Goals

* Learn and apply **TypeScript in a real-world React project**
* Practice **relational database design**
* Build a clean, user-friendly dashboard
* Implement real CRUD operations with Supabase

---

## 📷 Screenshots



---

## 🧠 Future Improvements

* Role-based authentication
* Monthly payment reports
* Export data to CSV/PDF
* SMS or email rent reminders

---

## 📄 License

This project is open-source and available for learning and personal use.

---

## 🙌 Acknowledgements

Built as a Home project to strengthen skills in **React, TypeScript, SQL, and Supabase**.
