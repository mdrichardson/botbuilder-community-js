import { Middleware, TurnContext, ActivityTypes } from 'botbuilder';
import { Engine } from '@botbuildercommunity/middleware-engine-core';
import { WatsonEngine } from './engine';

/**
 * @module botbuildercommunity/middleware-watson-nlu
 */

export class SentimentAnalysis implements Middleware {
    public engine: Engine;
    constructor(public serviceKey: string, public endpoint: string, public options?: any) {
        this.engine = new WatsonEngine(serviceKey, endpoint, options);
    }
    public async onTurn(context: TurnContext, next: () => Promise<void>) {
        if(context.activity.type === ActivityTypes.Message) {
            const input = {
                documents: [
                    {
                        'id': '1'
                        , 'text': context.activity.text
                    }
                ]
            };
            try {
                const result = await this.engine.sentiment(input);
                const s = result.documents[0].score;
                context.turnState.set('sentimentScore', s);
            }
            catch(e) {
                throw new Error(`Failed to process sentiment on ${ context.activity.text }. Error: ${ e }`);
            }
        }
        await next();
    }
}
