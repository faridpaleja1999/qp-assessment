import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { CommonSchema } from "../utility/commonModel";
import { OrderDetail } from "./orderDetail";
import { User } from "./user";
import { OrderStatus } from "../constant/constant";

@Entity()
export class OrderMaster extends CommonSchema {
  @Column({ type: "float" })
  totalAmount!: number;

  @Column({ type: "float" })
  totalDiscount!: number;

  @Column({ type: "float" })
  totalAmountToPay!: number;

  @Column()
  totalItems!: number;

  @Column()
  totalQauntity!: number;

  @CreateDateColumn({ type: "timestamp", default: null })
  deliveredAt!: Date | null;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PLACED,
  })
  orderStatus!: number;

  @OneToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails!: OrderDetail[];
}
