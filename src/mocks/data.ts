import { Condo, ServiceCategory, ServiceProvider, ServiceRecord, User, UserCondo, PriceAlert } from "@/types";

export const currentUser: User = {
  id: "user1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://randomuser.me/api/portraits/men/1.jpg"
};

export const users: User[] = [
  currentUser,
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    id: "user3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg"
  }
];

export const condos: Condo[] = [
  {
    id: "condo1",
    name: "Seaside Towers",
    address: "123 Ocean Blvd",
    city: "Miami",
    state: "FL",
    zipCode: "33139",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29uZG98ZW58MHx8MHx8fDA%3D"
  },
  {
    id: "condo2",
    name: "Mountain View Residences",
    address: "456 Alpine Road",
    city: "Denver",
    state: "CO",
    zipCode: "80202",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbmRvfGVufDB8fDB8fHww"
  },
  {
    id: "condo3",
    name: "City Center Suites",
    address: "789 Downtown Ave",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    image: "https://images.unsplash.com/photo-1580041065738-e72023775cdc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNvbmRvfGVufDB8fDB8fHww"
  }
];

export const userCondos: UserCondo[] = [
  {
    userId: "user1",
    condoId: "condo1",
    role: "admin"
  },
  {
    userId: "user1",
    condoId: "condo2",
    role: "member"
  },
  {
    userId: "user2",
    condoId: "condo1",
    role: "member"
  },
  {
    userId: "user3",
    condoId: "condo3",
    role: "admin"
  }
];

export const serviceCategories: ServiceCategory[] = [
  "mechanic",
  "cleaning",
  "plumbing",
  "electrical",
  "painting",
  "gardening",
  "security",
  "maintenance",
  "construction",
  "other"
];

export const serviceCategoryLabels: Record<ServiceCategory, string> = {
  mechanic: "Mechanic",
  cleaning: "Cleaning",
  plumbing: "Plumbing",
  electrical: "Electrical",
  painting: "Painting",
  gardening: "Gardening",
  security: "Security",
  maintenance: "Maintenance",
  construction: "Construction",
  other: "Other"
};

export const serviceProviders: ServiceProvider[] = [
  {
    id: "provider1",
    name: "Quick Fix Plumbing",
    category: "plumbing",
    phone: "555-123-4567",
    email: "info@quickfixplumbing.com",
    website: "https://quickfixplumbing.com",
    address: "100 Main St, Miami, FL 33139",
    condoId: "condo1",
    createdBy: "user1",
    createdByUser: users[0],
    createdAt: "2024-01-15T14:30:00Z",
    updatedAt: "2024-01-15T14:30:00Z"
  },
  {
    id: "provider2",
    name: "Elite Cleaning Services",
    category: "cleaning",
    phone: "555-234-5678",
    email: "contact@elitecleaning.com",
    website: "https://elitecleaning.com",
    address: "200 Beach Rd, Miami, FL 33139",
    condoId: "condo1",
    createdBy: "user1",
    createdByUser: users[0],
    createdAt: "2024-01-20T10:15:00Z",
    updatedAt: "2024-01-20T10:15:00Z"
  },
  {
    id: "provider3",
    name: "Ace Electrical",
    category: "electrical",
    phone: "555-345-6789",
    email: "service@aceelectrical.com",
    website: "https://aceelectrical.com",
    address: "300 Power Ave, Miami, FL 33139",
    condoId: "condo1",
    createdBy: "user2",
    createdByUser: users[1],
    createdAt: "2024-02-05T16:45:00Z",
    updatedAt: "2024-02-05T16:45:00Z"
  },
  {
    id: "provider4",
    name: "Mountain Maintenance",
    category: "maintenance",
    phone: "555-456-7890",
    email: "help@mountainmaintenance.com",
    website: "https://mountainmaintenance.com",
    address: "400 Summit St, Denver, CO 80202",
    condoId: "condo2",
    createdBy: "user1",
    createdByUser: users[0],
    createdAt: "2024-02-10T09:20:00Z",
    updatedAt: "2024-02-10T09:20:00Z"
  },
  {
    id: "provider5",
    name: "Urban Painting Co.",
    category: "painting",
    phone: "555-567-8901",
    email: "paint@urbanpainting.com",
    website: "https://urbanpainting.com",
    address: "500 Color Blvd, Chicago, IL 60601",
    condoId: "condo3",
    createdBy: "user3",
    createdByUser: users[2],
    createdAt: "2024-03-01T13:10:00Z",
    updatedAt: "2024-03-01T13:10:00Z"
  }
];

export const generateMockServiceRecords = (): ServiceRecord[] => {
  const records: ServiceRecord[] = [];
  
  // Generate records for each provider
  serviceProviders.forEach((provider, idx) => {
    // Generate 3-6 records per provider
    const recordCount = 3 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < recordCount; i++) {
      // Generate a date within the last year
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));
      const formattedDate = date.toISOString().split('T')[0];
      
      // Get a random user from the condo
      const relevantUserCondos = userCondos.filter(uc => uc.condoId === provider.condoId);
      const randomUserCondo = relevantUserCondos[Math.floor(Math.random() * relevantUserCondos.length)];
      const creator = users.find(u => u.id === randomUserCondo.userId) || users[0];
      
      // Randomly select a user who requested the service
      const requester = Math.random() > 0.5 ? 
        users[Math.floor(Math.random() * users.length)] : 
        creator;
      
      // Create a record
      records.push({
        id: `record${records.length + 1}`,
        serviceProviderId: provider.id,
        serviceProvider: provider,
        condoId: provider.condoId,
        createdBy: creator.id,
        createdByUser: creator,
        requestedBy: requester.id,
        requestedByUser: requester,
        description: `${provider.name} service ${i + 1}`,
        price: 50 + Math.floor(Math.random() * 200),
        date: formattedDate,
        documentation: Math.random() > 0.3 ? `Invoice #${10000 + Math.floor(Math.random() * 90000)}` : undefined,
        documentationUrl: Math.random() > 0.5 ? `https://example.com/docs/invoice${Math.floor(Math.random() * 1000)}.pdf` : undefined,
        rating: Math.random() > 0.3 ? 1 + Math.floor(Math.random() * 5) : undefined,
        notes: Math.random() > 0.5 ? "Service completed satisfactorily." : undefined,
        createdAt: new Date(date).toISOString(),
        updatedAt: new Date(date).toISOString()
      });
    }
  });
  
  // Sort by date, most recent first
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const serviceRecords: ServiceRecord[] = generateMockServiceRecords();

export const priceAlerts: PriceAlert[] = [
  {
    id: "alert1",
    condoId: "condo1",
    userId: "user1",
    serviceCategory: "plumbing",
    threshold: 150,
    isAboveThreshold: true,
    isActive: true,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-10T09:00:00Z"
  },
  {
    id: "alert2",
    condoId: "condo1",
    userId: "user1",
    serviceCategory: "cleaning",
    threshold: 100,
    isAboveThreshold: false,
    isActive: true,
    createdAt: "2024-01-15T11:30:00Z",
    updatedAt: "2024-01-15T11:30:00Z"
  },
  {
    id: "alert3",
    condoId: "condo2",
    userId: "user1",
    serviceCategory: "maintenance",
    threshold: 200,
    isAboveThreshold: true,
    isActive: false,
    createdAt: "2024-02-05T14:45:00Z",
    updatedAt: "2024-02-05T14:45:00Z",
    lastTriggered: "2024-02-10T08:20:00Z"
  }
];
