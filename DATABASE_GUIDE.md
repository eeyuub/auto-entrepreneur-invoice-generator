# Database Guide & Entity Documentation

This project uses a hosted PostgreSQL database for storing invoices and quotes (devis).

## Database Configuration

The application connects to the database using the credentials specified in the `.env` file.
**Important:** Ensure you replace `YOUR_PASSWORD` with the actual database password.

```env
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@5.189.139.94:5433/eyubinvioce
PORT=3001
```

## Entity: `documents`

The main entity storing both Invoices and Quotes is the `documents` table.

### Schema

| Column       | Type      | Description                                      |
| Link         | --------- | ------------------------------------------------ |
| `id`         | SERIAL    | Primary Key (Auto-incrementing integer)          |
| `type`       | TEXT      | Type of document (`FACTURE` or `DEVIS`)          |
| `clientName` | TEXT      | Name of the client (Stored as `clientname`)      |
| `date`       | TEXT      | Document date (format: YYYY-MM-DD)               |
| `total`      | REAL      | Total amount (MAD)                               |
| `content`    | TEXT      | Full JSON string of the document data            |
| `created_at` | TIMESTAMP | Creation timestamp (Default: CURRENT_TIMESTAMP)  |

### SQL Creation Query

The server automatically attempts to create this table if it does not exist on startup:

```sql
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  type TEXT,
  clientName TEXT,
  date TEXT,
  total REAL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

The backend (`server.js`) provides a RESTful API to interact with this entity.
**Note:** The API handles the mapping between the PostgreSQL lowercase column `clientname` and the frontend camelCase property `clientName`.

### 1. Get All Documents
- **Method:** `GET`
- **URL:** `/api/documents`
- **Description:** Retrieves all saved documents, ordered by creation date (newest first).

### 2. Get Single Document
- **Method:** `GET`
- **URL:** `/api/documents/:id`
- **Description:** Retrieves a specific document by ID.

### 3. Create New Document
- **Method:** `POST`
- **URL:** `/api/documents`
- **Body:**
  ```json
  {
    "type": "FACTURE",
    "clientName": "Client Name",
    "date": "2024-03-20",
    "total": 1500.00,
    "content": { ...full document object... }
  }
  ```
- **Response:** `{ "message": "success", "data": { "id": 123 } }`

### 4. Update Document
- **Method:** `PUT`
- **URL:** `/api/documents/:id`
- **Body:** Same as POST.
- **Description:** Updates an existing document's fields and content.

### 5. Delete Document
- **Method:** `DELETE`
- **URL:** `/api/documents/:id`
- **Description:** Permanently removes a document.

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install express pg cors dotenv
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgres://postgres:YOUR_PASSWORD@5.189.139.94:5433/eyubinvioce
   PORT=3001
   ```

3. **Run Server:**
   ```bash
   node server.js
   ```

## Migration from SQLite
The application has been migrated from SQLite to PostgreSQL. The `pg` library is used for connection pooling and query execution. The `server.js` file handles the connection and exposes the same API structure, ensuring frontend compatibility.
