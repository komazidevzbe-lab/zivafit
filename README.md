![ZivaFit Activewear E-Commerce Platform](./screenshots/zivafit_banner.png)

# 🛍️ ZivaFit

### Full-Stack Women-Focused Activewear E-Commerce Platform

ZivaFit is a full-stack e-commerce web application designed for a modern women-focused activewear brand. The platform allows customers to browse products, create accounts, manage their cart, complete the checkout process, view orders and interact with a polished online storefront.

The project combines a modern Angular frontend with an ASP.NET Core backend and SQL Server database, together with an administrative system for managing products, customers, orders and store content.

## ✨ Project Overview

ZivaFit was created to demonstrate how a complete digital shopping experience can be built for a modern e-commerce business.

The application focuses on:

- Activewear product browsing
- Product categories and collections
- Customer registration and authentication
- Product-detail viewing
- Shopping cart management
- Checkout workflow
- Customer order history
- Password recovery
- Responsive e-commerce interface design
- Customer management
- Product catalogue management
- Order administration
- Customer review management
- Newsletter management
- Storefront content management
- Store settings and administration
- Structured full-stack architecture

## 🛠️ Tech Stack

| ![Angular](https://skillicons.dev/icons?i=angular)<br>**Angular** | ![TypeScript](https://skillicons.dev/icons?i=ts)<br>**TypeScript** | ![ASP.NET Core](https://skillicons.dev/icons?i=dotnet)<br>**ASP.NET Core** | ![C#](https://skillicons.dev/icons?i=cs)<br>**C#** | ![SQL Server](https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg)<br>**SQL Server** | ![Docker](https://skillicons.dev/icons?i=docker)<br>**Docker** |
| --- | --- | --- | --- | --- | --- |

## 🛒 Application Preview

### 🏠 Landing Page

The ZivaFit landing page introduces the activewear brand and provides customers with direct access to products, collections and shopping categories.

![ZivaFit landing page](./screenshots/LandingPage.png)

### Signed-In Customer Experience

Once authenticated, customers can access their account while continuing to browse the store and shop normally.

![ZivaFit logged-in landing page](./screenshots/LandingPageLoggedIn.png)

![ZivaFit product categories and best sellers](./screenshots/LandingPageLoggedIn2.png)

## 👗 Product Browsing

Customers can browse activewear by category and explore products available through the storefront.

### Leggings Collection

![ZivaFit leggings product page](./screenshots/LeggingsProductPage.png)

### Product Details

Customers can view individual product information before adding an item to their shopping cart.

![ZivaFit selected product page](./screenshots/SelectedProductPage.png)

## 🔐 Authentication

ZivaFit includes customer account functionality for accessing personalised shopping features.

### Sign In

![ZivaFit login page](./screenshots/LoginPage.png)

### Create Account

![ZivaFit signup page](./screenshots/SignUpPage.png)

### Password Recovery

Customers can access the password-reset workflow when they need to recover their account.

![ZivaFit password reset page](./screenshots/ResetPasswordPage.png)

## 🛒 Shopping Cart

Customers can review products selected for purchase, manage quantities and continue through the shopping process.

![ZivaFit shopping cart](./screenshots/CartPage.png)

## 📦 Customer Orders

Authenticated customers can view their existing orders and track their purchasing history.

![ZivaFit customer orders page](./screenshots/MyOrdersPage.png)

## 🛠️ Administrative Management

ZivaFit includes an administrative interface for managing the e-commerce store and its content.

### Customer Management

Administrators can view and manage customer information through the store-management interface.

![ZivaFit admin customer management](./screenshots/AdminCustomersPage.png)

### Product Catalogue

Products displayed in the storefront can be managed through the administrative product catalogue.

![ZivaFit admin product catalogue](./screenshots/AdminProductCatalogPage.png)

### Order Management

Administrators can review and manage customer orders.

![ZivaFit admin order management](./screenshots/AdminOrderManagementPage.png)

### Store Management

The administration system provides tools for managing important store information and operations.

![ZivaFit store management](./screenshots/AdmnStoreManagementPage.png)

### Storefront Content

Content displayed on the customer-facing storefront can be managed through the administrative interface.

![ZivaFit storefront content management](./screenshots/AdminStorefrontContentPage.png)

### Store Settings

Store configuration can be managed from the administrative dashboard.

![ZivaFit store settings](./screenshots/AdminStoreSettings.png)

### Customer Reviews

Administrators can review and manage customer feedback.

![ZivaFit customer review management](./screenshots/AdminReviewsPage.png)

### Newsletter Management

Newsletter subscribers and related communication information can be managed through the administrative interface.

![ZivaFit newsletter management](./screenshots/AdminNewsletterPage.png)

## 🖥️ Store Footer

The storefront footer provides customers with additional navigation and business information.

![ZivaFit footer](./screenshots/Footer.png)

## ⭐ Key Features

- Women-focused activewear storefront
- Responsive e-commerce interface
- Product-category browsing
- Product-detail pages
- Customer registration and authentication
- Password recovery
- Shopping cart functionality
- Checkout workflow
- Customer order history
- Product catalogue management
- Customer management
- Administrative order management
- Customer review management
- Newsletter management
- Storefront content management
- Store settings management
- Angular frontend connected to an ASP.NET Core backend
- SQL Server data persistence
- Docker configuration

## 🏗️ Project Architecture

```text
Angular Client
      │
      │ HTTP / REST
      ▼
ASP.NET Core API
      │
      │ Entity Framework Core
      ▼
SQL Server Database
```

## 📁 Project Structure

```text
zivafit/
│
├── API/                  # ASP.NET Core backend
│
├── client/               # Angular frontend
│
├── screenshots/          # Project screenshots and README assets
│
├── .gitignore
│
├── docker-compose.yml    # Docker configuration
│
├── ZivaFit.sln           # .NET solution
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure the following tools are installed:

- .NET SDK
- Node.js
- npm
- Angular CLI
- SQL Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/komazidevzbe-lab/zivafit.git
```

Navigate into the project:

```bash
cd zivafit
```

### 2. Run the Backend

Navigate to the API project:

```bash
cd API
```

Restore the required packages:

```bash
dotnet restore
```

Run the backend:

```bash
dotnet run
```

### 3. Run the Angular Client

Open another terminal and navigate to the client:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the Angular development server:

```bash
ng serve
```

Then open:

```text
http://localhost:4200
```

## 📌 Project Status

ZivaFit is currently maintained as a portfolio project.

The source code and screenshots demonstrate the application's customer-facing storefront, authentication functionality, shopping workflow, order management and administrative system.

The project continues to serve as a demonstration of full-stack e-commerce development using Angular, ASP.NET Core and SQL Server.

## 💡 What I Learned

Through the development of ZivaFit, I gained practical experience with:

- Building a full-stack e-commerce application
- Developing customer-facing interfaces with Angular
- Building REST API functionality with ASP.NET Core
- Working with SQL Server and relational application data
- Creating customer authentication workflows
- Designing product browsing and product-detail experiences
- Implementing shopping-cart functionality
- Building customer order-management workflows
- Designing administrative management interfaces
- Managing products, customers and orders
- Creating store-content management functionality
- Designing responsive e-commerce layouts
- Organising large applications into frontend and backend layers
- Using Git and GitHub for version control
- Working with Docker-based application configuration
- Debugging and refining complete customer shopping flows
- Designing software around a real-world retail business use case

## 🎯 Project Purpose

ZivaFit was developed as a practical full-stack project to demonstrate how modern web technologies can be used to build a complete e-commerce experience for a retail brand.

The project combines software development, database management, e-commerce functionality, administrative management and user-focused interface design into one complete application.

## 👩🏽‍💻 Author

**Zintle Elsie Komazi**

Junior Software Developer | Aspiring Data Analyst

<a href="https://github.com/komazidevzbe-lab">
  <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" />
</a>
<a href="https://www.linkedin.com/in/zbekomazi232">
  <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" />
</a>
<a href="mailto:komazi.job@gmail.com">
  <img src="https://img.shields.io/badge/Email-EA4335?style=flat-square&logo=gmail&logoColor=white" />
</a>
<a href="https://portfolio-zbe-app-drhbcfa8f0a7etgq.southafricanorth-01.azurewebsites.net/">
  <img src="https://img.shields.io/badge/Portfolio-7C3AED?style=flat-square&logo=microsoftazure&logoColor=white" />
</a>

**Strength • Style • Technology**
