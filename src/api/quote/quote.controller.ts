import { Body, Controller, Get, Inject, Post, Render, Param, Res, Req, Response, UseGuards, Request } from '@nestjs/common';
import { response } from 'express';
import { QuoteService } from 'src/api/quote/quote.service';
import { User } from '../../shared/models/user.model';
import { QuoteBody } from '../../shared/types/quote.type';


@Controller('quote')
export class QuoteController 
{
  constructor
  (
		// si on l'inject pas dnas quoteModule : 
		// error Nest can't resolve dependencies of the QuoteController (?, QuoteService)
		// faut l'ajouter dans quote module provider 
		private readonly quoteService : QuoteService
  ) {}

	@Post('storage_data')
	public async save_quote(@Body() body : QuoteBody, @Request() request, @Response() response,) : Promise<any>
	{
		// ? means optional if no request n'exist pas, no recherche
		// if (request && request.cookies && request.cookies.token)
		const isAuthenticated = request?.cookies?.token?.length;
		// console.log('isAuthenticated', isAuthenticated)

		// destructuring assignment
		const [ quoteResponse, id ] = await this.quoteService.createQuote(isAuthenticated, body);
		return response.redirect('/front/quote?status=' + quoteResponse + '&id=' + id);
	}
}
