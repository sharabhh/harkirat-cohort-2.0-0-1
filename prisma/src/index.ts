import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function insertUser(username: string, firstName: string, lastName: string, password: string) {
    const res = await prisma.user.create({
        data:{
            email: username,
            firstName,
            lastName,
            password
        },
        select: {
            id: true,
            password: true
        }
    })
    console.log(res);
    
}

async function findUser(username: string) {
    const res = await prisma.user.findMany({
        where: {
            email: username
        }
    })
    console.log(res);
    
}

// insertUser('sharabh2@gmail.com', 'sharabh', 'mishra', 'hacky')
findUser('sharabh1@gmail.com')