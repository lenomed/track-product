export interface ProductDto {
  id: string;
  name: string;
  description: string;
  senderName: string;
  receiverName: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  status: string;
  trackingId: string;
}

export interface TrackingStatus {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}
