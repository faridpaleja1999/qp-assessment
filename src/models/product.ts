/* The Product class represents a product entity with properties such as name, description, image,
stock count, discount, price, and a many-to-one relationship with Category. */
import { CommonSchema } from "../utility/commonModel";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "./category";

@Entity()
export class Product extends CommonSchema {
  @Column()
  name!: string;

  @Column()
  desc!: string;

  @Column()
  image!: string;

  @Column()
  countInStock!: number;

  @Column({ type: "float", default: 0.0 })
  discount!: number;

  @Column({ type: "float" })
  price!: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: "categoryId" })
  category!: Category;
  // @ManyToOne(() => Category, (prod) => prod.product)
  // @JoinColumn()
  // category!: Category;
}
