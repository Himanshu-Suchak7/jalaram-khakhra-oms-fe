# API Requirements (Frontend + Backend)

## Scope Summary
Static data still present in these routes and must be replaced with API data:
- Dashboard (`app/(dashboard)/page.js`)
- Orders (`app/(dashboard)/orders/page.jsx`)
- Inventory (`app/(dashboard)/inventory/page.jsx`)
- Invoice view (`app/(dashboard)/orders/[id]/invoice/page.jsx`)

Backend status today:
- `routers/orders.py` exists but empty.
- `routers/inventory.py` exists but empty.
- No dashboard/analytics router yet.

Total required endpoints: **7**

---

## Frontend Requirements

### 1) Dashboard
**Current UI needs**:
- KPI cards: Pending, Fulfilled, Cancelled, Total Revenue (INR, 2 decimals)
- Order status chart (pending/fulfilled/cancelled totals + overall total)
- Revenue graph (last 30 days, 4 weekly points)
- Recent orders table, always shows the latest 5 orders (id, customer, date, status, total)

**Frontend data contract**:
- Consumes `GET /dashboard/overview`
- No pagination

### 2) Orders List
**Current UI needs**:
- List of orders with: order number, customer name, total amount, order status, payment status
- Search by order number or customer name

**Frontend data contract**:
- Consumes `GET /orders`
- Supports `search`, `status`, `payment_status` query params
- No pagination

### 3) Inventory
**Current UI needs**:
- Summary cards: total products, low stock, out of stock
- Table: product name, stock (kg), min stock, status, image
- Add Stock button opens a popup and updates stock

**Frontend data contract**:
- Consumes `GET /inventory/summary`
- Consumes `GET /inventory/items`
- Add Stock action calls `POST /inventory/transactions` (action = `ADD`)
- Supports `search`, `status` query params
- No pagination

### 4) Invoice View
**Current UI needs**:
- Business details (name, address, phone, GSTIN, UPI ID)
- Invoice number + invoice date
- Customer details
- Itemized list (product, qty, price/kg, line total)
- QR image for UPI
- Subtotal, tax, shipping, grand total
- Download invoice PDF button

**Frontend data contract**:
- Consumes `GET /orders/{id}/invoice` for UI
- Download action hits `GET /orders/{id}/invoice.pdf`

---

## Backend Requirements

### Global Rules
- Currency: INR, two decimal places in responses for monetary values.
- Revenue = sum of `total` for **FULFILLED** orders only.
- Inventory stock is **ledger-only**: derive current stock from `inventory_transactions`.
- Order stock reservation: on order creation, stock is **temporarily blocked**; on fulfillment, stock is deducted; on cancellation, blocked stock is released.
- No pagination (for now).

### Required Endpoints

#### 1) Dashboard Overview
**Endpoint**: `GET /dashboard/overview`

**Response**:
```json
{
  "cards": {
    "pending_orders": 15,
    "fulfilled_orders": 128,
    "cancelled_orders": 8,
    "total_revenue": 25483.50
  },
  "order_status": {
    "pending": 15,
    "fulfilled": 128,
    "cancelled": 8,
    "total": 151
  },
  "revenue_overview": {
    "days": 30,
    "series": [
      {"label": "Week 1", "value": 30},
      {"label": "Week 2", "value": 40},
      {"label": "Week 3", "value": 20},
      {"label": "Week 4", "value": 60}
    ]
  },
  "recent_orders": [
    {
      "order_id": "#A583",
      "customer_name": "John Doe",
      "date": "2025-12-25",
      "status": "FULFILLED",
      "total": 250.00
    }
  ]
}
```

#### 2) Orders List (No Pagination)
**Endpoint**: `GET /orders`

