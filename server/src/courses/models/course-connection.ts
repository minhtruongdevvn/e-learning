import { Paginated } from 'src/common/pagination/pagination';
import { Course } from './course.model';

export class CourseConnection extends Paginated(Course) {}
