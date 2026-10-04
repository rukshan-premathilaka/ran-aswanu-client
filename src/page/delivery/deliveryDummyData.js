// Dummy data is OFF now (USE_DUMMY_DATA = false). Turn it on only while the backend delivery changes are not deployed.
// The keys use the BACKEND names (requestId, description, estimatedWeight) so the pages read both the same way.
export const USE_DUMMY_DATA = false;

// Vehicles offered by deliverers (farmers browse these)
export const DUMMY_VEHICLES = [
    { requestId: "v1", emoji: "🚚", description: "Lorry", vehicleType: "Lorry", estimatedWeight: 1500, userName: "Sunil Perera", pickupLocation: "Nuwara Eliya", destination: "Colombo", preferredDateTime: "2026-10-06T06:00:00" },
    { requestId: "v2", emoji: "🛻", description: "Dual-cab Pickup", vehicleType: "Pickup", estimatedWeight: 600, userName: "Kamala Silva", pickupLocation: "Dambulla", destination: "Kandy", preferredDateTime: "2026-10-05T09:30:00" },
    { requestId: "v3", emoji: "🚐", description: "Van", vehicleType: "Van", estimatedWeight: 400, userName: "Nimal Bandara", pickupLocation: "Bandarawela", destination: "Colombo", preferredDateTime: "2026-10-07T05:00:00" },
    { requestId: "v4", emoji: "🚜", description: "Tractor and Trailer", vehicleType: "Tractor", estimatedWeight: 2500, userName: "Priyanka Fernando", pickupLocation: "Matale", destination: "Dambulla", preferredDateTime: "2026-10-08T07:15:00" },
    { requestId: "v5", emoji: "🚛", description: "Cargo Truck", vehicleType: "Truck", estimatedWeight: 3000, userName: "Ruwan Jayasinghe", pickupLocation: "Anuradhapura", destination: "Negombo", preferredDateTime: "2026-10-09T04:30:00" },
    { requestId: "v6", emoji: "🛺", description: "Three-wheeler", vehicleType: "Three-wheeler", estimatedWeight: 150, userName: "Chaminda Rathnayake", pickupLocation: "Kurunegala", destination: "Kurunegala Town", preferredDateTime: "2026-10-05T14:00:00" },
    { requestId: "v7", emoji: "🚚", description: "Lorry", vehicleType: "Lorry", estimatedWeight: 1200, userName: "Dilani Wickramasinghe", pickupLocation: "Badulla", destination: "Colombo", preferredDateTime: "2026-10-10T06:30:00" },
    { requestId: "v8", emoji: "🚐", description: "Van", vehicleType: "Van", estimatedWeight: 350, userName: "Mahesh Gunawardena", pickupLocation: "Hatton", destination: "Negombo", preferredDateTime: "2026-10-11T08:00:00" },
];

// Requests made by farmers (deliverers browse these)
export const DUMMY_FARMER_REQUESTS = [
    { requestId: "r1", emoji: "🥕", description: "Carrots", vehicleType: "Lorry", estimatedWeight: 800, userName: "Sunil Perera", pickupLocation: "Nuwara Eliya", destination: "Colombo", preferredDateTime: "2026-10-06T05:30:00" },
    { requestId: "r2", emoji: "🍅", description: "Tomatoes", vehicleType: "Pickup", estimatedWeight: 450, userName: "Kamala Silva", pickupLocation: "Dambulla", destination: "Kandy", preferredDateTime: "2026-10-05T08:00:00" },
    { requestId: "r3", emoji: "🥬", description: "Cabbage", vehicleType: "Van", estimatedWeight: 300, userName: "Nimal Bandara", pickupLocation: "Bandarawela", destination: "Colombo", preferredDateTime: "2026-10-07T04:30:00" },
    { requestId: "r4", emoji: "🍆", description: "Brinjals", vehicleType: "Three-wheeler", estimatedWeight: 120, userName: "Priyanka Fernando", pickupLocation: "Matale", destination: "Dambulla", preferredDateTime: "2026-10-08T06:45:00" },
    { requestId: "r5", emoji: "🥔", description: "Potatoes", vehicleType: "Truck", estimatedWeight: 2000, userName: "Asanka Herath", pickupLocation: "Welimada", destination: "Colombo", preferredDateTime: "2026-10-09T05:00:00" },
    { requestId: "r6", emoji: "🌶️", description: "Green Chillies", vehicleType: "Van", estimatedWeight: 200, userName: "Lakmini Perera", pickupLocation: "Anuradhapura", destination: "Kurunegala", preferredDateTime: "2026-10-10T07:00:00" },
    { requestId: "r7", emoji: "🍌", description: "Bananas", vehicleType: "Lorry", estimatedWeight: 900, userName: "Tharindu Senanayake", pickupLocation: "Kurunegala", destination: "Negombo", preferredDateTime: "2026-10-11T06:00:00" },
    { requestId: "r8", emoji: "🍍", description: "Pineapples", vehicleType: "Pickup", estimatedWeight: 500, userName: "Sachini Dissanayake", pickupLocation: "Gampaha", destination: "Colombo", preferredDateTime: "2026-10-12T09:00:00" },
];

// Used by the tracking page while dummy data is on
export function findDummyDelivery(id) {
    const item = [...DUMMY_VEHICLES, ...DUMMY_FARMER_REQUESTS].find((d) => d.requestId === id);
    return item ? { ...item, status: "PENDING", partnerName: item.userName } : null;
}