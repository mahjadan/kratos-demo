import { Link } from 'gatsby';

export default function NotFoundPage() {
  return (
    <main>
      <h1>404: Not Found</h1>
      <Link to='/'>Go back to homepage</Link>
      <p>You just hit a route that doesn't exist.</p>
    </main>
  );
}
