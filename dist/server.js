import app from "./index.js";
import { prisma } from "./lib/prisma.js";
const PORT = process.env.PORT || 5000;
async function main() {
    try {
        await prisma.$connect();
        console.log("connected");
        app.listen(PORT, () => {
            console.log(`listening on ${PORT}`);
        });
    }
    catch (error) {
        console.log(error);
        await prisma.$disconnect();
        process.exit(1);
    }
}
main();
//# sourceMappingURL=server.js.map