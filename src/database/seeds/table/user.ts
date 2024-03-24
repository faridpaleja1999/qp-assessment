import { QueryRunner } from "typeorm";
import { UserType } from "../../../constant/constant";
import { User } from "../../../models/user";
import { hashingString } from "../../../utility/utils";

const userData = [
  {
    name: "admin",
    email: "admin@gmail.com",
    password: "123456",
    userType: UserType.ADMIN,
  },
  {
    name: "user",
    email: "user@gmail.com",
    password: "123456",
    userType: UserType.USER,
  },
];

const up = async (queryRunner: QueryRunner): Promise<void> => {
  for (const user of userData) {
    user.password = await hashingString(user.password);
  }
  const userRepo = queryRunner.manager.getRepository(User);
  await userRepo.save([...userData]);
};
const down = async (queryRunner: QueryRunner): Promise<void> => {};

export default { up, down };
