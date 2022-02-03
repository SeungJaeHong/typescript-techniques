# Encapsulate algorithm in the new class

```ts
class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public signUpDate: Date
  ) {}

  getFormattedUserDetails(): string {
    const formattedSignUpDate = `${this.signUpDate.getFullYear()}-${
      this.signUpDate.getMonth() + 1
    }-${this.signUpDate.getDate()}`;
    const username = `${this.firstName.charAt(0)}${
      this.lastName
    }`.toLowerCase();

    return `
        First name: ${this.firstName},
        Last name: ${this.lastName},
        Sign up date: ${formattedSignUpDate},
        Username: ${username}
    `;
  }
}

const user = new User("John", "Doe", new Date());
console.log(user.getFormattedUserDetails());
```

User 클래스는 기능상 문제는 없다.
하지만 getFormattedUserDetails 함수 하나가 너무 많은 기능을 하고 있다.
관심사를 좀 더 분리해보자

```ts
interface User {
  firstName: string;
  lastName: string;
  signUpDate: Date;
}

class UserDetailsFormatter {
  constructor(private user: User) {}

  format(): string {
    const { firstName, lastName } = this.user;

    return `
        First name: ${firstName},
        Last name: ${lastName},
        Sign up date: ${this.getFormattedSignUpDate()},
        Username: ${this.getUsername()}
    `;
  }

  private getUsername(): string {
    const { firstName, lastName } = this.user;

    return `${firstName.charAt(0)}${lastName}`.toLowerCase();
  }

  private getFormattedSignUpDate(): string {
    const signUpDate = this.user.signUpDate;

    return [
      signUpDate.getFullYear(),
      signUpDate.getMonth() + 1,
      signUpDate.getDate(),
    ].join("-");
  }
}

const user = { firstName: "John", lastName: "Doe", signUpDate: new Date() };
const userFormatter = new UserDetailsFormatter(user);
console.log(userFormatter.format());
```
