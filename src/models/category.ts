import { Column, Entity, OneToMany } from "typeorm";
import { CommonSchema } from "../utility/commonModel";
import { Product } from "./product";

@Entity()
export class Category extends CommonSchema {
  @Column("varchar", { length: 255 })
  name!: string;

  @Column("varchar", { length: 255 })
  image!: string;

  @Column("varchar", { length: 255, nullable: true })
  desc!: string;

  @OneToMany(() => Product, (cat) => cat.category)
  products!: Product[];
}
