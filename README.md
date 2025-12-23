# Backend for Auto-Entrepreneur Invoice Generator

This backend uses [PocketBase](https://pocketbase.io/).

## Setup

1. Download the latest PocketBase release for your platform from the [releases page](https://github.com/pocketbase/pocketbase/releases).
2. Extract the archive into this directory.
3. Run `./pocketbase serve`.

## Schema

Create a collection named `documents` with the following fields:

- `type` (Select: FACTURE, DEVIS)
- `clientName` (Text)
- `date` (Text or Date)
- `total` (Number)
- `content` (JSON)
