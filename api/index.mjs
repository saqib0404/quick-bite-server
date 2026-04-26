var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express3 from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

// src/modules/menuItem/menuItem.router.ts
import express from "express";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.2.0",
  "engineVersion": "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  role   Role    @default(CUSTOMER)\n  phone  String?\n  status String? @default("ACTIVE")\n\n  businessName String?\n  isApproved   Boolean @default(true)\n\n  addresses String?\n\n  cart Cart?\n\n  orders      Order[]      @relation("CustomerOrders")\n  reviews     Review[]\n  restaurants Restaurant[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Role {\n  CUSTOMER\n  PROVIDER\n  ADMIN\n}\n\nmodel Cart {\n  id String @id @default(cuid())\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  items         Json\n  paymentStatus PaymentStatus @default(UNPAID)\n  payment       Payment?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel MenuItem {\n  id           String     @id @default(cuid())\n  restaurantId String\n  restaurant   Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)\n\n  name        String\n  description String?\n  priceCents  Int\n  imageUrl    String?\n  isAvailable Boolean @default(true)\n\n  cuisine CuisineType\n\n  orders  Order[]\n  reviews Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([restaurantId])\n}\n\nenum CuisineType {\n  MEAT\n  FISH\n  VEG\n  VEGAN\n}\n\nmodel Order {\n  id         String @id @default(cuid())\n  customerId String\n  customer   User   @relation("CustomerOrders", fields: [customerId], references: [id], onDelete: Restrict)\n\n  menuItemId String\n  menuItem   MenuItem @relation(fields: [menuItemId], references: [id], onDelete: Restrict)\n\n  restaurantId String\n  restaurant   Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Restrict)\n\n  paymentId String?\n  payment   Payment? @relation(fields: [paymentId], references: [id], onDelete: SetNull)\n\n  status                  OrderStatus @default(PENDING)\n  quantity                Int         @default(1)\n  totalCents              Int\n  notes                   String?\n  deliveryAddressSnapshot Json? // store address snapshot at time of order\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([customerId])\n  @@index([restaurantId])\n  @@index([menuItemId])\n  @@index([paymentId])\n}\n\nenum OrderStatus {\n  PENDING\n  CONFIRMED\n  PREPARING\n  OUT_FOR_DELIVERY\n  DELIVERED\n  CANCELLED\n}\n\nmodel Payment {\n  id                 String        @id @default(uuid(7))\n  amount             Float\n  transactionId      String        @unique @db.Uuid()\n  stripeEventId      String?       @unique\n  stripeSessionId    String?       @unique\n  status             PaymentStatus @default(UNPAID)\n  // invoiceUrl         String?\n  paymentGatewayData Json?\n  createdAt          DateTime      @default(now())\n  updatedAt          DateTime      @updatedAt\n\n  cartId String @unique\n  cart   Cart   @relation(fields: [cartId], references: [id], onDelete: Cascade)\n\n  orders Order[]\n\n  @@index([cartId])\n  @@index([transactionId])\n  @@map("payments")\n}\n\nenum PaymentStatus {\n  PAID\n  UNPAID\n  FAILED\n  EXPIRED\n}\n\nmodel Restaurant {\n  id String @id @default(cuid())\n\n  providerId String\n  provider   User   @relation(fields: [providerId], references: [id], onDelete: Cascade)\n\n  name        String\n  description String?\n  phone       String?\n  addressLine String\n  city        String\n  isActive    Boolean @default(true)\n\n  menuItems MenuItem[]\n  orders    Order[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([providerId])\n}\n\nmodel Review {\n  id     String @id @default(cuid())\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  menuItemId String\n  menuItem   MenuItem @relation(fields: [menuItemId], references: [id], onDelete: Cascade)\n\n  rating  Int // validate 1..5 in API layer\n  comment String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId, menuItemId]) // one review per item per user\n  @@index([menuItemId])\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"businessName","kind":"scalar","type":"String"},{"name":"isApproved","kind":"scalar","type":"Boolean"},{"name":"addresses","kind":"scalar","type":"String"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"restaurants","kind":"object","type":"Restaurant","relationName":"RestaurantToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"items","kind":"scalar","type":"Json"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"payment","kind":"object","type":"Payment","relationName":"CartToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"MenuItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"restaurantId","kind":"scalar","type":"String"},{"name":"restaurant","kind":"object","type":"Restaurant","relationName":"MenuItemToRestaurant"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"priceCents","kind":"scalar","type":"Int"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"cuisine","kind":"enum","type":"CuisineType"},{"name":"orders","kind":"object","type":"Order","relationName":"MenuItemToOrder"},{"name":"reviews","kind":"object","type":"Review","relationName":"MenuItemToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"menuItemId","kind":"scalar","type":"String"},{"name":"menuItem","kind":"object","type":"MenuItem","relationName":"MenuItemToOrder"},{"name":"restaurantId","kind":"scalar","type":"String"},{"name":"restaurant","kind":"object","type":"Restaurant","relationName":"OrderToRestaurant"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrderToPayment"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"totalCents","kind":"scalar","type":"Int"},{"name":"notes","kind":"scalar","type":"String"},{"name":"deliveryAddressSnapshot","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"stripeSessionId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToPayment"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToPayment"}],"dbName":"payments"},"Restaurant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"User","relationName":"RestaurantToUser"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"addressLine","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"menuItems","kind":"object","type":"MenuItem","relationName":"MenuItemToRestaurant"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToRestaurant"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"menuItemId","kind":"scalar","type":"String"},{"name":"menuItem","kind":"object","type":"MenuItem","relationName":"MenuItemToReview"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  }
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CartScalarFieldEnum: () => CartScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  JsonNullValueInput: () => JsonNullValueInput,
  MenuItemScalarFieldEnum: () => MenuItemScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  RestaurantScalarFieldEnum: () => RestaurantScalarFieldEnum,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.2.0",
  engine: "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Cart: "Cart",
  MenuItem: "MenuItem",
  Order: "Order",
  Payment: "Payment",
  Restaurant: "Restaurant",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  phone: "phone",
  status: "status",
  businessName: "businessName",
  isApproved: "isApproved",
  addresses: "addresses"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CartScalarFieldEnum = {
  id: "id",
  userId: "userId",
  items: "items",
  paymentStatus: "paymentStatus",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MenuItemScalarFieldEnum = {
  id: "id",
  restaurantId: "restaurantId",
  name: "name",
  description: "description",
  priceCents: "priceCents",
  imageUrl: "imageUrl",
  isAvailable: "isAvailable",
  cuisine: "cuisine",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  menuItemId: "menuItemId",
  restaurantId: "restaurantId",
  paymentId: "paymentId",
  status: "status",
  quantity: "quantity",
  totalCents: "totalCents",
  notes: "notes",
  deliveryAddressSnapshot: "deliveryAddressSnapshot",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  amount: "amount",
  transactionId: "transactionId",
  stripeEventId: "stripeEventId",
  stripeSessionId: "stripeSessionId",
  status: "status",
  paymentGatewayData: "paymentGatewayData",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  cartId: "cartId"
};
var RestaurantScalarFieldEnum = {
  id: "id",
  providerId: "providerId",
  name: "name",
  description: "description",
  phone: "phone",
  addressLine: "addressLine",
  city: "city",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  userId: "userId",
  menuItemId: "menuItemId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var JsonNullValueInput = {
  JsonNull: JsonNull2
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var OrderStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};
var PaymentStatus = {
  PAID: "PAID",
  UNPAID: "UNPAID",
  FAILED: "FAILED",
  EXPIRED: "EXPIRED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/modules/menuItem/menuItem.service.ts
var createMenuItem = async (userId, data) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, status: true }
  });
  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }
  if (user.role !== "PROVIDER") {
    const err = new Error("Only providers can create menu items.");
    err.statusCode = 403;
    throw err;
  }
  if (user.status === "SUSPENDED") {
    const err = new Error("User is not SUSPENDED.");
    err.statusCode = 403;
    throw err;
  }
  const restaurant = await prisma.restaurant.findFirst({
    where: { providerId: userId },
    select: { id: true }
  });
  if (!restaurant) {
    const err = new Error("Restaurant not found or you don't own it.");
    err.statusCode = 404;
    throw err;
  }
  const result = await prisma.menuItem.create({
    data: {
      restaurantId: restaurant.id,
      name: data.name,
      description: data.description ?? null,
      priceCents: data.priceCents,
      imageUrl: data.imageUrl ?? null,
      isAvailable: data.isAvailable ?? true,
      cuisine: data.cuisine
    }
  });
  return result;
};
var getAllMenuItems = async ({ cuisine, minPrice } = {}) => {
  const where = {
    isAvailable: true
  };
  if (cuisine) {
    where.cuisine = cuisine;
  }
  if (typeof minPrice === "number") {
    where.priceCents = { gte: minPrice };
  }
  return prisma.menuItem.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });
};
var getMenuItemById = async (id) => {
  const result = await prisma.menuItem.findUnique({
    where: {
      id
    }
  });
  return result;
};
var getMenuItemByRestaurantId = async (id) => {
  const result = await prisma.menuItem.findMany({
    where: {
      restaurantId: id
    }
  });
  return result;
};
var updateMenuItem = async (providerId, menuItemId, data) => {
  const existing = await prisma.menuItem.findFirst({
    where: {
      id: menuItemId,
      restaurant: {
        providerId
      }
    },
    select: { id: true }
  });
  if (!existing) {
    const err = new Error("Menu item not found or you don't have access.");
    err.statusCode = 404;
    throw err;
  }
  if (data.priceCents !== void 0) {
    if (!Number.isInteger(data.priceCents) || data.priceCents <= 0) {
      const err = new Error("priceCents must be a positive integer.");
      err.statusCode = 400;
      throw err;
    }
  }
  return prisma.menuItem.update({
    where: { id: menuItemId },
    data: {
      ...data.name !== void 0 ? { name: data.name } : {},
      ...data.description !== void 0 ? { description: data.description } : {},
      ...data.priceCents !== void 0 ? { priceCents: data.priceCents } : {},
      ...data.imageUrl !== void 0 ? { imageUrl: data.imageUrl } : {},
      ...data.isAvailable !== void 0 ? { isAvailable: data.isAvailable } : {},
      ...data.cuisine !== void 0 ? { cuisine: data.cuisine } : {}
    }
  });
};
var deleteMenuItem = async (providerId, menuItemId) => {
  const existing = await prisma.menuItem.findFirst({
    where: { id: menuItemId, restaurant: { providerId } },
    select: { id: true }
  });
  if (!existing) {
    const err = new Error("Menu item not found or you don't have access.");
    err.statusCode = 404;
    throw err;
  }
  return prisma.menuItem.delete({ where: { id: menuItemId } });
};
var menuItemService = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  getMenuItemByRestaurantId,
  updateMenuItem,
  deleteMenuItem
};

