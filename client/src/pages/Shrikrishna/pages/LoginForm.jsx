import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUserData, login } from "../../../redux/auth/auth.actions";
import Loading from "../../Loading";

export default function LoginForm({ handleForgot }) {

  const { isAuth, loading } = useSelector(
    (store) => store.auth)

  const [user, setUser] = useState({ email: "", password: "" });

  const dispatch = useDispatch();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleClick = () => {
    
    if (!user.email || !user.password ) {
      toast({
        title: "All fields are mandatory",
        description: "Please fill all the details",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else {
      dispatch(login(user))
      
      
    }

   
  };



  if(loading ){
    return <Loading/>
  }

  if (isAuth) {
    toast({
      title: "Logged in successfully",
      description: "Go and get exciting offers...",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
  
    let token = JSON.parse(localStorage.getItem("token"))
    
    dispatch(getUserData(token.email))
    return <Navigate to="/" />;
  }
 




  return (
    <Box zIndex={500} >
      <Flex
        zIndex={100}
        align={"center"}
        justify={"center"}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading color={"white"} fontSize={"4xl"}>
              Sign in
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            zIndex={100}
            bg="whiteAlpha.300"
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel color={"#f45f02"}>Email address</FormLabel>
                <Input
                  value={user.user}
                  color={"white"}
                  onChange={handleChange}
                  type="email"
                  name="email"
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel color={"#f45f02"}>Password</FormLabel>
                <Input
                  value={user.setUser}
                  color={"white"}
                  onChange={handleChange}
                  type="password"
                  name="password"
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox color={"#f45f02"}>Remember me</Checkbox>
                  <Button
                    onClick={handleForgot}
                    bg="transparent"
                    _hover={{ color: "#f45f02" }}
                    color={"blue.400"}
                  >
                    Forgot password?
                  </Button>
                </Stack>
                <Button
                onClick={handleClick}
                  bg={"#f45f02"}
                  color={"white"}
                  _hover={{
                    border: "1px solid #f45f02",
                    bg: "white",
                    color: "#f45f02",
                  }}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Box>
  );
}
