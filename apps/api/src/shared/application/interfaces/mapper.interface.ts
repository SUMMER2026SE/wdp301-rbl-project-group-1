export interface IMapper<TDomain, TPersist, TDto = unknown> {
  toDomain(raw: TPersist): TDomain;
  toPersistence(domain: TDomain): TPersist;
  toDto?(domain: TDomain): TDto;
}
