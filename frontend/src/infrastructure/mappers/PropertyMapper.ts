import { 
  Property, 
  PropertyListItem, 
  PropertyOwner, 
  PropertyImage, 
  PropertyTrace,
  PaginatedPropertyResult 
} from '../../domain/entities/Property';
import { 
  PropertyDto, 
  PropertyDetailDto, 
  OwnerDto, 
  PropertyImageDto, 
  PropertyTraceDto,
  PropertyListResponseDto 
} from '../../types/property';

export class PropertyMapper {
  static toDomain(dto: PropertyDetailDto): Property {
    return {
      idProperty: dto.idProperty,
      idOwner: dto.idOwner,
      name: dto.name,
      address: dto.address,
      price: dto.price,
      codeInternal: dto.codeInternal,
      year: dto.year,
      owner: dto.owner ? this.ownerToDomain(dto.owner) : undefined,
      images: dto.images ? dto.images.map(this.imageToDomain) : undefined,
      traces: dto.traces ? dto.traces.map(this.traceToDomain) : undefined,
    };
  }

  static listItemToDomain(dto: PropertyDto): PropertyListItem {
    return {
      idProperty: dto.idProperty,
      idOwner: dto.idOwner,
      name: dto.name,
      address: dto.address,
      price: dto.price,
      codeInternal: dto.codeInternal,
      year: dto.year,
      ownerName: dto.ownerName,
      mainImageUrl: dto.image,
    };
  }

  static paginatedResultToDomain(dto: PropertyListResponseDto): PaginatedPropertyResult {
    return {
      properties: dto.properties.map(this.listItemToDomain),
      totalCount: dto.totalCount,
      page: dto.page,
      size: dto.pageSize,
      totalPages: dto.totalPages,
    };
  }

  private static ownerToDomain(dto: OwnerDto): PropertyOwner {
    return {
      idOwner: dto.idOwner,
      name: dto.name,
      address: dto.address,
      photo: dto.photo,
      birthday: dto.birthday,
    };
  }

  private static imageToDomain(dto: PropertyImageDto): PropertyImage {
    return {
      idPropertyImage: dto.idPropertyImage,
      idProperty: dto.idProperty,
      file: dto.file,
      enabled: dto.enabled,
    };
  }

  private static traceToDomain(dto: PropertyTraceDto): PropertyTrace {
    return {
      idPropertyTrace: dto.idPropertyTrace,
      idProperty: dto.idProperty,
      dateSale: dto.dateSale,
      name: dto.name,
      value: dto.value,
      tax: dto.tax,
    };
  }
}