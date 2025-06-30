import { useState } from "react";
import { Box, Button, Container, Heading, Input, VStack, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      toast({
        title: "Account created.",
        description: "You can now log in.",
        status: "success",
        isClosable: true,
      });
      navigate("/login");
    } else {
      toast({
        title: "Error",
        description: data.message || "Signup failed",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="sm">
      <VStack spacing={8}>
        <Heading as="h1" size="2xl" textAlign="center" mb={8}>
          Sign Up
        </Heading>
        <Box w="full" bg="white" p={6} rounded="lg" shadow="md">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Input
                placeholder="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
              <Input
                placeholder="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <Button
                type="submit"
                colorScheme="teal"
                isLoading={loading}
                loadingText="Signing up"
                width="full"
              >
                Sign Up
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Container>
  );
};

export default SignUpPage;