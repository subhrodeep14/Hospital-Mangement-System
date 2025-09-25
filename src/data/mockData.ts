import { Equipment, Hospital } from '../types';
import { Purchase, Ticket } from '../types';

export const hospitalInfo: Hospital = {
  name: 'Neotia Getwel Multispecialty Hospital',
  address: '47/1A, Mahatma Gandhi Road, Siliguri, West Bengal 734001',
  phone: '+91-353-2545555',
  email: 'info@neotiahospital.com',
  website: 'www.neotiahospital.com',
  totalEquipments: 0,
  totalValue: 0,
  departments: [
    'Cardiology',
    'Emergency Medicine',
    'Intensive Care Unit',
    'Operating Theater',
    'Radiology',
    'Laboratory',
    'Pharmacy',
    'Physiotherapy',
    'Dialysis Unit',
    'Blood Bank'
  ]
};

export const mockEquipments: Equipment[] = [
  {
    id: '1',
    name: 'MRI Scanner',
    category: 'Imaging Equipment',
    serialNumber: 'MRI-001-2023',
    manufacturer: 'Siemens',
    model: 'MAGNETOM Vida',
    purchaseDate: '2023-01-15',
    warrantyExpiry: '2028-01-15',
    location: 'Radiology Department',
    status: 'Active',
    lastMaintenance: '2024-11-01',
    nextMaintenance: '2025-05-01',
    cost: 15000000
  },
  {
    id: '2',
    name: 'Ventilator',
    category: 'Life Support',
    serialNumber: 'VENT-002-2023',
    manufacturer: 'Medtronic',
    model: 'Puritan Bennett 980',
    purchaseDate: '2023-03-10',
    warrantyExpiry: '2028-03-10',
    location: 'ICU Ward A',
    status: 'Active',
    lastMaintenance: '2024-10-15',
    nextMaintenance: '2025-04-15',
    cost: 800000
  },
  {
    id: '3',
    name: 'CT Scanner',
    category: 'Imaging Equipment',
    serialNumber: 'CT-003-2022',
    manufacturer: 'GE Healthcare',
    model: 'Revolution CT',
    purchaseDate: '2022-08-20',
    warrantyExpiry: '2027-08-20',
    location: 'Radiology Department',
    status: 'Maintenance',
    lastMaintenance: '2024-12-01',
    nextMaintenance: '2025-06-01',
    cost: 12000000
  },
  {
    id: '4',
    name: 'Defibrillator',
    category: 'Emergency Equipment',
    serialNumber: 'DEF-004-2023',
    manufacturer: 'Philips',
    model: 'HeartStart MRx',
    purchaseDate: '2023-05-12',
    warrantyExpiry: '2028-05-12',
    location: 'Emergency Department',
    status: 'Active',
    lastMaintenance: '2024-11-20',
    nextMaintenance: '2025-05-20',
    cost: 350000
  },
  {
    id: '5',
    name: 'Ultrasound Machine',
    category: 'Imaging Equipment',
    serialNumber: 'US-005-2023',
    manufacturer: 'Samsung Medison',
    model: 'RS85A',
    purchaseDate: '2023-07-08',
    warrantyExpiry: '2028-07-08',
    location: 'OB/GYN Department',
    status: 'Active',
    lastMaintenance: '2024-10-30',
    nextMaintenance: '2025-04-30',
    cost: 1200000
  }
];

export const mockPurchases: Purchase[] = [
  {
    id: '1',
    equipmentId: '1',
    equipmentName: 'MRI Scanner',
    quantity: 1,
    unitPrice: 15000000,
    totalAmount: 15000000,
    purchaseDate: '2023-01-15',
    vendorName: 'Siemens Healthcare Pvt Ltd',
    vendorContact: '+91-11-4567-8900',
    billNumber: 'SH-2023-001',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Paid',
    notes: 'Installation and training included'
  },
  {
    id: '2',
    equipmentId: '2',
    equipmentName: 'Ventilator',
    quantity: 2,
    unitPrice: 800000,
    totalAmount: 1600000,
    purchaseDate: '2023-03-10',
    vendorName: 'Medtronic India Pvt Ltd',
    vendorContact: '+91-80-2345-6789',
    billNumber: 'MD-2023-002',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Paid',
    notes: '2-year warranty included'
  },
  {
    id: '3',
    equipmentId: '4',
    equipmentName: 'Defibrillator',
    quantity: 3,
    unitPrice: 350000,
    totalAmount: 1050000,
    purchaseDate: '2023-05-12',
    vendorName: 'Philips Healthcare',
    vendorContact: '+91-22-6789-0123',
    billNumber: 'PH-2023-003',
    paymentMethod: 'Cheque',
    paymentStatus: 'Paid',
    notes: 'Emergency department deployment'
  },
  {
    id: '4',
    equipmentId: '5',
    equipmentName: 'Ultrasound Machine',
    quantity: 1,
    unitPrice: 1200000,
    totalAmount: 1200000,
    purchaseDate: '2023-07-08',
    vendorName: 'Samsung Medison India',
    vendorContact: '+91-124-456-7890',
    billNumber: 'SM-2023-004',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Paid',
    notes: 'OB/GYN department upgrade'
  }
];

