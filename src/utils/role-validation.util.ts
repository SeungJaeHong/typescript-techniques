export function roleCheck<D, T>(
  selector: (data: D) => T,
  roles: T[]
): (value: D) => boolean {
  return (value: D) => roles.includes(selector(value));
}
