// Nest modules
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';

// External modules
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../../shared/models/user.model';

// type Reponse
import { AuthResponse } from '../../shared/enums/auth-response.enum'
import { RegisterResponse } from '../../shared/enums/register-response.enum'

// Service
import { UserService } from '../user/user.service';
import { UserBody } from '../../shared/types/user.type';


// crypter le mot de pass :
// npm install bcrypt            -->
// npm install -D @types/bcrypt  -->en mode developpement

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async register(body : UserBody): Promise<RegisterResponse> 
  {
    // convertion du mot de passe de clair vers hash
    const hash = await bcrypt.hash(body.password, 10);

    // check if email exists
    const userExists = await this.userRepository.findOne({
      where: [{ email: body.email }],
    });
    if (userExists) {
      return RegisterResponse.USER_ALREADY_EXISTS;
    }

    // creer un new user
    const user = new User();
    user.email = body.email;
    user.password = hash;
    user.question = body.question;
    user.answer = body.answer;
    user.firstname = body.firstname;
    user.lastname = body.lastname;
    user.mobile = body.mobile;
    console.log(body.address);
    user.address = body.address;
    user.birth = body.birth;
    await this.userRepository.insert(user);

    return RegisterResponse.SUCCESS;
  }

  public async forgotpassword(email: string, password: string, question: number, answer: string): Promise<RegisterResponse | AuthResponse>
  {
    // hash password
    const hash = await bcrypt.hash(password, 10);

    // check if email exists
    const user = await this.userService.getUserByEmail(email)

    if (!user)
      return AuthResponse.USER_NOT_FOUND;
    
    //check if question and answer are good
    if (user.question != question || user.answer != answer) {
      return AuthResponse.AUTHENTICATION_FAIL;
    }
    await this.userRepository.update(
      {
        email,
      },
      {
        password: hash,
      },
    ); // faire le update
    return RegisterResponse.SUCCESS;
  }

  public async authenticate(email: string, password: string ): Promise<User | AuthResponse>
  {
    const user = await this.userService.getUserByEmail(email);

    if (!user) 
      return AuthResponse.USER_NOT_FOUND;

    // bcrpy a un system pour comparer 2 password : compareSync(input, password in db)
    const pwdMatch = bcrypt.compareSync(password, user.password);
    if (!pwdMatch)
      return AuthResponse.AUTHENTICATION_FAIL;
  
    return user;
  }

  public async validateUser(payload: JwtPayload): Promise<User>{
    const user = await this.userRepository.findOne({
      where: [{ id: payload.id }],
    });

    if (user !== undefined && user.email === payload.email) return user;

    // FIXME change UnauthorizedException by RegisterResponse
    throw new UnauthorizedException();
  }
  
  public async sendemail(email: string, status : RegisterResponse): Promise<void>{
    const nodemailer = require('nodemailer');
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'lbblk1998@gmail.com',
        pass: 'ypariofyuxjjgdjo',
      },
    });
    let Emailsubject : string;
    if(status == RegisterResponse.USER_ALREADY_EXISTS)
    {
      Emailsubject = 'Your account SNWLC ASSURANCE has already existed'
    }
    else
    {
      Emailsubject = 'Your account SNWLC ASSURANCE has been created successfully'
    }
    let mailOptions = {
      from: '"SNWLC ASSURANCE" <lbblk1998@gmail.com>', // sender
      to: email, // receivers
      subject: Emailsubject, // Subject line
      // send html body
      // text: 'Hello world?', // plain text body
      html: '<b>Please log in to this URL</b> http://13.36.135.25/front' // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    }); 
  }


}
