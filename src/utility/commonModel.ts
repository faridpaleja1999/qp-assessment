import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
} from "typeorm";

@Entity()
export class CommonSchema extends BaseEntity {
  //   @PrimaryGeneratedColumn("uuid") //if we want uuid as id
  @PrimaryGeneratedColumn() //if we want incremented id
  id!: number;

  @CreateDateColumn({ type: "timestamp", nullable: true })
  createdAt!: Date | null;

  @UpdateDateColumn({ type: "timestamp", nullable: true })
  updatedAt!: Date | null;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @DeleteDateColumn({
    type: "timestamp",
    default: null,
  })
  deletedAt!: Date | null;

  @Column("varchar", {
    nullable: true,
  })
  createdBy!: number | null;

  @Column("varchar", {
    nullable: true,
  })
  updatedBy!: number | null;
}
