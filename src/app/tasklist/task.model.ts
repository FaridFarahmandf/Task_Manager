export interface TaskModel {
  id:number,
  description: string;
  priority: string;
  status: string;
  title: string;
  assigned_users: [
    {
      country: string;
      email: string;
      id: number;
      name: string;
      role: string;
      selectedUser: boolean;
      username: string;
    },
  ];
  creator: {
    country: string;
    email: string;
    id: number;
    name: string;
    role: string;
    selectedUser: boolean;
    username: string;
  };
}
