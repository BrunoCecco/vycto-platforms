export default async function NewUsername({
  params,
}: {
  params: { username: string };
}) {
  return <div>Welcome, {params.username}</div>;
}
