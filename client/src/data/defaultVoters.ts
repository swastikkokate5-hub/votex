export interface Voter {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  address: string;
  booth: string;
}

export const defaultVoters: Voter[] = [
  {
    id: "VOT1001",
    name: "Aarav Sharma",
    age: 28,
    gender: "Male",
    address: "Pune, Maharashtra",
    booth: "ZEAL-01",
  },
  {
    id: "VOT1002",
    name: "Kavya Patel",
    age: 22,
    gender: "Female",
    address: "Ahmedabad, Gujarat",
    booth: "ZEAL-01",
  },
  {
    id: "VOT1003",
    name: "Rohan Desai",
    age: 31,
    gender: "Male",
    address: "Mumbai, Maharashtra",
    booth: "ZEAL-02",
  },
  {
    id: "VOT1004",
    name: "Priya Verma",
    age: 27,
    gender: "Female",
    address: "Lucknow, UP",
    booth: "ZEAL-02",
  },
  {
    id: "VOT1005",
    name: "Vikram Singh",
    age: 35,
    gender: "Male",
    address: "Delhi NCR",
    booth: "ZEAL-03",
  },
  {
    id: "VOT1006",
    name: "Simran Kaur",
    age: 24,
    gender: "Female",
    address: "Chandigarh",
    booth: "ZEAL-03",
  },
  {
    id: "VOT1007",
    name: "Akshay Mehta",
    age: 29,
    gender: "Male",
    address: "Bengaluru, Karnataka",
    booth: "ZEAL-04",
  },
  {
    id: "VOT1008",
    name: "Isha Gupta",
    age: 26,
    gender: "Female",
    address: "Indore, MP",
    booth: "ZEAL-04",
  },
  {
    id: "VOT1009",
    name: "Farhan Ali",
    age: 33,
    gender: "Male",
    address: "Hyderabad, Telangana",
    booth: "ZEAL-05",
  },
  {
    id: "VOT1010",
    name: "Nikita Kulkarni",
    age: 21,
    gender: "Female",
    address: "Nagpur, Maharashtra",
    booth: "ZEAL-05",
  },
];
