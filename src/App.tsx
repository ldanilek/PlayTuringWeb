import { Layout } from "@/Layout";
import { SignInForm } from "@/SignInForm";
import { UserMenu } from "@/components/UserMenu";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { ChallengeSelector } from "@/Game/ChallengeSelector";
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Challenge } from "@/Game/Challenge";

function ChallengeWrapper() {
  const { index } = useParams();
  return (
    <Challenge index={Number(index)} />
  );
}

export default function App() {
  const user = useQuery(api.users.viewer);
  return (
    <Layout
      menu={
        <Authenticated>
          <UserMenu>{user?.name ?? user?.email}</UserMenu>
        </Authenticated>
      }
    >
      <>
        <Authenticated>
          <Router>
            <Routes>
              <Route path="/" element={<ChallengeSelector />} />
              <Route path="/challenge/:index" element={<ChallengeWrapper />} />
            </Routes>
          </Router>
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </>
    </Layout>
  );
}
