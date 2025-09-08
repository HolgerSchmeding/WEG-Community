// Server component: neutralizes client-manifest generation for this route-group root.
// If this route were ever resolved, redirect users to the real dashboard.
import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/dashboard');
}
