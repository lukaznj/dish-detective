export default async function EditWorkerManagerAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      Here admin can edit account for employee with ID: {id}
    </div>
  );
}
