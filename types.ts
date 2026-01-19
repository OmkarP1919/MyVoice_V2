
export type UserRole = 'CITIZEN' | 'AUTHORITY' | 'WORKER';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  points: number;
  avatar: string;
}

export type IssueStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: IssueStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  image?: string;
  reportedBy: string;
  reportedAt: string;
  assignedTo?: string; // Operator/Worker ID
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  department: string;
  upvotes: number;
  comments: Comment[];
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  image: string;
}
