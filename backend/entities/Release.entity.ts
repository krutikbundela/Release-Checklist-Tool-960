import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("releases")
export class Release {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "date" })
  release_date!: string;

  @Column({ type: "varchar", length: 50, default: "planned" })
  status!: string;

  @Column("boolean", { array: true, default: [false, false, false, false, false, false, false] })
  steps!: boolean[];

  @Column({ type: "text", nullable: true })
  additional_info!: string | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
