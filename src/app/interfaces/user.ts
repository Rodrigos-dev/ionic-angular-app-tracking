export interface User {
    name?: string;
    email?: string;
    cpf?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    newPassword?: string;
    newConfirmPassword?: string;
    street?: string;
    // eslint-disable-next-line id-blacklist
    number?: string;
    neighborhood?: string;
    complement?: string;
    postalcode?: string;
    city?: string;
    state?: string;
    type?: string;
    status?: string;
    companyDocument?: string;
}