export const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'MRI Scanner Software Update Required',
    description: 'The MRI scanner in Radiology Department needs a software update to fix calibration issues. Patients are experiencing longer scan times.',
    category: 'Technical Issue',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Dr. Priya Sharma',
    createdBy: 'Technician Raj Kumar',
    createdAt: '2024-12-15T09:30:00Z',
    updatedAt: '2024-12-15T14:20:00Z',
    department: 'Radiology Department',
    equipmentId: '1',
    comments: [
      {
        id: '1',
        ticketId: '1',
        author: 'Dr. Priya Sharma',
        content: 'I have contacted Siemens support. They will send a technician tomorrow.',
        createdAt: '2024-12-15T14:20:00Z',
        isInternal: false
      }
    ]
  },
  {
    id: '2',
    title: 'Access Request for New Nurse',
    description: 'New nurse Anjali Patel needs access to the patient management system and equipment booking portal.',
    category: 'Access Request',
    priority: 'Medium',
    status: 'Open',
    createdBy: 'HR Manager Suresh Gupta',
    createdAt: '2024-12-14T11:15:00Z',
    updatedAt: '2024-12-14T11:15:00Z',
    department: 'Human Resources',
    comments: []
  },
  {
    id: '3',
    title: 'Ventilator Alarm System Malfunction',
    description: 'Ventilator in ICU Ward A has intermittent alarm failures. This is a critical safety issue that needs immediate attention.',
    category: 'Equipment Issue',
    priority: 'Critical',
    status: 'Open',
    createdBy: 'Nurse Meera Singh',
    createdAt: '2024-12-15T16:45:00Z',
    updatedAt: '2024-12-15T16:45:00Z',
    department: 'Intensive Care Unit',
    equipmentId: '2',
    comments: []
  },
  {
    id: '4',
    title: 'Request for New Inventory Management Features',
    description: 'Need to add barcode scanning functionality to the inventory system for faster equipment tracking.',
    category: 'Software Request',
    priority: 'Low',
    status: 'Pending',
    assignedTo: 'IT Team Lead',
    createdBy: 'Inventory Manager Rohit Das',
    createdAt: '2024-12-13T10:00:00Z',
    updatedAt: '2024-12-14T09:30:00Z',
    department: 'Administration',
    comments: [
      {
        id: '2',
        ticketId: '4',
        author: 'IT Team Lead',
        content: 'We are evaluating different barcode scanning solutions. Will provide an update by end of week.',
        createdAt: '2024-12-14T09:30:00Z',
        isInternal: true
      }
    ]
  },
  {
    id: '5',
    title: 'CT Scanner Calibration Complete',
    description: 'Annual calibration of CT Scanner has been completed successfully. All tests passed.',
    category: 'Equipment Issue',
    priority: 'Medium',
    status: 'Resolved',
    assignedTo: 'Biomedical Engineer',
    createdBy: 'Radiology Technician',
    createdAt: '2024-12-10T08:00:00Z',
    updatedAt: '2024-12-12T17:30:00Z',
    resolvedAt: '2024-12-12T17:30:00Z',
    department: 'Radiology Department',
    equipmentId: '3',
    comments: [
      {
        id: '3',
        ticketId: '5',
        author: 'Biomedical Engineer',
        content: 'Calibration completed successfully. Equipment is ready for use.',
        createdAt: '2024-12-12T17:30:00Z',
        isInternal: false
      }
    ]
  }
];