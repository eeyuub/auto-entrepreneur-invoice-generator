# Moroccan Auto-Entrepreneur Invoice & Devis Generator

A professional, compliant, and easy-to-use invoice and quote generator designed specifically for Moroccan Auto-Entrepreneurs. Built with React, Tailwind CSS, and optimized for high-quality PDF output.

## 🚀 Features

-   **Moroccan Legal Compliance**: Includes mandatory fields like ICE (Identifiant Commun de l'entreprise), IF (Identifiant Fiscal), and Taxe Professionnelle.
-   **Professional PDF Output**: Generates clean, A4-sized PDFs with a dedicated signature area and legal footer ("Exonéré de la TVA en vertu de l'article 91...").
-   **Dynamic Document Types**: Toggle easily between **FACTURE** (Invoice) and **DEVIS** (Quote).
-   **Secure Access**: Simple login system protected by a secret key (configurable via `.env`).
-   **Session Persistence**: Stays logged in for 24 hours per browser.
-   **Auto-Calculation**: Automatically calculates line totals and grand totals.
-   **Smart Defaults**: Pre-fills your personal information from a configuration file so you don't have to type it every time.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite)
-   **Styling**: Tailwind CSS
-   **PDF Generation**: `@react-pdf/renderer`
-   **Icons**: Lucide React

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/eeyuub/auto-entrepreneur-invoice-generator.git
    cd auto-entrepreneur-invoice-generator
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Copy the sample environment file and set your secret key and port.
    ```bash
    cp .env.sample .env
    ```
    Open `.env` and update the values:
    ```env
    VITE_SECRET_KEY=your_secure_password
    VITE_PORT=3000
    ```

4.  **Customize Your Profile**
    Edit `src/data/userProfile.json` to add your personal information (Name, ICE, IF, Address, etc.). This data will appear as the default "Emitter" on all documents.

5.  **Run the Application**
    ```bash
    npm run dev
    ```
    Open your browser at `http://localhost:3000` (or your configured port).

## 🔒 Security

This application uses a client-side environment variable (`VITE_SECRET_KEY`) for basic access control. 
-   **Note**: This is intended for personal local use. Since the key is exposed to the client bundle, do not rely on this for hosting sensitive public-facing applications without adding a real backend authentication layer.

## 📄 License

MIT
