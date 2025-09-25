export interface PropertyDto {
  idProperty: number;
  idOwner: number;
  name: string;
  address: string;
  price: number;
  image?: string;
  ownerName?: string;
  codeInternal: string;
  year: number;
}

export interface OwnerDto {
  idOwner: number;
  name: string;
  address: string;
  photo?: string;
  birthday: string;
}

export interface PropertyImageDto {
  idPropertyImage: number;
  idProperty: number;
  file: string;
  enabled: boolean;
}

export interface PropertyTraceDto {
  idPropertyTrace: number;
  dateSale: string;
  name: string;
  value: number;
  tax: number;
  idProperty: number;
}

export interface PropertyDetailDto extends PropertyDto {
  owner?: OwnerDto;
  images?: PropertyImageDto[];
  traces?: PropertyTraceDto[];
}

export interface PropertyFilterDto {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export interface PropertyListResponseDto {
  properties: PropertyDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}