import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field(() => String, { nullable: true })
  endCursor?: string;

  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Boolean)
  hasPreviousPage: boolean;

  @Field(() => String, { nullable: true })
  startCursor?: string;
}

export function EdgeType<TItem>(TItemClass: Type<TItem>) {
  @ObjectType(`${TItemClass.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => TItemClass)
    node: TItem;
  }

  return EdgeType;
}

export function Paginated<TItem>(TItemClass: Type<TItem>) {
  abstract class Edge extends EdgeType(TItemClass) {}

  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [Edge], { nullable: true })
    edges: Array<Edge>;

    // @Field((type) => [TItemClass], { nullable: true })
    // nodes: Array<TItem>;

    @Field(() => PageInfo)
    pageInfo: PageInfo;

    @Field(() => Int)
    totalCount: number;
  }

  return PaginatedType;
}
