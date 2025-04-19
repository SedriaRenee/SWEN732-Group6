import { LocationResult } from "@/model/location";
import { discussions, location, reply, report, user } from "@prisma/client";

export const testCity: location = {
  name: "Test City",
  type: "city",
  lat: "0",
  lon: "0",
  parentId: null,
  id: 1,
};

export const testCityLocationResult: LocationResult = {
  name: "Test City",
  type: "city",
  parentName: "",
  id: 1,
};

export const testNewCity: location = {
  name: "Sample City",
  type: "city",
  lat: "0",
  lon: "0",
  parentId: null,
  id: 2 /* 1 is taken by testCity, used for all tests */,
};

export const testReport: report = {
  name: "Test Report",
  desc: "Test Description",
  locId: 1,
  tag: "HIGH-RISK",
  id: 1,
  created: new Date(),
};

export const testNewReport: report = {
  name: "Test New Report",
  desc: "Test Description",
  locId: 1,
  tag: "LOW-RISK",
  id: 2,
  created: new Date(),
};

export const testUser: user = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  password: "password123",
  first_name: "Test",
  last_name: "User",
  resetToken: null,
  resetTokenExpiry: null,
};

export const testNewUser: user = {
  id: 2,
  username: "sampleuser",
  email: "sample@example.com",
  password: "wordpass321",
  first_name: "Sample",
  last_name: "User",
  resetToken: null,
  resetTokenExpiry: null,
};

export const testDiscussion: discussions = {
  id: 1,
  title: "Test Discussion",
  content: "Test Content",
  locationId: 1,
  creatorId: 1,
  created_at: new Date(),
};

export const testReports: report[] = [
  {
    name: "Los Angelous",
    desc: "A sinful city.",
    locId: 3,
    tag: "HIGH-RISK",
    created: new Date(),
    id: 1,
  },
  {
    name: "Dukie Land",
    desc: "Duck headquarters.",
    locId: 3,
    tag: "LOW-RISK",
    created: new Date(),
    id: 2,
  },
  {
    name: "Rockland",
    desc: " Place full of rocks.",
    locId: 3,
    tag: "NO-RISK",
    created: new Date(),
    id: 3,
  },
];

export const testReply: reply = {
    creatorId: 1,
    discussionId: 1,
    content: "This is a test reply",
    created_at: new Date(),
    id: 1,
    parentId: null
};