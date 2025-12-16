export interface User {
  age: string;
  gender: any;
  _id: string;
  firstName?: string;
  lastName?: string;
  emailId: string;
  photoUrl?: string;
  about?: string;
  skills?: string[];
}

export interface ConnectionRequest {
  _id: string;
  fromUserId: User;
  toUserId: User;
  status: "interested" | "accepted" | "rejected";
}