**Query Params**:
- `search` (string, optional)
- `status` (optional: `PENDING|FULFILLED|CANCELLED`)
- `payment_status` (optional: `PAID|UNPAID|PARTIAL`)

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "order_number": "#ORD-001",
      "customer_name": "Himanshu Suchak",
      "total_amount": 500.00,
      "order_status": "FULFILLED",
      "payment_status": "PAID",
      "created_at": "2025-12-25T10:30:00Z"
    }
  ]
}
```

#### 3) Inventory Summary
**Endpoint**: `GET /inventory/summary`

**Response**:
```json
{
  "total_products": 20,
  "low_stock_products": 5,
  "out_of_stock_products": 2
}
```

#### 4) Inventory Items (No Pagination)
**Endpoint**: `GET /inventory/items`

**Query Params**:
- `search` (string, optional)
- `status` (optional: `OK|LOW_STOCK|OUT_OF_STOCK`)

**Response**:
```json
{
  "data": [
    {
      "product_id": "uuid",
      "product_name": "Methi Khakhra",
      "stock_kg": 50.0,
      "min_stock_kg": 10.0,
      "status": "OK",
      "image": "/uploads/products/methi-khakhra.png"
    }
  ]
}
```

**Inventory Stock Semantics (Ledger-only)**:
- `stock_kg`: available stock (on-hand minus reserved/blocked).
- `reserved_kg`: not shown in UI but must be tracked to support blocking by open orders.

**Status Rules (suggested)**:
- `OK` if `stock_kg > min_stock_kg`
- `LOW_STOCK` if `0 < stock_kg <= min_stock_kg`
- `OUT_OF_STOCK` if `stock_kg == 0`

#### 5) Inventory Transaction (Add Stock)
**Endpoint**: `POST /inventory/transactions`

**Purpose**: Add stock from Inventory UI (Add Stock popup).\n
**Request**:
```json
{
  "product_id": "uuid",
  "action": "ADD",
  "quantity_kg": 25.5,
  "notes": "New batch received"
}
```

**Response**:
```json
{
  "message": "Inventory updated",
  "transaction_id": "uuid",
  "product_id": "uuid",
  "current_stock_kg": 120.0,
  "stock_kg": 95.0
}
```

#### 6) Invoice Data (Per Order)
**Endpoint**: `GET /orders/{id}/invoice`

**Business Data Source**:
- Use `business_settings` (single business: Jalaram Khakhra)

**Tax/Shipping Rules**:
- Tax = **18%** of order total
- Shipping = **15%** of order total

**Response**:
```json
{
  "invoice_number": "INV-26-04-0005",
  "invoice_date": "2026-04-27",
  "business": {
    "name": "Jalaram Khakhra",
    "address": "123, Commerce Street, Ahmedabad, Gujarat 380058",
    "phone": "+91 9876543210",
    "gstin": "24ABCDE1234F1Z5",
    "upi_id": "jalaram.khakhra@upi",
    "upi_qr_image": "https://.../qr.png"
  },
  "bill_to": {
    "name": "Customer Name",
    "phone": "+91 9876543210"
  },
  "items": [
    {
      "product_name": "Methi Khakhra",
      "quantity_kg": 5.0,
      "price_per_kg": 200.0,
      "line_total": 1000.0
    }
  ],
  "summary": {
    "subtotal": 400.0,
    "tax": 72.0,
    "shipping": 50.0,
    "grand_total": 522.0
  },
  "notes": "Thank You for your Business!"
}
```

#### 7) Invoice PDF (Generate + Cache + Download)
**Endpoint**: `GET /orders/{id}/invoice.pdf`

**Behavior**:
- If PDF exists in Supabase storage, return it directly.
- If not, generate from the same HTML layout as the UI card, store in Supabase, then return it.

**Response**: `application/pdf`

**Invoice Number Format**:
- `INV-YY-MM-####`
- Example: April 2026, 5th invoice of the month -> `INV-26-04-0005`
- Reset sequence each month (single business).

---

## Optional (Not Required for Current Static UI)

### Orders
- `GET /orders/{id}` (Order details + items)
- `POST /orders` (Create order)
- `PATCH /orders/{id}` (Update order)
- `DELETE /orders/{id}` (Cancel or soft delete)

**Order Stock Blocking Rules (Required for Production)**:
- On order creation: **reserve/block** quantities for each item.
- On order fulfillment: **deduct** blocked quantities from on-hand stock.
- On order cancellation: **release** blocked quantities back to available.

### Inventory
- `POST /inventory/transactions` (Add/Deduct/Adjust stock)
- `GET /inventory/transactions` (Audit trail)

---

## Error Format (Recommended)
Use RFC 7807 `application/problem+json` for consistent error responses.

```json
{
  "type": "https://example.com/probs/validation-error",
  "title": "Validation failed",
  "status": 400,
  "detail": "One or more fields are invalid",
  "instance": "/orders"
}
```
