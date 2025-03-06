import { getLocation } from '@/model/location';
import LocationPage from '../../../components/LocationPage';

export default async function Location({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const locId = resolvedParams.id;

  const location = await getLocation(parseInt(locId) ?? -1);

  if (location) {
    return <LocationPage location={location} />;
  } else {
    return <div className="flex flex-col gap-4 items-center">
      <h1 className="text-red text-bold">Location not found</h1>  
    </div>;
  }
}