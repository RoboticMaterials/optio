export function getPageNameFromPath(pathname) {
  let trimmedPathname = pathname.replace("/", "");
  if (trimmedPathname === "") trimmedPathname = "Dashboards";
  return trimmedPathname;
}
