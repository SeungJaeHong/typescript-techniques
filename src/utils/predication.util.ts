type PredicateFn = (value: any, index?: number) => boolean;

export function or(...predicates: PredicateFn[]): PredicateFn {
  return (value) => predicates.some((predicate) => predicate(value));
}

export function and(...predicates: PredicateFn[]): PredicateFn {
  return (value) => predicates.every((predicate) => predicate(value));
}

export function not(...predicates: PredicateFn[]): PredicateFn {
  return (value) => predicates.every((predicate) => !predicate(value));
}

/**
 * @example
 * 
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

  const isRole = (role: UserRole) => (user: User) => user.role === role;

  const isGreaterThan = (age: number) => (user: User) => user.age > age;

  const isWriter = isRole(UserRole.Writer);

  const greaterThan17AndWriterOrEditor = users.filter(
    and(isGreaterThan(17), or(isWriter, isRole(UserRole.Editor)))
  );

  const greaterThan5AndSubscriberOrWriter = users.filter(
    and(isGreaterThan(5), isWriter)
  );
  
 */
