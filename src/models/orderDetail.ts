import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { CommonSchema } from "../utility/commonModel";
import { OrderMaster } from "./order";
import { Product } from "./product";

@Entity()
export class OrderDetail extends CommonSchema {
  @Column()
  quantity!: number;

  @Column({ type: "float", default: 0.0 })
  discount!: number;

  @Column({ type: "float" })
  price!: number;

  @Column({ type: "float" })
  totalPrice!: number;

  @Column({ type: "float" })
  totalDiscountedPrice!: number;

  @Column({ type: "float" })
  totalDiscountPrice!: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "productId" })
  product!: Product;

  @ManyToOne(() => OrderMaster, (order) => order.orderDetails)
  order!: OrderMaster;
}
