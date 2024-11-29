export interface  Announcement {
  _id: string;
  title: string;
  content: string;
  author_id: string;
  target_audience: string[];
  priority: 'low' | 'medium' | 'high';
  category: string;
  location: string;
  publish_date: string;
  announcement_date: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  name: string; // Name of the attachment
  url: string; // URL of the attachment
  type?: string; // Optional type of the attachment
}
