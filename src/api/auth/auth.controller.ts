import { Body, Controller, Get, Inject, Post, Render, Param, Res, Req, Response, UseGuards, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Request as RequestType } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Usr } from '../user/user.decorator';

import { User } from '../../shared/models/user.model';
import { UserBody } from '../../shared/types/user.type';
import { RegisterResponse } from 'src/shared/enums/register-response.enum';
import { AuthResponse } from 'src/shared/enums/auth-response.enum';
import { QuoteService } from '../quote/quote.service';
import { sendemail } from '../../common/helper/env.helper';


// import { User } from '@models/user.model';

@Controller('auth')
export class AuthController
{
  //generate token
  constructor
  (
    private readonly authService : AuthService,
    private readonly quoteService : QuoteService,
    private jwtService           : JwtService,
  ) { }

  // Navigateur -> localhost:3000/auth/register
  // Affichage page register
  // Remplissage du formulaire
  // Envoi du formulaire -> localhost:3000/front/register
  

  @Post('register')
  public async register(
    @Body() body : UserBody,
    @Response() response
    ) : Promise<any>
  {
    // Appeler la method register dans auth.service
    // status est un enum
    const status = await this.authService.register(body);

    if (status === RegisterResponse.SUCCESS)
    {
      await this.quoteService.checkAndInsertTemporaryQuote(body.email);
    }

    console.log('register!')
    console.log('status register : ', status)

    this.authService.sendemail(body.email, status)
    // sendemail(body.email, status)
    return response.redirect('/front/login?status=' + status); // Rediriger vers la page login apres avoir registe
  }

  @Post('forgotpassword')
  public async forgotpassword(
    @Body() body : { email : string, password : string, question : number, answer : string },
    @Response() response
    ) : Promise<any>
  {
    // Appeler la method forgotpassword dans auth.service
    // status est un enum
    const status = await this.authService.forgotpassword(body.email, body.password, body.question, body.answer);

    console.log('status forgotpassword : ', status)

    if(status != "SUCCESS") {
      return response.redirect('/front/forgotpassword?status=' + status); // Rediriger vers la page login apres avoir registe
    } else {
      return response.redirect('/front/login?status=' + status + "_PASSWORD_RESET"); // Rediriger vers la page login apres avoir registe
    }

  }
  
  @Post('logout')
  @UseGuards(AuthGuard())
  public async logout(@Usr() user : User, @Response() response) : Promise<any>
  {
    const jwtPayload = this.getUserPayload(user);
    const token = await this.jwtService.signAsync(jwtPayload);
    const d = new Date();
    response.cookie('token', token, { expires : d });
    response.redirect('/front/login');
  }

  private getUserPayload(user : User) : JwtPayload
  {
    const payload : JwtPayload = {
      id    : user.id,
      email : user.email,
    };
    return payload;
  }

  // sousmettre les données de formulaire
  // Post : envoyer les données de formulaire dans body
  @Post('authenticate')
  public async authenticate(@Body() body : { email : string, password : string }, @Response() response) : Promise<any>
  { 
    // Get user
    const res = await this.authService.authenticate(body.email, body.password)
    
    if (typeof res !== 'object')
    {
      response.redirect('/front/login?status=' + res); // AuthResponse
      return;
    }
    // creer un token si user est bon
    const jwtPayload = this.getUserPayload(res); // User

    // une fois connecté, on va envoyer un token basé sur l'info payload
    const token = await this.jwtService.signAsync(jwtPayload);

    const d = new Date();
    d.setSeconds(d.getSeconds() + 43200); //expiration du temps de token

    response.cookie('token', token, { expires : d });
    response.redirect('/front/dashboard')
  }
}
