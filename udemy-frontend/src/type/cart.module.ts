export interface ICartResponse{
    id : string;
    price : number;
    total : number;
    courses : ICartCourseResponse[];
}
export interface ICartCourseResponse{
    id : string;
    name : string;
    imagePath : string;
    price : number;
    priceTemp? : number;
    star : number;
    hour : number;
    code? : string;
}