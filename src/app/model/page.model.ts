/**
 * 
 */
// export class Page {
//     size: number = 0;
//     totalElements: number = 0;
//     totalPages: number = 0;
//     pageNumber: number = 0;
//     content: []
//     body: any
//     type: any
//     clone: any
//     headers: any
// }

export class Page {

    content: []
    empty: false
    first: false
    last: false
    number: 0
    numberOfElements: 0
    pageable: { sort: {}, offset: 0, pageSize: 50, pageNumber: 0, paged: true, unpaged: false }
    size: 50
    sort: { sorted: true, unsorted: false, empty: false }
    totalElements: 0
    totalPages: 0
}


// content: (9) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// empty: false
// first: false
// last: true
// number: 17
// numberOfElements: 9
// pageable: {sort: {…}, offset: 850, pageSize: 50, pageNumber: 17, unpaged: false, …}
// size: 50
// sort: {sorted: true, unsorted: false, empty: false}
// totalElements: 859
// totalPages: 18
// [[Prototype]]: Object