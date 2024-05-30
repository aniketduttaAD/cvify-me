import { Client, Account, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") 
  .setProject("6648b84e000bb858425b"); 

export const account = new Account(client);

export const storage = new Storage(client);
  