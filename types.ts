import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  role: 'admin' | 'user';
  email: string;
  fullName: string;
  phone?: string;
  avatar_url?: string;
  
  // Demographic Data
  locationType: 'center' | 'village' | 'abroad'; // Merkez, Köy, Yurt Dışı
  locationDetail: string; // Cumhuriyet Mah. / Ahat Köyü / Almanya-Berlin

  // Optional Demographics
  age?: number;
  gender?: 'male' | 'female' | 'other'; // Erkek, Kadın, Belirtmek İstemiyorum
  education?: 'primary' | 'middle' | 'high' | 'university' | 'master'; // İlkokul, Orta, Lise, Üniversite, Yüksek Lisans
}

export interface Notification {
  id: string;
  target_user_id: string; // Specific UID, or 'all', 'group:center', 'group:village', etc.
  title: string;
  message: string;
  date: Timestamp | Date;
  is_read: boolean;
  type: 'info' | 'alert' | 'system';
}

export interface Content {
  id: string;
  type: 'news' | 'death_notice' | 'nostalgia';
  title: string;
  body: string;
  date: Timestamp | Date;
  image_url?: string;
  source_link?: string; // Added source link
}

export interface Ad {
  id: string;
  type: 'banner' | 'popup'; 
  advertiser_name: string;
  image_url: string;
  target_link: string;
  views: number;
  clicks: number;
  is_active: boolean;
  start_date: Timestamp | Date;
  end_date: Timestamp | Date;
  
  // Admin/Billing fields
  durationDays?: number;
  cost?: number;
}

export interface Place {
  id: string;
  category: 'pharmacy' | 'taxi' | 'craftsman' | 'food' | 'sightseeing' | 'service' | 'health' | 'all_tradesmen' | 'transport';
  name: string;
  phone?: string;
  is_on_duty?: boolean; // Pharmacy only
  address?: string;
  description?: string; // For Services/Sightseeing
  image_url?: string;   // For Sightseeing/Food
  sub_category?: string; // e.g. "Plumber" under Craftsman
  
  // New fields for Hierarchical Tradesmen Listing
  tier?: 'premium' | 'gold' | 'standard';
  logo_url?: string;
}

export interface BusSchedule {
  id: string;
  route_name: string; // e.g. "Banaz > Uşak"
  day_type: 'weekday' | 'weekend'; // Hafta İçi / Hafta Sonu
  times: string[]; // ["07:00", "07:30", ...]
}

export interface DutySchedule {
  date: string; // YYYY-MM-DD
  pharmacyId: string;
}

export interface ClassifiedDetails {
  // Real Estate
  room_count?: string; // 3+1
  size_m2?: number;
  heating?: string;
  floor?: number;
  
  // Vehicle
  brand?: string;
  model?: string;
  year?: number;
  km?: number;
  fuel?: string;
  
  // General
  condition?: 'new' | 'used';
}

export interface Classified {
  id: string;
  user_id: string;
  title: string;
  price: number;
  category: 'real_estate' | 'vehicle' | 'market' | 'spot' | 'livestock'; // Emlak, Vasıta, Market, Spot, Hayvan Pazarı
  sub_category?: string; // Kiralık Daire, Otomobil, Telefon vb.
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  image_url: string;
  created_at: Timestamp | Date;
  
  // Contact Info
  contact_name?: string;
  contact_phone?: string;
  
  // Dynamic Details based on category
  details?: ClassifiedDetails;
  location?: string;

  // Featured / Pinned Logic
  is_featured_request?: boolean; // User requested pin
  featured_status?: 'none' | 'pending' | 'active' | 'expired';
  featured_until?: Timestamp | Date; // Expiry date for pin
  featured_duration_days?: number; // How long user requested
}

export interface StoryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration?: number; // seconds, default 5
  caption?: string;
  date: Date;
}

export interface StoryGroup {
  id: string;
  name: string;
  avatar_url: string;
  items: StoryItem[];
  is_seen: boolean;
}

export interface PWAInstallPrompt extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface Condolence {
  id: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: Timestamp | Date;
}

export interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  text: string;
  created_at: Timestamp | Date;
}

export interface ListingRequest {
  id: string;
  businessName: string;
  category: string;
  phone: string;
  description: string;
  status: 'pending' | 'reviewed';
  date: Date;
}

export interface PrayerTimes {
  Fajr: string;    // İmsak
  Sunrise: string; // Güneş
  Dhuhr: string;   // Öğle
  Asr: string;     // İkindi
  Sunset: string;  // Akşam (Maghrib ile aynı genellikle ama UI için Sunset/Maghrib ayrımı olabilir)
  Maghrib: string; // Akşam
  Isha: string;    // Yatsı
}

export interface PublicPoll {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  text: string;
  agree_count: number;
  disagree_count: number;
  created_at: Timestamp | Date;
  // Track who voted what: { 'uid1': 'agree', 'uid2': 'disagree' }
  voted_users: Record<string, 'agree' | 'disagree'>;
}

export interface PublicEvent {
  id: string;
  user_id: string;
  user_name: string;
  type: 'wedding' | 'engagement' | 'circumcision' | 'religious' | 'other'; // Düğün, Nişan, Sünnet, Mevlüt, Diğer
  title: string; // e.g. "Oğlumuz Ahmet'in Sünnet Düğünü"
  description: string; // e.g. "Tüm dostlarımız davetlidir."
  event_date: string; // YYYY-MM-DD
  event_time: string; // HH:MM
  location: string;
  image_url?: string;
  
  created_at: Timestamp | Date;
  
  // RSVP Logic
  attending_count: number;
  not_attending_count: number;
  rsvp_status: Record<string, 'attending' | 'not_attending'>;
}

// --- OFFICIAL ADMIN POLLS ---
export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

export interface AdminPoll {
  id: string;
  question: string;
  options: PollOption[];
  endDate: Date;
  isActive: boolean;
  totalVotes: number;
  votedUserIds: string[]; // To ensure 1 vote per user
}

export interface PollRequest {
  id: string;
  userId: string;
  userName: string;
  suggestion: string;
  status: 'pending' | 'reviewed';
  date: Date;
}