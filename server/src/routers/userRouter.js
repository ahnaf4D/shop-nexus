import express from 'express';
const userRouter = express.Router();
const users = [
  {
    id: 1001,
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 1002,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: 1003,
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: 1004,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    id: 1005,
    name: 'Sarah Brown',
    email: 'sarah.brown@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
];
const posts = [
  {
    userId: 1,
    id: 1,
    title:
      'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
  },
  {
    userId: 1,
    id: 2,
    title: 'qui est esse',
    body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla',
  },
  {
    userId: 1,
    id: 3,
    title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
    body: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut',
  },
];
userRouter.get(`/`, (req, res) => {
  console.log(`Users authenticate with ${req.body.id}`);
  res.status(200).send({ users });
});
userRouter.get(`/posts`, (req, res) => {
  console.log(`user posts returned`);
  res.status(200).send(posts);
});
export { userRouter };
