enum Role {
  SUPERADMIN = "Super Admin",
  ADMIN = "Admin",
  SUBSCRIBER = "Subscriber",
}

class User {
  user_id?: number;
  firstname: string;
  middlename?: string | undefined;
  lastname: string;
  user_email: string;
  user_phone: string;
  user_role: Role;
  user_address: string;
  constructor(user: User) {
    this.user_id = user.user_id;
    this.firstname = user.firstname;
    this.middlename = user.middlename;
    this.lastname = user.lastname;
    this.user_email = user.user_email;
    this.user_phone = user.user_phone;
    this.user_role =
      user.user_role === "Super Admin"
        ? Role.SUPERADMIN
        : user.user_role === "Admin"
        ? Role.ADMIN
        : Role.SUBSCRIBER;
    this.user_address = user.user_address;
  }
}

export { Role, User };
