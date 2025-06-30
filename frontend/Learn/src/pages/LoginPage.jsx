import { useState } from "react";
import { Box, Button, Container, Heading, Input, VStack, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
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
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      localStorage.setItem("token", data.token);
      toast({
        title: "Login successful.",
        description: `Welcome, ${data.username}!`,
        status: "success",
        isClosable: true,
      });
      navigate("/");
    } else {
      toast({
        title: "Error",
        description: data.message || "Login failed",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="sm">
      <VStack spacing={8}>
        <Heading as="h1" size="2xl" textAlign="center" mb={8}>
          Login
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
                colorScheme="blue"
                type="submit"
                w="full"
                isLoading={loading}
              >
                Login
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Container>
  );
};

export default LoginPage;