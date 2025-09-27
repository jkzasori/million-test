export interface PropertyOwner {
  readonly idOwner: number;
  readonly name: string;
  readonly address: string;
  readonly photo?: string;
  readonly birthday?: string;
}

export interface PropertyImage {
  readonly idPropertyImage: number;
  readonly idProperty: number;
  readonly file: string;
  readonly enabled: boolean;
}

export interface PropertyTrace {
  readonly idPropertyTrace: number;
  readonly idProperty: number;
  readonly dateSale: string;
  readonly name: string;
  readonly value: number;
  readonly tax: number;
}

export interface Property {
  readonly idProperty: number;
  readonly name: string;
  readonly address: string;
  readonly price: number;
  readonly codeInternal: string;
  readonly year: number;
  readonly owner?: PropertyOwner;
  readonly images?: PropertyImage[];
  readonly traces?: PropertyTrace[];
}

export interface PropertyListItem {
  readonly idProperty: number;
  readonly name: string;
  readonly address: string;
  readonly price: number;
  readonly codeInternal: string;
  readonly year: number;
  readonly ownerName?: string;
  readonly mainImageUrl?: string;
}

export interface PropertyFilters {
  readonly name?: string;
  readonly address?: string;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly year?: number;
}

export interface PaginatedPropertyResult {
  readonly properties: PropertyListItem[];
  readonly totalCount: number;
  readonly page: number;
  readonly size: number;
  readonly totalPages: number;
}