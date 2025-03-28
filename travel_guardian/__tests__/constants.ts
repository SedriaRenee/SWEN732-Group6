import { LocationResult } from "@/model/location";
import { location, report } from "@prisma/client";

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
