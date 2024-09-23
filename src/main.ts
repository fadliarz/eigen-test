/**
 * Configuration
 *
 */
import { Api } from "./common/shared";
import App from "./app";
import PrismaClientSingleton from "./common/class/PrismaClientSingleton";
import MemberRouter from "./modules/member/router/member.router";
import BookRouter from "./modules/book/router/book.router";
import LoanRouter from "./modules/loan/router/loan.router";

const routers: Api[] = [
  { router: MemberRouter() },
  { router: BookRouter() },
  { router: LoanRouter() },
];

const port = Number(process.env.PORT) || 5000;

/**
 * Make instance of application
 *
 */
const app = new App(routers, port);

/**
 * Make instance of prisma
 *
 */
const prisma = PrismaClientSingleton.getInstance();

prisma
  .$connect()
  .then(async () => {
    console.log("Successfully establishing database connection!");

    app.express.listen(port, () => {
      console.log(`Server is running on the port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Failed establishing a database connection!");

    console.error("error: ", error);
  });
