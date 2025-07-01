import CreateGameForm from "@/components/CreateGameForm";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import React from "react";

const CreateGamePage: React.FC = () => {
  const router = useRouter();

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <Layout
      title="Create New Game - FizzBuzz Game"
      description="Create your own custom FizzBuzz game variant"
      className="min-h-screen bg-gray-100"
    >
      <CreateGameForm onCancel={handleCancel} />
    </Layout>
  );
};

export default CreateGamePage;
