export const jwtConstants = {
  SECRET: process.env.JWT_ACCESS_SECRET,
};


export enum Roles  {
    ROLE_ADMIN="ADMIN",
    ROLE_USER="USER", 
}