export type RouteParameter = {
  name: string;
  link?: string;
  children?: RouteParameter[];
};
