export interface Symposium {
  id: number;
  code: string;
  title: string;
  description: string;
  category: 'Science' | 'Industry' | 'Technology' | 'Digital & AI';
  icon: string;
  topics: string[];
}

export interface Speaker {
  id: string;
  name: string;
  designation: string;
  organization: string;
  role: string;
  category: 'Keynote' | 'Plenary' | 'Invited' | 'Committee' | 'Technical';
  bio?: string;
  initials: string;
  color: string;
  symposium?: string;
}

export interface RegistrationTier {
  id: string;
  name: string;
  basePrice: number;
  gstRate: number;
  gstAmount: number;
  totalPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface SponsorshipPackage {
  id: string;
  tier: 'Diamond' | 'Gold' | 'Silver' | 'Bronze' | 'Tea/Coffee';
  priceINR: number;
  priceFormatted: string;
  color: string;
  bgGradient: string;
  delegates: number;
  features: string[];
  popular?: boolean;
}

export interface AdvertisementRate {
  type: string;
  category: string;
  rateINR: number;
  rateFormatted: string;
  dimensions: string;
}

export interface PaperSubmission {
  id: string;
  paperCode?: string;
  submissionDate: string;
  submittedAt?: string;
  status: 'Submitted' | 'Under Review' | 'Accepted' | 'Accepted for Oral Presentation' | 'Accepted for Poster Presentation' | 'Revision Required' | 'Rejected' | string;
  fullName: string;
  nationality?: string;
  gender?: string;
  designation?: string;
  companyName: string;
  organization?: string;
  education?: string;
  specialization?: string;
  achievements?: string;
  professionalMemberships?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  phoneNumber?: string;
  mobileNumber: string;
  email: string;
  presentationType: 'Oral' | 'Poster';
  symposiumId: number;
  symposiumTitle: string;
  paperTitle: string;
  abstract: string;
  keywords?: string;
  coAuthors?: string;
  resumeFileName?: string;
  fullPaperFileName?: string;
  presentationFileName?: string;
  reviewScore?: number;
  reviewComments?: string;
  declarationAgreed?: boolean;
}

export interface DelegateRegistration {
  id: string;
  registrationDate: string;
  status: 'Pending Payment' | 'Confirmed' | 'Confirmed & Paid' | 'Provisional (Unpaid)' | 'Attended' | string;
  ticketId: string;
  fullName: string;
  gender: string;
  designation: string;
  organization: string;
  department?: string;
  email: string;
  mobileNumber: string;
  country: string;
  state: string;
  city: string;
  address: string;
  category: string;
  membershipNumber?: string;
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  paymentMethod: 'Bank Transfer / NEFT' | 'UPI / QR' | 'Credit / Debit Card (Online)' | 'Pay Later / Pending Verification' | string;
  transactionReference?: string;
  transactionRef?: string;
  qrCodeUrl?: string;
}

export interface ExhibitorBooth {
  id: string;
  boothNumber: string;
  size: string;
  priceINR: number;
  status: 'Available' | 'Reserved' | 'Booked';
  dimensions: string;
  companyName?: string;
}

export interface AwardCategory {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  deadline: string;
}
