import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { CreateCategoryInput } from './inputs/create-category.input';
import { UpdateCategoryInput } from './inputs/update-category.input';
import { Category } from './models/category.model';

@Resolver()
export class CategoriesResolver {
  constructor(private readonly categoryService: CategoriesService) {}

  @Mutation(() => Category)
  createCategory(@Args('data') data: CreateCategoryInput) {
    return this.categoryService.create(data);
  }

  @Mutation(() => Category)
  updateCategory(@Args('data') data: UpdateCategoryInput) {
    return this.categoryService.update(data);
  }

  @Mutation(() => Category)
  deleteCategory(@Args('id', { type: () => ID }) id: string) {
    return this.categoryService.delete(id);
  }
}
