import { Body, Controller, Get, Inject, Post, Render, Param, Response } from '@nestjs/common';

import { UserService } from './user.service';
import { User } from '../../shared/models/user.model';
import { sendemail } from '../../common/helper/env.helper';
import { ContactUsMessageBody } from '../../shared/types/contact-us.type';


@Controller('user')
export class UserController
{

  constructor(private readonly userService : UserService) { }

  // endpoints / routes / browser -> source code
  @Get('user-by-name/:name') //...localhost:3000/user/create-user
  // @Get('get-user/:id')
  // @Put('get-user/:id')
  // @Delete('get-user/:id')
  public getUserByName(@Param('name') data : string) : Promise<User>
  {
    // be careful : can't work
    return this.userService.getUserByEmail(data);
  }
  
  //send data to serveur 
  @Post('contact')
  public async contactMessageSend(@Body() body : ContactUsMessageBody, @Response() response) : Promise<void>
  {
      console.log(body)

      sendemail(body.email, 'SUCCESS', body)
      
      console.log("email done")

      return response.redirect('/front/contact?status=SUCCESS' ); 
  }
}
