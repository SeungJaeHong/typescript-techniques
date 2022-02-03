# Consider using predicate combinators

여러 함수들을 조합해서 사용하는 경우, 함수의 이름과 로직이 중복되는 경우가 있다.
조건 1 && 조건 2,
조건 3 && 조건 2 || 조건4 등등

```ts
enum UserRole {
  Administrator = "ADMINISTRATOR",
  Editor = "EDITOR",
  Subscriber = "SUBSCRIBER",
  Writer = "WRITER",
}

interface User {
  username: string;
  age: number;
  role: UserRole;
}

const users = [
  { username: "John", age: 25, role: UserRole.Administrator },
  { username: "Jane", age: 7, role: UserRole.Subscriber },
  { username: "Liza", age: 18, role: UserRole.Writer },
  { username: "Jim", age: 16, role: UserRole.Editor },
  { username: "Bill", age: 32, role: UserRole.Editor },
];

const greaterThan17AndWriterOrEditor = users.filter((user: User) => {
  return (
    user.age > 17 &&
    (user.role === UserRole.Writer || user.role === UserRole.Editor)
  );
});

const greaterThan5AndSubscriberOrWriter = users.filter((user: User) => {
  return user.age > 5 && user.role === UserRole.Writer;
});
```

가독성과 재사용성을 높여보자.

```ts
type PredicateFn = (value: any, index?: number) => boolean;

function or(...predicates: PredicateFn[]): PredicateFn {
  return (value) => predicates.some((predicate) => predicate(value));
}

function and(...predicates: PredicateFn[]): PredicateFn {
  return (value) => predicates.every((predicate) => predicate(value));
}

function not(...predicates: PredicateFn[]): PredicateFn {
  return (value) => predicates.every((predicate) => !predicate(value));
}
```

사용 예

```ts
const isWriter = (user: User) => user.role === UserRole.Writer;
const isEditor = (user: User) => user.role === UserRole.Editor;
const isGreaterThan17 = (user: User) => user.age > 17;
const isGreaterThan5 = (user: User) => user.age > 5;

const greaterThan17AndWriterOrEditor = users.filter(
  and(isGreaterThan17, or(isWriter, isEditor))
);

const greaterThan5AndSubscriberOrWriter = users.filter(
  and(isGreaterThan5, isWriter)
);
```

가독성과 재사용성이 늘긴 했지만, 여전히 변수를 너무 많이 선언하고 있고,
팩토리 함수를 이용해서 조금 더 바꿔보자.

```ts
const isRole = (role: UserRole) => (user: User) => user.role === role;

const isGreaterThan = (age: number) => (user: User) => user.age > age;

const greaterThan17AndWriterOrEditor = users.filter(
  and(isGreaterThan(17), or(isRole(UserRole.Writer), isRole(UserRole.Editor)))
);

const greaterThan5AndSubscriberOrWriter = users.filter(
  and(isGreaterThan(5), isRole(UserRole.Writer))
);
```

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
