리팩토링은 끝났으나, isRole(UserRole.Writer) 부분이 공통으로 사용되므로 변수로 선언해서
사용하는 것도 고려할 수 있다.

```ts
const isRole = (role: UserRole) => (user: User) => user.role === role;

const isGreaterThan = (age: number) => (user: User) => user.age > age;

const isWriter = isRole(UserRole.Writer);

const greaterThan17AndWriterOrEditor = users.filter(
  and(isGreaterThan(17), or(isWriter, isRole(UserRole.Editor)))
);

const greaterThan5AndSubscriberOrWriter = users.filter(
  and(isGreaterThan(5), isWriter)
);
```
