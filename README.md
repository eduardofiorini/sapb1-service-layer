# SAP Service Layer Library

Library for integrating with SAP Business One Service Layer, providing simplified methods for CRUD operations and API queries.

## 📦 Installation

```sh
npm install sapb1-service-layer
```

## 🚀 How to Use

### Import and Configuration

```javascript
import ServiceLayer from 'sapb1-service-layer';

const config = {
  host: 'https://myserver',
  port: 50000,
  company: 'SBODEMO',
  username: 'manager',
  password: 'mypassword',
  version: 'v2',
  debug: true
};

await ServiceLayer.createSession(config);
```

### Get a Record

```javascript
const response = await ServiceLayer.get('BusinessPartners(\'C0001\')');
console.log(response);
```

### Creating a Business Partner

```javascript
const partner = {
  CardCode: "C0001",
  CardName: "Example Customer",
  CardType: "C"
};

const response = await ServiceLayer.post('BusinessPartners', partner);
console.log(response);
```

### Fetching Items

```javascript
const items = await ServiceLayer.find('Items?$select=ItemCode,ItemName');
console.log(items);
```

### Updating an Order

```javascript
const updatedOrder = {
  DocumentStatus: "C"
};

const response = await ServiceLayer.patch('Orders(10)', updatedOrder);
console.log(response);
```

### Deleting a Record

```javascript
const response = await ServiceLayer.delete('BusinessPartners(\'C0001\')');
console.log(response);
```

## 📖 Documentation

For more details on the available methods, refer to the [Official Service Layer Documentation](https://help.sap.com/doc/056f69366b5345a386bb8149f1700c19/10.0/en-US/Service%20Layer%20API%20Reference.html).

## 🛠️ Development

### Run Tests

```sh
npm test
```

### Generate Documentation

```sh
npm run doc
```

## 📜 License

MIT License

