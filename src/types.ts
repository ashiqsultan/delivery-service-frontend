import { Point } from 'geojson';

export interface AppRes {
  data: any;
  isError: boolean;
  errMsg?: string;
}

export enum ShipmentStatus {
  requested = 'requested',
  deliveryAssociateAssigned = 'deliveryAssociateAssigned',
  pickupLocationReached = 'pickupLocationReached',
  transporting = 'transporting',
  dropLocationReached = 'dropLocationReached',
  delivered = 'delivered',
  cancelled = 'cancelled',
}
export interface IShipment {
  _id: string;
  pickupLocation: Point;
  dropLocation: Point;
  userId: string;
  status: ShipmentStatus;
  deliveryAssociateId?: string;
}
export interface ShipmentRes extends AppRes {
  data: IShipment;
}

export interface IUser {
  _id: string;
  email: string;
  name: string;
  organization: string;
  roles: Array<string>;
}

export interface UserRes extends AppRes {
  data: IUser;
}

export interface TokenRes extends AppRes {
  data: { token: string };
}
