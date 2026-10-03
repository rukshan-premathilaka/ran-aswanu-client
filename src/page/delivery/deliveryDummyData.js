// Dummy data for now. Set USE_DUMMY_DATA to false when the backend is ready.
export const USE_DUMMY_DATA = true;

// Vehicles offered by deliverers (farmers browse these)
export const DUMMY_VEHICLES = [
    { id: "v1", emoji: "🚚", title: "Lorry", vehicleType: "Lorry", weight: 1500, userName: "Sunil Perera", pickupLocation: "Nuwara Eliya", destination: "Colombo", preferredDateTime: "2026-10-06T06:00:00" },
    { id: "v2", emoji: "🛻", title: "Dual-cab Pickup", vehicleType: "Pickup", weight: 600, userName: "Kamala Silva", pickupLocation: "Dambulla", destination: "Kandy", preferredDateTime: "2026-10-05T09:30:00" },
    { id: "v3", emoji: "🚐", title: "Van", vehicleType: "Van", weight: 400, userName: "Nimal Bandara", pickupLocation: "Bandarawela", destination: "Colombo", preferredDateTime: "2026-10-07T05:00:00" },
    { id: "v4", emoji: "🚜", title: "Tractor and Trailer", vehicleType: "Tractor", weight: 2500, userName: "Priyanka Fernando", pickupLocation: "Matale", destination: "Dambulla", preferredDateTime: "2026-10-08T07:15:00" },
    { id: "v5", emoji: "🚛", title: "Cargo Truck", vehicleType: "Truck", weight: 3000, userName: "Ruwan Jayasinghe", pickupLocation: "Anuradhapura", destination: "Negombo", preferredDateTime: "2026-10-09T04:30:00" },
    { id: "v6", emoji: "🛺", title: "Three-wheeler", vehicleType: "Three-wheeler", weight: 150, userName: "Chaminda Rathnayake", pickupLocation: "Kurunegala", destination: "Kurunegala Town", preferredDateTime: "2026-10-05T14:00:00" },
    { id: "v7", emoji: "🚚", title: "Lorry", vehicleType: "Lorry", weight: 1200, userName: "Dilani Wickramasinghe", pickupLocation: "Badulla", destination: "Colombo", preferredDateTime: "2026-10-10T06:30:00" },
    { id: "v8", emoji: "🚐", title: "Van", vehicleType: "Van", weight: 350, userName: "Mahesh Gunawardena", pickupLocation: "Hatton", destination: "Negombo", preferredDateTime: "2026-10-11T08:00:00" },
];

// Requests made by farmers (deliverers browse these)
export const DUMMY_FARMER_REQUESTS = [
    { id: "r1", emoji: "🥕", title: "Carrots", vehicleType: "Lorry", weight: 800, userName: "Sunil Perera", pickupLocation: "Nuwara Eliya", destination: "Colombo", preferredDateTime: "2026-10-06T05:30:00" },
    { id: "r2", emoji: "🍅", title: "Tomatoes", vehicleType: "Pickup", weight: 450, userName: "Kamala Silva", pickupLocation: "Dambulla", destination: "Kandy", preferredDateTime: "2026-10-05T08:00:00" },
    { id: "r3", emoji: "🥬", title: "Cabbage", vehicleType: "Van", weight: 300, userName: "Nimal Bandara", pickupLocation: "Bandarawela", destination: "Colombo", preferredDateTime: "2026-10-07T04:30:00" },
    { id: "r4", emoji: "🍆", title: "Brinjals", vehicleType: "Three-wheeler", weight: 120, userName: "Priyanka Fernando", pickupLocation: "Matale", destination: "Dambulla", preferredDateTime: "2026-10-08T06:45:00" },
    { id: "r5", emoji: "🥔", title: "Potatoes", vehicleType: "Truck", weight: 2000, userName: "Asanka Herath", pickupLocation: "Welimada", destination: "Colombo", preferredDateTime: "2026-10-09T05:00:00" },
    { id: "r6", emoji: "🌶️", title: "Green Chillies", vehicleType: "Van", weight: 200, userName: "Lakmini Perera", pickupLocation: "Anuradhapura", destination: "Kurunegala", preferredDateTime: "2026-10-10T07:00:00" },
    { id: "r7", emoji: "🍌", title: "Bananas", vehicleType: "Lorry", weight: 900, userName: "Tharindu Senanayake", pickupLocation: "Kurunegala", destination: "Negombo", preferredDateTime: "2026-10-11T06:00:00" },
    { id: "r8", emoji: "🍍", title: "Pineapples", vehicleType: "Pickup", weight: 500, userName: "Sachini Dissanayake", pickupLocation: "Gampaha", destination: "Colombo", preferredDateTime: "2026-10-12T09:00:00" },
];

// Used by the tracking page while dummy data is on
export function findDummyDelivery(id) {
    const item = [...DUMMY_VEHICLES, ...DUMMY_FARMER_REQUESTS].find((d) => d.id === id);
    return item ? { ...item, status: "Scheduled", partnerName: item.userName } : null;
}