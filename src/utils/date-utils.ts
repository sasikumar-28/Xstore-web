import { parseISO } from "date-fns";

const now = () => new Date();

function parse(date: string | number): Date {
  return typeof date === "string" ? parseISO(date) : new Date(date);
}

export const DateUtils = {
  now,
  parse,
};
