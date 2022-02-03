# Use callbacks to encapsulate code that changes

createUser 함수와 updateUser함수는 `httpClient[create/update](user)`
부분을 제외하고는 동일한 로직으로 구현되어 있다. 중복을 제거해보자

```ts
async function createUser(user: User): Promise<void> {
  LoadingService.startLoading();
  await userHttpClient.createUser(user);
  LoadingService.stopLoading();
  UserGrid.reloadData();
}

async function updateUser(user: User): Promise<void> {
  LoadingService.startLoading();
  await userHttpClient.updateUser(user);
  LoadingService.stopLoading();
  UserGrid.reloadData();
}
```

```ts
/**
 * Extract a common function from createUser and updateUser
 */
async function makeUserAction(userAction: Function): Promise<void> {
  LoadingService.startLoading();
  await userAction();
  LoadingService.stopLoading();
  UserGrid.reloadData();
}

async function createUser(user: User): Promise<void> {
  makeUserAction(() => userHttpClient.createUser(user));
}

async function updateUser(user: User): Promise<void> {
  makeUserAction(() => userHttpClient.updateUser(user));
}
```
