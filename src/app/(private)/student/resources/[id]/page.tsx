import { ResourceDetailPage } from '@/src/features/student/resources-detail';

interface ResourceDetailRouteProps {
  params: Promise<{ id: string }>;
}

export default async function StudentResourceDetailPage({
  params,
}: ResourceDetailRouteProps) {
  const { id } = await params;

  return <ResourceDetailPage resourceId={id} />;
}
