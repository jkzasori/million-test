// MongoDB initialization script for Million Test Properties
// This script runs when the MongoDB container starts for the first time

print('🏠 Initializing Million Test Properties Database...');

// Switch to the application database
db = db.getSiblingDB('MillionTestProperties');

// Create application user with read/write permissions
db.createUser({
  user: 'millionapp',
  pwd: 'million123',
  roles: [
    {
      role: 'readWrite',
      db: 'MillionTestProperties'
    }
  ]
});

// Create collections with validation and indexes
print('📊 Creating collections and indexes...');

// Properties collection
db.createCollection('Properties', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['IdProperty', 'Name', 'Address', 'Price'],
      properties: {
        IdProperty: { bsonType: 'int' },
        Name: { bsonType: 'string' },
        Address: { bsonType: 'string' },
        Price: { bsonType: 'number', minimum: 0 },
        CodeInternal: { bsonType: 'string' },
        Year: { bsonType: 'int', minimum: 1800 },
        IdOwner: { bsonType: 'int' }
      }
    }
  }
});

// Owners collection
db.createCollection('Owners', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['IdOwner', 'Name'],
      properties: {
        IdOwner: { bsonType: 'int' },
        Name: { bsonType: 'string' },
        Address: { bsonType: 'string' },
        Photo: { bsonType: 'string' },
        Birthday: { bsonType: 'date' }
      }
    }
  }
});

// PropertyImages collection
db.createCollection('PropertyImages');

// PropertyTraces collection
db.createCollection('PropertyTraces');

// Create indexes for better performance
print('🚀 Creating performance indexes...');

// Properties indexes
db.Properties.createIndex({ 'IdProperty': 1 }, { unique: true });
db.Properties.createIndex({ 'Name': 'text', 'Address': 'text' });
db.Properties.createIndex({ 'Price': 1 });
db.Properties.createIndex({ 'IdOwner': 1 });
db.Properties.createIndex({ 'Year': 1 });

// Owners indexes
db.Owners.createIndex({ 'IdOwner': 1 }, { unique: true });
db.Owners.createIndex({ 'Name': 'text' });

// PropertyImages indexes
db.PropertyImages.createIndex({ 'IdProperty': 1 });
db.PropertyImages.createIndex({ 'IdPropertyImage': 1 }, { unique: true });

// PropertyTraces indexes
db.PropertyTraces.createIndex({ 'IdProperty': 1 });
db.PropertyTraces.createIndex({ 'IdPropertyTrace': 1 }, { unique: true });
db.PropertyTraces.createIndex({ 'DateSale': 1 });

print('✅ Million Test Properties Database initialized successfully!');
print('📊 Collections created: Properties, Owners, PropertyImages, PropertyTraces');
print('🚀 Performance indexes created');
print('👤 Application user "millionapp" created with readWrite permissions');