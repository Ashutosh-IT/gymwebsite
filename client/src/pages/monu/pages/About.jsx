import React from 'react'
import {
    Box,
    
    Container,
    
    SimpleGrid,
    Stack,
    VStack
  } from '@chakra-ui/react';
import Card from '../components/Card';

import ashu from "../assets/ashu.png"



import ProfileCard from '../components/ProfileCard';
let first=[
{
  linkedin:"https://www.linkedin.com/in/ashutoshkumar-it/",
  github:"https://github.com/Ashutosh-IT",
  title:"Ashutosh Kumar",
  desc:"Backend Developer",
  portfolio:"https://github.com/Ashutosh-IT",
  image:"https://i.ibb.co/NWpcV49/ashu.png"  
},
  {
    image:"https://i.ibb.co/nbqxNBb/shivam.jpg",
    desc:"Frontend Developer",
    title:"Shivam Kumar",
    portfolio:"https://github.com/ShivamKumaar01",
    github:"https://github.com/ShivamKumaar01",
    linkedin:"https://www.linkedin.com/in/shivam-kumaar01/"
  },
  {
    image:"https://media.licdn.com/dms/image/D5603AQHntgG-cL0J2w/profile-displayphoto-shrink_800_800/0/1710643400739?e=1718236800&v=beta&t=zw3nahlKEhbe3_BKnhnyP_4P93c8nlyOGZfIQlNEk8I",
    title:"Shivshant P",
    desc:"Frontend",
    portfolio:"https://641krishna.github.io/",
    github:"https://github.com/shivashanti",
    linkedin:"https://www.linkedin.com/in/shivshant-prasad21351126198/"
  },

]

const About = () => {
  return (
   <VStack
   justify="center"
   p={5}
   margin={"auto"}
   bgGradient="linear-gradient(180deg, rgba(0,0,0,1) 20%, rgba(64,64,64,1) 93%)" maxW="full" minH={{base:"100%", md:"", lg:"70vh", xl:"70vh"}}>
       <SimpleGrid
       spacing={10}
       maxW={"1400px"}
      
       columns={[1,1,2,3,5]}  
        >
           {
           first.map((el)=><Card image={el.image} title={el.title} key={el.image} portfolio={el.portfolio}  desc={el.desc} github={el.github}  linkedin={el.linkedin} />)
           } 
      </SimpleGrid>
      {/* <Stack direction={["column","column","row","row"]} spacing="10" w={["50%","50%","80%","55%"]} mt="10" mb="10">
           {
           second.map((el)=><Card image={el.image} title={el.title} key={el.image} portfolio={el.portfolio}   github={el.github}  linkedin={el.linkedin} />)
           } 
      </Stack> */}
    
 {/* <SimpleGrid columns={[1,2,3,5]} w={["50%","70%","80%","90%"]}  mb="10">
           {
           first.map((el)=><ProfileCard image={el.image} title={el.title} key={el.image} facebook={el.facebook}  twitter={el.twitter} github={el.github} />)
           } 
  </SimpleGrid> */}

   </VStack>
  )
}

export default About