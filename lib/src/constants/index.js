"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FilterOperator;
(function (FilterOperator) {
    FilterOperator["Eq"] = "eq";
    FilterOperator["Gt"] = "gt";
    FilterOperator["Gte"] = "gte";
    FilterOperator["Lt"] = "lt";
    FilterOperator["Lte"] = "lte";
    FilterOperator["Neq"] = "neq";
    FilterOperator["Like"] = "like";
    FilterOperator["Ilike"] = "ilike";
    FilterOperator["In"] = "in";
    FilterOperator["Is"] = "is";
    FilterOperator["Fts"] = "fts";
    FilterOperator["Plfts"] = "plfts";
    FilterOperator["Phfts"] = "phfts";
    FilterOperator["Cs"] = "cs";
    FilterOperator["Cd"] = "cd";
    // ov	overlap (have points in common), e.g. ?period=ov.[2017-01-01,2017-06-30]	&&
    // sl	strictly left of, e.g. ?range=sl.(1,10)	<<
    // sr	strictly right of	>>
    // nxr	does not extend to the right of, e.g. ?range=nxr.(1,10)	&<
    // nxl	does not extend to the left of	&>
    // adj	is adjacent to, e.g. ?range=adj.(1,10)	-|-
    // not	negates another operator, see below
})(FilterOperator = exports.FilterOperator || (exports.FilterOperator = {}));
var Ordering;
(function (Ordering) {
    Ordering["Asc"] = "asc";
    Ordering["Desc"] = "desc";
})(Ordering = exports.Ordering || (exports.Ordering = {}));
var PostgrestAction;
(function (PostgrestAction) {
    PostgrestAction["Get"] = "get";
    PostgrestAction["Post"] = "post";
    PostgrestAction["Put"] = "put";
    PostgrestAction["Patch"] = "patch";
    PostgrestAction["Delete"] = "delete";
})(PostgrestAction = exports.PostgrestAction || (exports.PostgrestAction = {}));
//# sourceMappingURL=index.js.map