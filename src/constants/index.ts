export enum FilterOperator {
  Eq = 'eq',
  Gt = 'gt',
  Gte = 'gte',
  Lt = 'lt',
  Lte = 'lte',
  Neq = 'neq',
  Like = 'like', // TODO convert % to * if used unescaped
  Ilike = 'ilike', // TODO convert % to * if used unescaped
  In = 'in', // TODO special handling... values should be in in.(1,2,3)
  Is = 'is',
  Fts = 'fts',
  Plfts = 'plfts',
  Phfts = 'phfts',
  Cs = 'cs', // cs.{example, new}
  Cd = 'cd', // cd.{1,2,3}
  // ov	overlap (have points in common), e.g. ?period=ov.[2017-01-01,2017-06-30]	&&
  // sl	strictly left of, e.g. ?range=sl.(1,10)	<<
  // sr	strictly right of	>>
  // nxr	does not extend to the right of, e.g. ?range=nxr.(1,10)	&<
  // nxl	does not extend to the left of	&>
  // adj	is adjacent to, e.g. ?range=adj.(1,10)	-|-
  // not	negates another operator, see below
}

export enum Ordering {
  Asc = 'asc',
  Desc = 'desc',
}

export enum PostgrestAction {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Patch = 'patch',
  Delete = 'delete',
}
