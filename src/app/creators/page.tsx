/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";




import Container from "../_components/Container/container";
import {
Button,
CardBody,
Input,
Image,
useDisclosure,
} from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";
import { Card } from "@nextui-org/react";
import React from "react";
import { useFormState } from "react-dom";
import { api } from "$/src/trpc/react";
import UserCard from "../_components/User/user";




export default function Campaign({ params }: { params: { id: string } }) {
const { user } = useUser();
const { isOpen, onOpen, onOpenChange } = useDisclosure();




const campaign = api.campaigns.getOne.useQuery({
  id: params.id ?? "",
});




const users = api.users.get.useQuery({});




const ids = users.data?.data.map(user => user.id) ?? [];
const userIds = users.data?.data.map(user => user.userId) ?? [];








 const usersHardcode1 = [
  {
  
    id: ids[0],
    userId: userIds[0],
    email: "FinancialAid@uct.ac.za",
    firstName: "University of Cape Town",
    about: "UCT is a community of exceptionally talented students, teachers and researchers – and a wide range of professional, administrative support and service staff – all of whom are committed to help change this world for the better. We encourage one another to work hard, not only to earn degrees or public recognition, but also to be leaders in this increasingly changing world.",
    instagram: "john.doe",
    twitter: "johndoe",
    linkedin: "johndoe",
    imageUrl: "https://www.lstmed.ac.uk/sites/default/files/styles/mc-580-16x9-node/public/content/pages/images/UCT.jpeg?itok=O0dc31th"
  },
];




const usersHardcode2 = [
  {
    id: "124",
    userId: "123457",
    email: "nsfas@sun.ac.za",
    firstName: "Stellenbosch University",
    about: "Stellenbosch University (SU) is a public research university situated in Stellenbosch, a town in the Western Cape province of South Africa.",
    instagram: "john.doe",
    twitter: "johndoe",
    linkedin: "johndoe",
    imageUrl: "https://yiba.co.za/wp-content/uploads/2021/04/Stellenbosch_University_new_logo_for-web-01.jpg"
  },
];




return (
  <>




  <Container className="flex flex-col items-center">
    {users.data && (
      <div className="grid w-full grid-cols-1 gap-2 overflow-scroll p-4 md:grid-cols-3 xl:grid-cols-4">
        {usersHardcode1.map((user) => (
          <UserCard key={user.id} user={user}></UserCard>
        ))}
      </div>
    )}
  </Container>




  <Container className="flex flex-col items-center">
    {users.data && (
      <div className="grid w-full grid-cols-1 gap-2 overflow-scroll p-4 md:grid-cols-3 xl:grid-cols-4">
        {usersHardcode2.map((user) => (
          <UserCard key={user.id} user={user}></UserCard>
        ))}
      </div>
    )}
  </Container>
   </>
);
}



