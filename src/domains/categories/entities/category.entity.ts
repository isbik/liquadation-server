import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { CloudFile } from 'src/domains/cloud-storage/entities/cloud-file.entity';

@Entity()
export class Category {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @ManyToOne({ nullable: true, primary: false, mapToPk: false })
  image: CloudFile;

  @ManyToOne({
    nullable: true,
    primary: false,
    mapToPk: false,
    onDelete: 'cascade',
  })
  parentCategory: Category;
}
