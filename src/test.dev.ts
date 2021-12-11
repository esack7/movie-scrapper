import { initializeDB, getListOfPostsFromDB } from "./database";

async function Main() {
    await getListOfPostsFromDB();
}

Main();