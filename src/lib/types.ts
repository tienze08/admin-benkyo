export type RequestStatus = 1 | 2 | 3;

export interface FlashcardCard {
  _id: string;
  front: string;
  back: string;
}

export interface FlashcardDeckRequest {
  id: string;
  title: string;
  description: string;
  cardsCount: number;
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: {
    id: string;
    name: string;
  };
  reviewNote?: string;
  cards?: FlashcardCard[];
}
