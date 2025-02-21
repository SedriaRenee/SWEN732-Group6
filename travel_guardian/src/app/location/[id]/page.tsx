import { getLocation } from '@/model/location';
import LocationClient from './LocationClient';

export default async function Location({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const locId = resolvedParams.id;

  const location = await getLocation(parseInt(locId) ?? -1);

  if (location) {
    const newChildren = location.children.sort((a, b) => a.name.localeCompare(b.name));
    return <LocationClient location={{...location, children: newChildren}} />;
  } else {
    <div className="flex flex-col gap-4 items-center">
      <a href="/" className="text-blue text-bold">Back to Search</a>
      <h1 className="text-red text-bold">Location not found</h1>  
    </div>;
  }
}