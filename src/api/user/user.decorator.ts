// Nest modules
import { createParamDecorator } from '@nestjs/common';
import { ExecutionContext }     from '@nestjs/common';

/**
 * retrieve the current user with a decorator
 * example of a controller method:
 * @Post()
 * someMethod(@Usr() user: User) {
 *   // do something with the user
 * }
 */
export const Usr = createParamDecorator(
  (data : unknown, ctx : ExecutionContext) =>
  {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