// src/modules/menuItem/menuItem.controller.ts
var CUISINES = ["MEAT", "FISH", "VEG", "VEGAN"];
var createMenuItem2 = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(400).json({
        success: false,
        message: "Authentication required!"
      });
    }
    const result = await menuItemService.createMenuItem(req.user.id, req.body);
    return res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllMenuItems2 = async (req, res, next) => {
  try {
    const cuisineRaw = req.query.cuisine;
    const minPriceRaw = req.query.minPrice;
    const cuisine = typeof cuisineRaw === "string" && CUISINES.includes(cuisineRaw) ? cuisineRaw : void 0;
    const minPrice = typeof minPriceRaw === "string" && !Number.isNaN(Number(minPriceRaw)) ? Number(minPriceRaw) : void 0;
    const result = await menuItemService.getAllMenuItems({
      cuisine,
      minPrice
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
var getMenuItemById2 = async (req, res, next) => {
  try {
    const { menuItemId } = req.params;
    const result = await menuItemService.getMenuItemById(menuItemId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
var getMenuItemByRestaurantId2 = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const result = await menuItemService.getMenuItemByRestaurantId(restaurantId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
var updateMenuItem2 = async (req, res, next) => {
  try {
    const providerId = req.user.id;
    const { menuItemId } = req.params;
    const result = await menuItemService.updateMenuItem(providerId, menuItemId, req.body);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var deleteMenuItem2 = async (req, res, next) => {
  try {
    const providerId = req.user.id;
    const { menuItemId } = req.params;
    const result = await menuItemService.deleteMenuItem(providerId, menuItemId);
    res.status(200).json({
      success: true,
      message: "Menu item deleted.",
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var MenuItemController = {
  createMenuItem: createMenuItem2,
  getAllMenuItems: getAllMenuItems2,
  getMenuItemById: getMenuItemById2,
  getMenuItemByRestaurantId: getMenuItemByRestaurantId2,
  updateMenuItem: updateMenuItem2,
  deleteMenuItem: deleteMenuItem2
};

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
var trustedOriginsList = [
  process.env.APP_URL,
  // Local development
  process.env.PROD_APP_URL,
  // Production frontend
  process.env.FRONTEND_URL
  // Additional frontend URL
].filter(Boolean);
if (process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "production") {
  trustedOriginsList.push("https://*.vercel.app");
}
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etcc
  }),
  trustedOrigins: trustedOriginsList,
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      },
      businessName: {
        type: "string",
        required: false
      },
      isApproved: {
        type: "boolean",
        defaultValue: true,
        required: false
      },
      addresses: {
        type: "string",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account consent"
    }
  },
  // session: {
  //     cookieCache: {
  //         enabled: true,
  //         maxAge: 5 * 60, // 5 minutes
  //     },
  // },
  // advanced: {
  //     cookiePrefix: "better-auth",
  //     useSecureCookies: process.env.NODE_ENV === "production",
  //     sameSiteCookie: "none", // Allow cross-domain cookies for Vercel deployments
  //     crossSubDomainCookies: {
  //         enabled: true, // Enable for cross-domain cookie handling
  //     },
  //     disableCSRFCheck: true, // Allow requests without Origin header (Postman, mobile apps, etc.)
  // },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // 5 minutes
    }
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false
    },
    disableCSRFCheck: true
    // Allow requests without Origin header (Postman, mobile apps, etc.)
  }
});

// src/middlewares/auth.middleware.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session || !session.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required."
        });
      }
      const role = session.user.role;
      if (!role) {
        return res.status(403).json({
          success: false,
          message: "User role not assigned."
        });
      }
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { status: true }
      });
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role,
        status: dbUser?.status
      };
      if (roles.length && !roles.includes(role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource."
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/modules/menuItem/menuItem.router.ts
var router = express.Router();
router.get("/", MenuItemController.getAllMenuItems);
router.get("/restaurant/:restaurantId", MenuItemController.getMenuItemByRestaurantId);
router.get("/:menuItemId", MenuItemController.getMenuItemById);
router.post("/", auth2("PROVIDER" /* PROVIDER */), MenuItemController.createMenuItem);
router.patch("/:menuItemId", auth2("PROVIDER" /* PROVIDER */), MenuItemController.updateMenuItem);
router.delete("/:menuItemId", auth2("PROVIDER" /* PROVIDER */), MenuItemController.deleteMenuItem);
var menuItemsRouter = router;

// src/modules/restaurant/restaurant.router.ts
import express2 from "express";

// src/modules/restaurant/restaurant.service.ts
var createRestaurant = async (data, userId) => {
  const isRestaurantExist = await prisma.restaurant.findFirst({
    where: {
      providerId: userId
    }
  });
  if (isRestaurantExist) {
    throw new Error("You Already have a restaurant ");
  }
  const result = await prisma.restaurant.create({
    data: {
      ...data,
      providerId: userId
    }
  });
  return result;
};
var getAllRestaurants = async () => {
  return prisma.restaurant.findMany({
    where: {
      isActive: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getRestaurantById = async (id) => {
  const result = await prisma.restaurant.findUnique({
    where: {
      id
    }
  });
  return result;
};
var getRestaurantByProviderId = async (id) => {
  const result = await prisma.restaurant.findFirst({
    where: {
      providerId: id
    }
  });
  return result;
};
var updateRestaurant = async (restaurantId, providerId, data) => {
  if (!restaurantId) {
    const err = new Error("restaurantId is required.");
    err.statusCode = 400;
    throw err;
  }
  const user = await prisma.user.findUnique({
    where: { id: providerId },
    select: { role: true, status: true }
  });
  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }
  if (user.role !== "PROVIDER") {
    const err = new Error("Only providers can update restaurant.");
    err.statusCode = 403;
    throw err;
  }
  if ((user.status || "").toUpperCase() === "SUSPENDED") {
    const err = new Error("You are SUSPENDED. You cannot update restaurant.");
    err.statusCode = 403;
    throw err;
  }
  const existing = await prisma.restaurant.findFirst({
    where: {
      id: restaurantId,
      providerId
    },
    select: { id: true }
  });
  if (!existing) {
    const err = new Error("Restaurant not found or you don't have access.");
    err.statusCode = 404;
    throw err;
  }
  const allowedData = {};
  if (data.name !== void 0) {
    const name = data.name.trim();
    if (!name) {
      const err = new Error("name cannot be empty.");
      err.statusCode = 400;
      throw err;
    }
    allowedData.name = name;
  }
  if (data.description !== void 0) {
    allowedData.description = data.description === null ? null : data.description.trim() || null;
  }
  if (data.phone !== void 0) {
    allowedData.phone = data.phone === null ? null : data.phone.trim() || null;
  }
  if (data.addressLine !== void 0) {
    const addressLine = data.addressLine.trim();
    if (!addressLine) {
      const err = new Error("addressLine cannot be empty.");
      err.statusCode = 400;
      throw err;
    }
    allowedData.addressLine = addressLine;
  }
  if (data.city !== void 0) {
    const city = data.city.trim();
    if (!city) {
      const err = new Error("city cannot be empty.");
      err.statusCode = 400;
      throw err;
    }
    allowedData.city = city;
  }
  if (data.isActive !== void 0) {
    if (typeof data.isActive !== "boolean") {
      const err = new Error("isActive must be boolean.");
      err.statusCode = 400;
      throw err;
    }
    allowedData.isActive = data.isActive;
  }
  if (Object.keys(allowedData).length === 0) {
    const err = new Error("No valid fields provided for update.");
    err.statusCode = 400;
    throw err;
  }
  return prisma.restaurant.update({
    where: { id: restaurantId },
    data: allowedData,
    select: {
      id: true,
      providerId: true,
      name: true,
      description: true,
      phone: true,
      addressLine: true,
      city: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
};
var restaurantService = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  getRestaurantByProviderId
};

// src/modules/restaurant/restaurant.controller.ts
var createRestaurant2 = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized!"
      });
    }
    const result = await restaurantService.createRestaurant(req.body, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
var getRestaurants = async (req, res, next) => {
  try {
    const result = await restaurantService.getAllRestaurants();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
var getRestaurantById2 = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const result = await restaurantService.getRestaurantById(restaurantId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
var getRestaurantByProviderId2 = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const result = await restaurantService.getRestaurantByProviderId(providerId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
var updateRestaurant2 = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!"
      });
    }
    const { restaurantId } = req.params;
    const result = await restaurantService.updateRestaurant(
      restaurantId,
      req.user.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Restaurant updated.",
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var RestaurantController = {
  createRestaurant: createRestaurant2,
  getRestaurants,
  getRestaurantById: getRestaurantById2,
  updateRestaurant: updateRestaurant2,
  getRestaurantByProviderId: getRestaurantByProviderId2
};

// src/modules/restaurant/restaurant.router.ts
var router2 = express2.Router();
router2.get("/", RestaurantController.getRestaurants);
router2.get("/provider/:providerId", auth2("PROVIDER" /* PROVIDER */), RestaurantController.getRestaurantByProviderId);
router2.get("/:restaurantId", RestaurantController.getRestaurantById);
router2.patch("/:restaurantId", auth2("PROVIDER" /* PROVIDER */), RestaurantController.updateRestaurant);
router2.post("/", auth2("PROVIDER" /* PROVIDER */), RestaurantController.createRestaurant);
var restaurantRouter = router2;

// src/middlewares/globalErrorEandler.ts
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  if (typeof err?.statusCode === "number") {
    statusCode = err.statusCode;
    errorMessage = err.message || errorMessage;
  }
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You have provided invalid field type or missing field.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 404;
      errorMessage = "Record not found.";
    } else if (err.code === "P2002") {
      statusCode = 409;
      errorMessage = "Duplicate key error.";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error occurred during query execution.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMessage = "Authentication failed. Please check your credentials.";
    } else if (err.errorCode === "P1001") {
      statusCode = 503;
      errorMessage = "Can't reach database server.";
    }
  }
  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: process.env.NODE_ENV === "production" ? void 0 : err
  });
}
var globalErrorEandler_default = errorHandler;

// src/modules/cart/cart.router.ts
import { Router } from "express";

// src/modules/cart/cart.service.ts
var addToCart = async (userId, data) => {
  const { menuItemId } = data;
  const quantity = data.quantity ?? 1;
  if (!menuItemId) {
    const err = new Error("menuItemId is required.");
    err.statusCode = 400;
    throw err;
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    const err = new Error("quantity must be a positive integer.");
    err.statusCode = 400;
    throw err;
  }
  const menuItem = await prisma.menuItem.findUnique({
    where: { id: menuItemId },
    select: { id: true, isAvailable: true }
  });
  if (!menuItem || !menuItem.isAvailable) {
    const err = new Error("Menu item not available.");
    err.statusCode = 400;
    throw err;
  }
  let cart = await prisma.cart.findUnique({
    where: { userId }
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
        items: [{ menuItemId, quantity }]
      }
    });
    return cart;
  }
  const items = cart.items ?? [];
  const existing = items.find((i) => i.menuItemId === menuItemId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ menuItemId, quantity });
  }
  return prisma.cart.update({
    where: { userId },
    data: { items }
  });
};
var getMyCart = async (userId) => {
  return prisma.cart.findUnique({
    where: { userId }
  });
};
var clearCart = async (userId) => {
  return prisma.cart.update({
    where: { userId },
    data: { items: [] }
  });
};
var removeCartItemByMenuId = async (userId, menuItemId) => {
  if (!menuItemId) {
    const err = new Error("menuItemId is required.");
    err.statusCode = 400;
    throw err;
  }
  const cart = await prisma.cart.findUnique({
    where: { userId }
  });
  if (!cart) {
    const err = new Error("Cart not found.");
    err.statusCode = 404;
    throw err;
  }
  const items = (cart.items ?? []).filter((i) => i.menuItemId !== menuItemId);
  if ((cart.items ?? []).length === items.length) {
    const err = new Error("Item not found in cart.");
    err.statusCode = 404;
    throw err;
  }
  const updated = await prisma.cart.update({
    where: { userId },
    data: { items }
  });
  return updated;
};
var cartService = {
  addToCart,
  getMyCart,
  clearCart,
  removeCartItemByMenuId
};

