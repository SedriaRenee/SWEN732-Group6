import { getCountries } from "@/model/location";

export default async function Countries() {
  const locations = await getCountries();
  const countries = locations.toSorted((a, b) => a.name.localeCompare(b.name));

  return (
      <div className="flex flex-col gap-4 items-center w-full min-h-screen">
          <h1 className="text-white text-xl font-black"> Countries </h1>

          <ul className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 list-none px-5">
              {countries.map((child) => {
                  return (
                      <li
                          key={child.id}
                          className="border border-gray-300 p-4 rounded-lg shadow-md bg-gray-100 hover:scale-105 transition duration-200 ease-in-out"
                      >
                          <a
                              className="text-blue-500 text-bold"
                              href={`/location/${child.id}`}
                          >
                              {child.name}
                          </a>
                      </li>
                  );
              })}
          </ul>
      </div>
  );
}
