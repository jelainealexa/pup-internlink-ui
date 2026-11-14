import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <h1>PUP InternLink</h1>

      <p>Internship Management System</p>

      <div className="prototype-box">
        <h2>Login Placeholder</h2>

        <p>
          Authentication is not implemented yet. This is only for testing the
          user flow.
        </p>

        <div>
          <label>Email</label>
          <br />
          <input placeholder="coordinator@pup.edu.ph" />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input type="password" placeholder="Password" />
        </div>

        <br />

        <Link href="/dashboard">
          <button>Enter Coordinator Portal</button>
        </Link>
      </div>
    </main>
  );
}