// src/modules/cart/cart.controller.ts
var addToCart2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await cartService.addToCart(userId, req.body);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var getMyCart2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await cartService.getMyCart(userId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var clearCart2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await cartService.clearCart(userId);
    res.status(200).json({
      success: true,
      message: "Cart cleared."
    });
  } catch (err) {
    next(err);
  }
};
var removeCartItemByMenuId2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { menuItemId } = req.params;
    const result = await cartService.removeCartItemByMenuId(userId, menuItemId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var CartController = {
  addToCart: addToCart2,
  getMyCart: getMyCart2,
  clearCart: clearCart2,
  removeCartItemByMenuId: removeCartItemByMenuId2
};

// src/modules/cart/cart.router.ts
var router3 = Router();
router3.post("/add", auth2("CUSTOMER" /* CUSTOMER */), CartController.addToCart);
router3.get("/", auth2("CUSTOMER" /* CUSTOMER */), CartController.getMyCart);
router3.delete("/item/:menuItemId", auth2("CUSTOMER" /* CUSTOMER */), CartController.removeCartItemByMenuId);
router3.delete("/clear", auth2("CUSTOMER" /* CUSTOMER */), CartController.clearCart);
var cartRouter = router3;

// src/modules/order/order.router.ts
import { Router as Router2 } from "express";

// src/modules/order/order.service.ts
import { v7 as uuidv7 } from "uuid";

// src/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// src/modules/order/order.service.ts
var getallOrders = async () => {
  return prisma.order.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
};
var checkoutFromCart = async (customerId, input) => {
  if (!input?.deliveryAddressSnapshot) {
    const err = new Error("deliveryAddressSnapshot is required for delivery (Cash on Delivery).");
    err.statusCode = 400;
    throw err;
  }
  const frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) {
    const err = new Error("FRONTEND_URL is missing in environment variables.");
    err.statusCode = 500;
    throw err;
  }
  const cart = await prisma.cart.findUnique({
    where: { userId: customerId },
    select: {
      id: true,
      userId: true,
      items: true,
      user: {
        select: {
          email: true,
          name: true
        }
      }
    }
  });
  if (!cart) {
    const err = new Error("Cart not found.");
    err.statusCode = 404;
    throw err;
  }
  const cartItems = cart.items ?? [];
  if (cartItems.length === 0) {
    const err = new Error("Cart is empty.");
    err.statusCode = 400;
    throw err;
  }
  for (const item of cartItems) {
    if (!item.menuItemId || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      const err = new Error("Cart contains invalid items.");
      err.statusCode = 400;
      throw err;
    }
  }
  const menuItemIds = cartItems.map((i) => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds } },
    select: {
      id: true,
      priceCents: true,
      isAvailable: true,
      restaurantId: true,
      restaurant: { select: { isActive: true } }
    }
  });
  const map = new Map(menuItems.map((m) => [m.id, m]));
  for (const item of cartItems) {
    const m = map.get(item.menuItemId);
    if (!m) {
      const err = new Error(`Menu item not found: ${item.menuItemId}`);
      err.statusCode = 404;
      throw err;
    }
    if (!m.isAvailable || !m.restaurant.isActive) {
      const err = new Error("Cart contains unavailable items.");
      err.statusCode = 400;
      throw err;
    }
  }
  const totalCents = cartItems.reduce((sum, item) => {
    const menuItem = map.get(item.menuItemId);
    return sum + menuItem.priceCents * item.quantity;
  }, 0);
  const transactionId = String(uuidv7());
  const payment = await prisma.payment.upsert({
    where: {
      cartId: cart.id
    },
    update: {
      amount: totalCents / 100,
      transactionId,
      status: PaymentStatus.UNPAID,
      paymentGatewayData: {
        deliveryAddressSnapshot: input.deliveryAddressSnapshot,
        notes: input.notes ?? null
      }
    },
    create: {
      cartId: cart.id,
      amount: totalCents / 100,
      transactionId,
      status: PaymentStatus.UNPAID,
      paymentGatewayData: {
        deliveryAddressSnapshot: input.deliveryAddressSnapshot,
        notes: input.notes ?? null
      }
    }
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: cartItems.map((item) => {
      const menuItem = map.get(item.menuItemId);
      return {
        price_data: {
          currency: "bdt",
          product_data: {
            name: "Menu Item"
          },
          unit_amount: menuItem.priceCents
        },
        quantity: item.quantity
      };
    }),
    metadata: {
      cartId: cart.id,
      paymentId: payment.id,
      customerId
    },
    payment_intent_data: {
      metadata: {
        cartId: cart.id,
        paymentId: payment.id,
        customerId
      }
    },
    client_reference_id: cart.id,
    customer_email: cart.user.email ?? void 0,
    success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/cart`
  });
  await prisma.payment.update({
    where: {
      id: payment.id
    },
    data: {
      stripeSessionId: session.id,
      paymentGatewayData: {
        deliveryAddressSnapshot: input.deliveryAddressSnapshot,
        notes: input.notes ?? null,
        stripeSessionId: session.id
      }
    }
  });
  return {
    message: "Stripe payment session created successfully.",
    totalCents,
    payment,
    paymentUrl: session.url
  };
};
var getMyOrders = async (customerId) => {
  return prisma.order.findMany({
    where: { customerId },
    include: {
      menuItem: true,
      restaurant: true
    },
    orderBy: { createdAt: "desc" }
  });
};
var getProviderOrders = async (providerId) => {
  return prisma.order.findMany({
    where: {
      restaurant: { providerId }
    },
    include: {
      menuItem: true,
      restaurant: true,
      customer: { select: { id: true, name: true, email: true, phone: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};
var updateOrderStatusByProvider = async (providerId, orderId, status) => {
  const allowed = [
    OrderStatus.CONFIRMED,
    OrderStatus.PREPARING,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED
  ];
  if (!allowed.includes(status)) {
    const err = new Error("Invalid status value.");
    err.statusCode = 400;
    throw err;
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      restaurant: { providerId }
    },
    select: { id: true, status: true }
  });
  if (!order) {
    const err = new Error("Order not found or you don't have access.");
    err.statusCode = 404;
    throw err;
  }
  if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.DELIVERED) {
    const err = new Error("This order can no longer be updated.");
    err.statusCode = 400;
    throw err;
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
};
var orderService = {
  getallOrders,
  checkoutFromCart,
  getMyOrders,
  getProviderOrders,
  updateOrderStatusByProvider
};

// src/modules/order/order.controller.ts
var getallOrders2 = async (req, res, next) => {
  try {
    const result = await orderService.getallOrders();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
var checkoutFromCart2 = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const { deliveryAddressSnapshot, notes } = req.body;
    const result = await orderService.checkoutFromCart(customerId, {
      deliveryAddressSnapshot,
      notes
    });
    res.status(201).json({
      success: true,
      ...result
    });
  } catch (err) {
    next(err);
  }
};
var getMyOrders2 = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const result = await orderService.getMyOrders(customerId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
var getProviderOrders2 = async (req, res, next) => {
  try {
    const providerId = req.user.id;
    const result = await orderService.getProviderOrders(providerId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
var updateOrderStatusByProvider2 = async (req, res, next) => {
  try {
    const providerId = req.user.id;
    const { orderId } = req.params;
    const { status } = req.body;
    const result = await orderService.updateOrderStatusByProvider(providerId, orderId, status);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
var OrderController = {
  getallOrders: getallOrders2,
  checkoutFromCart: checkoutFromCart2,
  getMyOrders: getMyOrders2,
  getProviderOrders: getProviderOrders2,
  updateOrderStatusByProvider: updateOrderStatusByProvider2
};

// src/modules/order/order.router.ts
var router4 = Router2();
router4.get("/", auth2("ADMIN" /* ADMIN */), OrderController.getallOrders);
router4.post("/checkout", auth2("CUSTOMER" /* CUSTOMER */), OrderController.checkoutFromCart);
router4.get("/me", auth2("CUSTOMER" /* CUSTOMER */), OrderController.getMyOrders);
router4.get("/provider", auth2("PROVIDER" /* PROVIDER */), OrderController.getProviderOrders);
router4.patch("/:orderId/status", auth2("PROVIDER" /* PROVIDER */), OrderController.updateOrderStatusByProvider);
var orderRouter = router4;

// src/modules/review/review.router.ts
import { Router as Router3 } from "express";

// src/modules/review/review.service.ts
var createOrUpdateReview = async (userId, data) => {
  const { menuItemId, rating, comment } = data;
  if (!menuItemId) {
    const err = new Error("menuItemId is required.");
    err.statusCode = 400;
    throw err;
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    const err = new Error("rating must be an integer between 1 and 5.");
    err.statusCode = 400;
    throw err;
  }
  const menuItem = await prisma.menuItem.findUnique({
    where: { id: menuItemId },
    select: { id: true }
  });
  if (!menuItem) {
    const err = new Error("Menu item not found.");
    err.statusCode = 404;
    throw err;
  }
  const hasAnyOrder = await prisma.order.findFirst({
    where: {
      customerId: userId,
      menuItemId
    },
    select: { id: true }
  });
  if (!hasAnyOrder) {
    const err = new Error("You can only review items you have ordered.");
    err.statusCode = 403;
    throw err;
  }
  const review = await prisma.review.upsert({
    where: {
      userId_menuItemId: { userId, menuItemId }
    },
    create: {
      userId,
      menuItemId,
      rating,
      comment: comment ?? null
    },
    update: {
      rating,
      comment: comment ?? null
    }
  });
  return review;
};
var getReviewsByMenuItem = async (menuItemId) => {
  if (!menuItemId) {
    const err = new Error("menuItemId is required.");
    err.statusCode = 400;
    throw err;
  }
  return prisma.review.findMany({
    where: { menuItemId },
    include: {
      user: {
        select: { id: true, name: true, image: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var deleteMyReview = async (userId, reviewId) => {
  if (!reviewId) {
    const err = new Error("reviewId is required.");
    err.statusCode = 400;
    throw err;
  }
  const review = await prisma.review.findFirst({
    where: { id: reviewId, userId },
    select: { id: true }
  });
  if (!review) {
    const err = new Error("Review not found or you don't have access.");
    err.statusCode = 404;
    throw err;
  }
  return prisma.review.delete({
    where: { id: reviewId }
  });
};
var reviewService = {
  createOrUpdateReview,
  getReviewsByMenuItem,
  deleteMyReview
};

// src/modules/review/review.controller.ts
var createOrUpdateReview2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await reviewService.createOrUpdateReview(userId, req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var getReviewsByMenuItem2 = async (req, res, next) => {
  try {
    const { menuItemId } = req.params;
    const result = await reviewService.getReviewsByMenuItem(menuItemId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var deleteMyReview2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;
    const result = await reviewService.deleteMyReview(userId, reviewId);
    res.status(200).json({
      success: true,
      message: "Review deleted.",
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var ReviewController = {
  createOrUpdateReview: createOrUpdateReview2,
  getReviewsByMenuItem: getReviewsByMenuItem2,
  deleteMyReview: deleteMyReview2
};

// src/modules/review/review.router.ts
var router5 = Router3();
router5.get("/menu-item/:menuItemId", ReviewController.getReviewsByMenuItem);
router5.post("/", auth2("CUSTOMER" /* CUSTOMER */), ReviewController.createOrUpdateReview);
router5.delete("/:reviewId", auth2("CUSTOMER" /* CUSTOMER */), ReviewController.deleteMyReview);
var reviewRouter = router5;

// src/modules/user/user.router.ts
import { Router as Router4 } from "express";

// src/modules/user/user.service.ts
var ALLOWED_STATUS = ["ACTIVE", "SUSPENDED"];
var getAllUsers = async () => {
  return prisma.user.findMany({
    where: {
      role: {
        in: ["CUSTOMER", "PROVIDER"]
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      phone: true,
      status: true,
      businessName: true,
      isApproved: true,
      createdAt: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var updateUserStatus = async (userId, status) => {
  if (!userId) {
    const err = new Error("userId is required.");
    err.statusCode = 400;
    throw err;
  }
  if (typeof status !== "string" || !ALLOWED_STATUS.includes(status)) {
    const err = new Error(`Invalid status. Allowed: ${ALLOWED_STATUS.join(", ")}`);
    err.statusCode = 400;
    throw err;
  }
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true }
  });
  if (!userExists) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }
  if (userExists.role === "ADMIN") {
    const err = new Error("Cannot suspend an admin.");
    err.statusCode = 403;
    throw err;
  }
  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true
    }
  });
};
var updateMe = async (userId, data) => {
  const allowedData = {};
  if (data.name !== void 0) allowedData.name = data.name;
  if (data.phone !== void 0) allowedData.phone = data.phone;
  if (data.image !== void 0) allowedData.image = data.image;
  if (data.addresses !== void 0) allowedData.addresses = data.addresses;
  if (data.businessName !== void 0) allowedData.businessName = data.businessName;
  if (Object.keys(allowedData).length === 0) {
    const err = new Error("No valid fields provided for update.");
    err.statusCode = 400;
    throw err;
  }
  return prisma.user.update({
    where: { id: userId },
    data: allowedData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      addresses: true,
      businessName: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
};
var getMe = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      addresses: true,
      businessName: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
};
var userService = {
  getAllUsers,
  updateUserStatus,
  updateMe,
  getMe
};

// src/modules/user/user.controller.ts
var getAllUsers2 = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var updateUserStatus2 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    const result = await userService.updateUserStatus(userId, status);
    res.status(200).json({
      success: true,
      message: "User status updated.",
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var updateMe2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await userService.updateMe(userId, req.body);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var getMe2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await userService.getMe(userId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var UserController = {
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  updateMe: updateMe2,
  getMe: getMe2
};

// src/modules/user/user.router.ts
var router6 = Router4();
router6.get("/", auth2("ADMIN" /* ADMIN */), UserController.getAllUsers);
router6.get("/me", auth2(), UserController.getMe);
router6.patch("/me", auth2(), UserController.updateMe);
router6.patch("/:userId/status", auth2("ADMIN" /* ADMIN */), UserController.updateUserStatus);
var userRouter = router6;

// src/modules/payment/payment.service.ts
var toInputJson = (value) => {
  return JSON.parse(JSON.stringify(value));
};
var handlerStripeWebhookEvent = async (event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id
    }
  });
  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping.`);
    return { message: `Event ${event.id} already processed. Skipping.` };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const cartId = session.metadata?.cartId;
      const paymentId = session.metadata?.paymentId;
      const customerId = session.metadata?.customerId;
      if (!cartId || !paymentId || !customerId) {
        console.error("Missing metadata in Stripe session.");
        return { message: "Missing metadata." };
      }
      if (session.payment_status !== "paid") {
        console.log(`Checkout completed but payment status is ${session.payment_status}.`);
        return { message: "Payment not paid yet." };
      }
      const payment = await prisma.payment.findUnique({
        where: {
          id: paymentId
        },
        include: {
          cart: true
        }
      });
      if (!payment) {
        console.error(`Payment ${paymentId} not found.`);
        return { message: "Payment not found." };
      }
      if (payment.status === PaymentStatus.PAID) {
        console.log(`Payment ${paymentId} already marked as paid.`);
        return { message: "Payment already processed." };
      }
      const cart = payment.cart;
      if (!cart || cart.id !== cartId) {
        console.error(`Cart mismatch for payment ${paymentId}.`);
        return { message: "Cart mismatch." };
      }
      const cartItems = Array.isArray(cart.items) ? cart.items : [];
      if (cartItems.length === 0) {
        console.error("Cart is empty. Orders may already have been created.");
        return { message: "Cart is empty." };
      }
      const menuItemIds = cartItems.map((item) => item.menuItemId);
      const menuItems = await prisma.menuItem.findMany({
        where: {
          id: { in: menuItemIds }
        },
        select: {
          id: true,
          priceCents: true,
          restaurantId: true,
          isAvailable: true,
          restaurant: {
            select: {
              isActive: true
            }
          }
        }
      });
      const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));
      const savedPaymentData = payment.paymentGatewayData;
      const createdOrders = await prisma.$transaction(async (tx) => {
        const orders = [];
        await tx.payment.update({
          where: {
            id: paymentId
          },
          data: {
            status: PaymentStatus.PAID,
            stripeEventId: event.id,
            paymentGatewayData: toInputJson({
              deliveryAddressSnapshot: savedPaymentData?.deliveryAddressSnapshot ?? null,
              notes: savedPaymentData?.notes ?? null,
              checkoutSession: {
                id: session.id,
                paymentStatus: session.payment_status,
                amountTotal: session.amount_total,
                currency: session.currency,
                customerEmail: session.customer_details?.email ?? session.customer_email,
                paymentIntent: session.payment_intent,
                metadata: session.metadata
              }
            })
          }
        });
        await tx.cart.update({
          where: {
            id: cartId
          },
          data: {
            paymentStatus: PaymentStatus.PAID
          }
        });
        for (const item of cartItems) {
          const menuItem = menuItemMap.get(item.menuItemId);
          if (!menuItem) {
            throw new Error(`Menu item not found: ${item.menuItemId}`);
          }
          if (!menuItem.isAvailable || !menuItem.restaurant.isActive) {
            throw new Error("Cart contains unavailable items.");
          }
          const order = await tx.order.create({
            data: {
              customerId,
              menuItemId: menuItem.id,
              restaurantId: menuItem.restaurantId,
              paymentId,
              status: OrderStatus.PENDING,
              quantity: item.quantity,
              totalCents: menuItem.priceCents * item.quantity,
              notes: savedPaymentData?.notes ?? null,
              deliveryAddressSnapshot: savedPaymentData?.deliveryAddressSnapshot ?? null
            }
          });
          orders.push(order);
        }
        await tx.cart.update({
          where: {
            id: cartId
          },
          data: {
            items: []
          }
        });
        return orders;
      });
      return {
        message: "Payment successful and orders created.",
        orderCount: createdOrders.length,
        orders: createdOrders
      };
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      const paymentId = session.metadata?.paymentId;
      if (paymentId) {
        await prisma.payment.update({
          where: {
            id: paymentId
          },
          data: {
            status: PaymentStatus.EXPIRED,
            stripeEventId: event.id,
            paymentGatewayData: session
          }
        });
      }
      return { message: "Checkout session expired." };
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentId = paymentIntent.metadata?.paymentId;
      if (paymentId) {
        await prisma.payment.update({
          where: {
            id: paymentId
          },
          data: {
            status: PaymentStatus.FAILED,
            stripeEventId: event.id,
            paymentGatewayData: paymentIntent
          }
        });
      }
      return { message: "Payment failed." };
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
      return { message: `Unhandled event type ${event.type}` };
  }
};
var PaymentService = {
  handlerStripeWebhookEvent
};

// src/modules/payment/payment.controller.ts
var handleStripeWebhookEvent = async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret");
    return res.status(400).json({ message: "Missing Stripe signature or webhook secret" });
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    return res.status(400).json({ message: "Invalid Stripe webhook signature" });
  }
  try {
    const result = await PaymentService.handlerStripeWebhookEvent(event);
    return res.status(200).json({
      success: true,
      message: "Stripe webhook event processed successfully",
      data: result
    });
  } catch (error) {
    console.error("Error handling Stripe webhook event:", error);
    return res.status(500).json({ message: "Error handling Stripe webhook event" });
  }
};
var PaymentController = {
  handleStripeWebhookEvent
};

// src/app.ts
var app = express3();
app.post("/webhook", express3.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent);
app.use(express3.json());
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL,
  process.env.FRONTEND_URL
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin) || origin === "http://localhost:3000" || origin === "http://localhost:3001";
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
    // maxAge: 86400, // 24 hours
  })
);
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/menu-items", menuItemsRouter);
app.use("/restaurants", restaurantRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);
app.use("/reviews", reviewRouter);
app.use("/users", userRouter);
app.use(globalErrorEandler_default);

// src/index.ts
var index_default = app;
export {
  index_default as default
};
