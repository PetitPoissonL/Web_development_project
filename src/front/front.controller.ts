import { Body, Controller, Get, Inject, Post, Render, Param, Res, Req, Response, } from '@nestjs/common';
import { Request as RequestType } from 'express';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from '../shared/models/user.model';
import { Usr } from '../api/user/user.decorator';



// Guards pour la protection de la route 

@Controller('front')
export class FrontController
{
  @Get()
  @Render('home')
  public main()
  {
    return;
  }

  @Get('login')
  @Render('login')
  public loginPage() : void
  {
    return;
  }

  @Get('register')
  @Render('register')
  public registerPage() : void
  {
    return;
  }

  @Get('contact')
  @Render('contact')
  public contact() : void
  {
    
    return;
  }

  @Get('ourProducts')
  @Render('ourProducts')
  public ourProducts() : void
  {
    return;
  }

  @Get("forgotpassword")
  @Render('forgotpassword')
  public forgotpasswordPage() : void
  {
    return;
  }

  @Get('dashboard')
  // @Render('dashboard')
  @UseGuards(AuthGuard()) //personne peut aller dashboard sans connecter
  public dashboard(@Usr() user : User, @Response() response) : void
  {
    console.log(user.id)
    return response.render('dashboard', { userEmail : user.email });
  }

  @Get('quote')
  @Render('quote')
  public quotePage() :void
  {
    // Get authenticated user
    // Get permission
    // Send permission to ejs page
    // -> show permission
    return;
  }
  
  @Get('faq')
  @Render('faq')
  public faqPage() : void
  {
    return;
  }

  // @Get('info_contract')
  // @Render('info_contract')
  // public contractPage() : void
  // {
  //   return;
  // }

  @Get('explore_products')
  @Render('explore_products')
  public productsPage() : void
  {
  return;
  }
  
}