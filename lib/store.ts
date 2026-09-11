"use client";

export type Account = { name:string; email:string; role:"brand"|"creator"; company?:string };

const ACCOUNT = "naano-account";
const BOOKINGS = "naano-bookings";

export function getAccount(): Account | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(ACCOUNT);
  return value ? JSON.parse(value) : null;
}

export function saveAccount(account:Account) {
  localStorage.setItem(ACCOUNT, JSON.stringify(account));
}

export function demoLogin(email:string) {
  const existing = getAccount();
  if (existing && existing.email.toLowerCase() === email.toLowerCase()) return existing;
  const creator = /creator|talent|linkedin/i.test(email);
  const account:Account = {
    name: email === "hashim@acme.com" ? "Hashim Khan" : email.split("@")[0],
    email,
    role: creator ? "creator" : "brand",
    company: creator ? undefined : "Acme"
  };
  saveAccount(account);
  return account;
}

export function bookCreator(creatorId:string, campaignId:string) {
  const bookings = JSON.parse(localStorage.getItem(BOOKINGS) || "[]");
  localStorage.setItem(BOOKINGS, JSON.stringify([...bookings, { creatorId, campaignId, createdAt:new Date().toISOString() }]));
}

export function getBookings() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(BOOKINGS) || "[]");
}
