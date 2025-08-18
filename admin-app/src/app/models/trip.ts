export interface Trip {
  _id?: string;
  code: string;
  name: string;
  length: string;
  start: Date | string;
  resort: string;
  perPerson: string;
  image: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TripModel implements Trip {
  _id?: string;
  code: string;
  name: string;
  length: string;
  start: Date | string;
  resort: string;
  perPerson: string;
  image: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(trip?: Partial<Trip>) {
    this._id = trip?._id;
    this.code = trip?.code || '';
    this.name = trip?.name || '';
    this.length = trip?.length || '';
    this.start = trip?.start || new Date();
    this.resort = trip?.resort || '';
    this.perPerson = trip?.perPerson || '';
    this.image = trip?.image || '';
    this.description = trip?.description || '';
    this.createdAt = trip?.createdAt;
    this.updatedAt = trip?.updatedAt;
  }

  // Helper method to format start date
  getFormattedStartDate(): string {
    const date = new Date(this.start);
    return date.toLocaleDateString();
  }

  // Helper method to format price
  getFormattedPrice(): string {
    return `$${this.perPerson}`;
  }
}