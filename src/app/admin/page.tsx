import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import {
  getAdminStats,
  listAppUsers,
  listGenerations,
  listPaymentEvents,
} from "@/lib/data";
import { ButtonLink } from "@/components/button-link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

const DOC_LABEL: Record<string, string> = {
  resume: "Resume",
  cover_letter: "Cover letter",
};

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?redirect=/admin");
  if (!user.isAdmin) redirect("/");

  const [stats, users, generations, payments] = await Promise.all([
    getAdminStats(),
    listAppUsers(200),
    listGenerations({ limit: 50 }),
    listPaymentEvents(50),
  ]);

  const emailById = new Map(users.map((u) => [u.id, u.email]));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as {user.email} (admin)
          </p>
        </div>
        <ButtonLink href="/" variant="outline" size="sm">
          Back to site
        </ButtonLink>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total users</CardDescription>
            <CardTitle className="text-3xl">{stats.userCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total generations</CardDescription>
            <CardTitle className="text-3xl">{stats.generationCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Payment events</CardDescription>
            <CardTitle className="text-3xl">{payments.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
          <CardDescription>All registered accounts, newest first.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Method</th>
                <th className="py-2 pr-4 font-medium">Role</th>
                <th className="py-2 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">{u.provider}</td>
                  <td className="py-2 pr-4">
                    {u.is_admin ? (
                      <Badge>admin</Badge>
                    ) : (
                      <Badge variant="secondary">user</Badge>
                    )}
                  </td>
                  <td className="py-2 text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent generations</CardTitle>
          <CardDescription>Last {generations.length} documents across all users.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {generations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No generations yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr className="border-b">
                  <th className="py-2 pr-4 font-medium">User</th>
                  <th className="py-2 pr-4 font-medium">Profession</th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {generations.map((g) => (
                  <tr key={g.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">
                      {g.user_id ? emailById.get(g.user_id) ?? "—" : (
                        <span className="text-muted-foreground">guest</span>
                      )}
                    </td>
                    <td className="py-2 pr-4 capitalize">{g.profession_slug}</td>
                    <td className="py-2 pr-4">{DOC_LABEL[g.doc_type] ?? g.doc_type}</td>
                    <td className="py-2 text-muted-foreground">
                      {new Date(g.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment events</CardTitle>
          <CardDescription>Creem webhook audit log, newest first.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payment events yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr className="border-b">
                  <th className="py-2 pr-4 font-medium">Event</th>
                  <th className="py-2 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{p.event_type}</td>
                    <td className="py-2 text-muted-foreground">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
