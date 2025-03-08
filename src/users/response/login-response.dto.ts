export class LoginResponseDto {
    access_token: string;
    user: {
        id: string;
        nombre: string;
        email: string;
    };
}