## Tesco ClubCards of the Day

Tesco ClubCards of the Day is a script developed using Bun to fetch the latest prices of products available with Tesco ClubCards. The script saves the data in a daily JSON file, making it easy to track price changes and deals over time.

### JSON Structure

Each JSON file follows this structure:

```json
[
  {
    "title": "Product Name",
    "price": "Regular Price",
    "clubCardPrice": "Discounted Price with ClubCard",
    "image": "URL to Product Image"
  },
  ...
]
```

Example:

```json
[
  {
    "title": "Tesco 2 Boneless Salmon Fillets 260G",
    "price": "£4.85",
    "clubCardPrice": "£4.00",
    "image": "https://imageurl.jpeg"
  },
  ...
]
```

### Usage

```bash
bun index.ts
```
