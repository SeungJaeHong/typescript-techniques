# includes와 selector 함수를 통한 더 나은 데이터 검증

## Case: 유저의 상태에 따라 권한 여부를 확인하는 경우

```ts
enum UserStatus {
  Administrator = "ADMINISTRATOR",
  Author = "AUTHOR",
  Contributor = "CONTRIBUTOR",
  Editor = "EDITOR",
  Subscriber = "SUBSCRIBER",
}

interface User {
  firstName: string;
  lastName: string;
  status: UserStatus;
}

function isEditActionAvailable(user: User): boolean {
  return (
    user.status === UserStatus.Administrator ||
    user.status === UserStatus.Author ||
    user.status === UserStatus.Editor
  );
}
```

isEditActionAvailable 함수는 유저가 Administrator, Author, Editor 중 하나일 때 true를 반환한다.

## 리팩토링 1

```ts
/**
 * 함수 내부에 있던 하드코딩 데이터를 밖으로 분리
 */
const EDIT_ROLES = [
  UserStatus.Administrator,
  UserStatus.Author,
  UserStatus.Editor,
];

function isEditActionAvailable(user: User): boolean {
  return EDIT_ROLES.includes(user.status);
}
```

## 리팩토링 2

```ts
/**
 * @param {Function} selector 데이터에서 특정 필드를 선택하는 함수
 * @param {Array} roles 권한 목록
 * @returns {Function} 권한 여부를 판단하는 함수
 */
function roleCheck<D, T>(
  selector: (data: D) => T,
  roles: T[]
): (value: D) => boolean {
  return (value: D) => roles.includes(selector(value));
}

const isEditActionAvailable = roleCheck(
  (user: User) => user.status,
  EDIT_ROLES
);
```

## 예제 1

```ts
/**
 * 다른 권한 확인이 필요한 경우,
 * roleCheck 함수를 이용한 재활용이 가능하다.
 */
const ADD_ROLES = [UserStatus.Administrator, UserStatus.Author];
const isAddActionAvailable = roleCheck((user: User) => user.status, ADD_ROLES);
```

## 예제 2

```ts
enum TeamStatus {
  Lead = "LEAD",
  Manager = "MANAGER",
  Developer = "DEVELOPER",
}

interface User {
  firstName: string;
  lastName: string;
  status: UserStatus;
  teamStatus: TeamStatus;
}

const MANAGER_OR_LEAD = [TeamStatus.Lead, TeamStatus.Manager];
/**
 * selector 함수로 user가 가진 어느 필드던 권한 확인이 가능하다.
 */
const isManagerOrLead = roleCheck(
  (user: User) => user.teamStatus,
  MANAGER_OR_LEAD
);
```
